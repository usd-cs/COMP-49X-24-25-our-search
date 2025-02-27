/**
 * Gateway controller for handling API requests from the frontend.
 * This controller serves as the entry point for fetching data and managing
 * business logic by invoking the appropriate backend modules that are
 * responsible for said logic.
 *
 * This controller:
 * - Uses 'ModuleInvoker' to communicate with backend modules.
 * - Performs Proto ↔ Dto conversions for sending data to modules and sending
 *   data from the modules to the frontend.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.gateway;

import COMP_49X_our_search.backend.authentication.OAuthChecker;
import COMP_49X_our_search.backend.gateway.dto.CreateFacultyRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.CreateStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.DisciplineDTO;
import COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000") // TODO: change once the app is
// hosted.
public class GatewayController {
  private final ModuleInvoker moduleInvoker;
  private final OAuthChecker oAuthChecker;

  @Autowired
  public GatewayController(ModuleInvoker moduleInvoker, OAuthChecker oAuthChecker) {
    this.moduleInvoker = moduleInvoker;
    this.oAuthChecker = oAuthChecker;
  }

  @GetMapping("/projects")
  public ResponseEntity<List<DisciplineDTO>> getProjects() {
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setFetcherRequest(
                FetcherRequest.newBuilder()
                    .setFilteredFetcher(
                        FilteredFetcher.newBuilder()
                            .setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS)))
            .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    return ResponseEntity.ok(
        moduleResponse.getFetcherResponse().getProjectHierarchy().getDisciplinesList().stream()
            .map(ProjectHierarchyConverter::protoDisciplineWithMajorsToDto)
            .toList());
  }

  @GetMapping("/students")
  public ResponseEntity<List<DisciplineDTO>> getStudents() {
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setFetcherRequest(
                FetcherRequest.newBuilder()
                    .setFilteredFetcher(
                        FilteredFetcher.newBuilder()
                            .setFilteredType(FilteredType.FILTERED_TYPE_STUDENTS)))
            .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    return ResponseEntity.ok(
        moduleResponse.getFetcherResponse().getProjectHierarchy().getDisciplinesList().stream()
            .map(ProjectHierarchyConverter::protoDisciplineWithMajorsToDto)
            .toList());
  }

  @PostMapping("/api/studentProfiles")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<CreateStudentRequestDTO> createStudent(
      @RequestBody CreateStudentRequestDTO requestBody) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String[] nameParts = requestBody.getName().split(" ", 2);
    // Split the name into two parts at the first space, e.g.
    // "John Doe" -> firstName: "John", lastName: "Doe"
    // "John Doe Bob" -> firstName: "John", lastName: "Doe Bob"
    String firstName = nameParts[0];
    String lastName = nameParts.length > 1 ? nameParts[1] : ""; // Remaining part
    boolean hasPriorExperience;
    if (requestBody.getHasPriorExperience().equals("yes")) {
      hasPriorExperience = true;
    } else {
      hasPriorExperience = false;
    }
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setCreateProfileRequest(
                        CreateProfileRequest.newBuilder()
                            .setStudentProfile(
                                StudentProto.newBuilder()
                                    .setFirstName(firstName)
                                    .setLastName(lastName)
                                    .setEmail(oAuthChecker.getAuthUserEmail(authentication))
                                    .setClassStatus(requestBody.getClassStatus())
                                    .setGraduationYear(Integer.parseInt(requestBody.getGraduationYear()))
                                    .addAllMajors(requestBody.getMajor())
                                    .addAllResearchFieldInterests(
                                        requestBody.getResearchFieldInterests())
                                    .addAllResearchPeriodsInterests(
                                        requestBody.getResearchPeriodsInterest())
                                    .setInterestReason(requestBody.getInterestReason())
                                    .setHasPriorExperience(hasPriorExperience))))
            .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    CreateProfileResponse createProfileResponse = moduleResponse.getProfileResponse().getCreateProfileResponse();
    if (createProfileResponse.getSuccess()) {
      StudentProto createdUser = createProfileResponse.getCreatedStudent();

      CreateStudentRequestDTO responseUser = new CreateStudentRequestDTO();
      responseUser.setName(createdUser.getFirstName() + " " + createdUser.getLastName());
      responseUser.setClassStatus(createdUser.getClassStatus());
      responseUser.setGraduationYear(Integer.toString(createdUser.getGraduationYear()));
      responseUser.setHasPriorExperience(createdUser.getHasPriorExperience()? "yes" : "no");
      responseUser.setInterestReason(createdUser.getInterestReason());
      responseUser.setMajor(createdUser.getMajorsList());
      responseUser.setResearchFieldInterests(createdUser.getResearchFieldInterestsList());
      responseUser.setResearchPeriodsInterest(createdUser.getResearchPeriodsInterestsList());

      return ResponseEntity.status(HttpStatus.CREATED).body(responseUser);
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(null);
  }

  @PostMapping("/api/facultyProfiles")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<CreateFacultyRequestDTO> createFaculty(
      @RequestBody CreateFacultyRequestDTO requestBody) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String[] nameParts = requestBody.getName().split(" ", 2);
    String firstName = nameParts[0];
    String lastName = nameParts.length > 1 ? nameParts[1] : "";

    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setCreateProfileRequest(
                        CreateProfileRequest.newBuilder()
                            .setFacultyProfile(
                                FacultyProto.newBuilder()
                                    .setFirstName(firstName)
                                    .setLastName(lastName)
                                    .setEmail(oAuthChecker.getAuthUserEmail(authentication))
                                    .addAllDepartments(requestBody.getDepartment()))))
            .build();

    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    CreateProfileResponse createProfileResponse = moduleResponse.getProfileResponse().getCreateProfileResponse();

    if (createProfileResponse.getSuccess()) {
      FacultyProto createdFaculty = createProfileResponse.getCreatedFaculty();

      CreateFacultyRequestDTO responseFaculty = new CreateFacultyRequestDTO();
      responseFaculty.setName(createdFaculty.getFirstName() + " " + createdFaculty.getLastName());
      responseFaculty.setDepartment(createdFaculty.getDepartmentsList());

      return ResponseEntity.status(HttpStatus.CREATED).body(responseFaculty);
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
  }
}
