package COMP_49X_our_search.backend.gateway;

import COMP_49X_our_search.backend.authentication.OAuthChecker;
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
                                    .setGraduationYear(requestBody.getGraduationYear())
                                    .addAllMajors(requestBody.getMajor())
                                    .addAllResearchFieldInterests(
                                        requestBody.getResearchFieldInterests())
                                    .addAllResearchPeriodsInterests(
                                        requestBody.getResearchPeriodsInterest())
                                    .setInterestReason(requestBody.getInterestReason()))))
            .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    CreateProfileResponse createProfileResponse = moduleResponse.getProfileResponse().getCreateProfileResponse();
    if (createProfileResponse.getSuccess()) {
      StudentProto createdUser = createProfileResponse.getCreatedStudent();

      CreateStudentRequestDTO responseUser = new CreateStudentRequestDTO();
      responseUser.setName(createdUser.getFirstName() + " " + createdUser.getLastName());
      responseUser.setClassStatus(createdUser.getClassStatus());
      responseUser.setGraduationYear(createdUser.getGraduationYear());
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
}
