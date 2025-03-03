/**
 * Gateway controller for handling API requests from the frontend.
 * This controller serves as the entry point for fetching data and managing
 * business logic by invoking the appropriate backend modules that are
 * responsible for said logic.
 *
 * This controller:
 * - Uses 'ModuleInvoker' to communicate with backend modules
 *   or <RepositoryName>Service services to retrieve information.
 * - Performs Proto ↔ Dto conversions for sending data to modules and sending
 *   data from the modules to the frontend.
 *
 * @author Augusto Escudero
 * @author Natalie Jungquist
 */
package COMP_49X_our_search.backend.gateway;

import static COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter.protoStudentToStudentDto;

import COMP_49X_our_search.backend.authentication.OAuthChecker;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.gateway.dto.*;
import COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter;

import java.util.Collections;
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
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000") // TODO: change once the app is hosted.
public class GatewayController {
  private final ModuleInvoker moduleInvoker;
  private final OAuthChecker oAuthChecker;
  private final DepartmentService departmentService;
  private final MajorService majorService;
  private final ResearchPeriodService researchPeriodService;

  @Autowired
  public GatewayController(ModuleInvoker moduleInvoker, OAuthChecker oAuthChecker, DepartmentService departmentService, MajorService majorService, ResearchPeriodService researchPeriodService) {
    this.moduleInvoker = moduleInvoker;
    this.oAuthChecker = oAuthChecker;
    this.departmentService = departmentService;
    this.majorService = majorService;
    this.researchPeriodService = researchPeriodService;
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
    // Remaining part
    String lastName = nameParts.length > 1 ? nameParts[1] : "";
    boolean hasPriorExperience = requestBody.getHasPriorExperience().equals("yes");
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
                                    .setGraduationYear(
                                        Integer.parseInt(requestBody.getGraduationYear()))
                                    .addAllMajors(requestBody.getMajor())
                                    .addAllResearchFieldInterests(
                                        requestBody.getResearchFieldInterests())
                                    .addAllResearchPeriodsInterests(
                                        requestBody.getResearchPeriodsInterest())
                                    .setInterestReason(requestBody.getInterestReason())
                                    .setHasPriorExperience(hasPriorExperience))))
            .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    CreateProfileResponse createProfileResponse =
        moduleResponse.getProfileResponse().getCreateProfileResponse();
    if (createProfileResponse.getSuccess()) {
      StudentProto createdUser = createProfileResponse.getCreatedStudent();

      CreateStudentRequestDTO responseUser = new CreateStudentRequestDTO();
      responseUser.setName(createdUser.getFirstName() + " " + createdUser.getLastName());
      responseUser.setClassStatus(createdUser.getClassStatus());
      responseUser.setGraduationYear(Integer.toString(createdUser.getGraduationYear()));
      responseUser.setHasPriorExperience(createdUser.getHasPriorExperience() ? "yes" : "no");
      responseUser.setInterestReason(createdUser.getInterestReason());
      responseUser.setMajor(createdUser.getMajorsList());
      responseUser.setResearchFieldInterests(createdUser.getResearchFieldInterestsList());
      responseUser.setResearchPeriodsInterest(createdUser.getResearchPeriodsInterestsList());

      return ResponseEntity.status(HttpStatus.CREATED).body(responseUser);
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
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
    CreateProfileResponse createProfileResponse =
        moduleResponse.getProfileResponse().getCreateProfileResponse();

    if (createProfileResponse.getSuccess()) {
      FacultyProto createdFaculty = createProfileResponse.getCreatedFaculty();

      CreateFacultyRequestDTO responseFaculty = new CreateFacultyRequestDTO();
      responseFaculty.setName(createdFaculty.getFirstName() + " " + createdFaculty.getLastName());
      responseFaculty.setDepartment(createdFaculty.getDepartmentsList());

      return ResponseEntity.status(HttpStatus.CREATED).body(responseFaculty);
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
  }

  @GetMapping("/api/studentProfiles/current")
  public ResponseEntity<StudentDTO> getCurrentProfile() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setRetrieveProfileRequest(
                        RetrieveProfileRequest.newBuilder()
                            .setUserEmail(oAuthChecker.getAuthUserEmail(authentication))))
            .build();
    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    RetrieveProfileResponse retrieveProfileResponse = response.getProfileResponse().getRetrieveProfileResponse();
    if (retrieveProfileResponse.getSuccess()) {
      if (retrieveProfileResponse.hasRetrievedStudent()) {
        StudentProto retrievedStudent = retrieveProfileResponse.getRetrievedStudent();
        StudentDTO dtoStudent = protoStudentToStudentDto(retrievedStudent);
        return ResponseEntity.ok(dtoStudent);
      }

    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @GetMapping("/departments")
  public ResponseEntity<List<DepartmentDTO>> getDepartments() {
    try {
      List<DepartmentDTO> departmentDTOs = departmentService.getAllDepartments()
              .stream()
              .map(department -> new DepartmentDTO(department.getId(), department.getName(), null))
              .toList();
      return ResponseEntity.ok(departmentDTOs);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
    }
  }

  @GetMapping("/majors")
  public ResponseEntity<List<MajorDTO>> getMajors() {
    try {
      List<MajorDTO> majorDTOs = majorService.getAllMajors()
              .stream()
              .map(major -> new MajorDTO(major.getId(), major.getName(), null))
              .toList();
      return ResponseEntity.ok(majorDTOs);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
    }
  }

  @GetMapping("/research-periods")
  public ResponseEntity<List<ResearchPeriodDTO>> getResearchPeriods() {
    try {
      List<ResearchPeriodDTO> researchPeriodDTOS = researchPeriodService.getAllResearchPeriods()
              .stream()
              .map(researchPeriod -> new ResearchPeriodDTO(researchPeriod.getId(), researchPeriod.getName()))
              .toList();
      return ResponseEntity.ok(researchPeriodDTOS);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
    }
  }
}
