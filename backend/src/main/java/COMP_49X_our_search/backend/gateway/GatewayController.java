/**
 * Gateway controller for handling API requests from the frontend. This controller serves as the
 * entry point for fetching data and managing business logic by invoking the appropriate backend
 * modules that are responsible for said logic.
 *
 * <p>This controller: - Uses 'ModuleInvoker' to communicate with backend modules or
 * <RepositoryName>Service services to retrieve information. - Performs Proto ↔ Dto conversions for
 * sending data to modules and sending data from the modules to the frontend.
 *
 * @author Augusto Escudero
 * @author Natalie Jungquist
 */
package COMP_49X_our_search.backend.gateway;

import static COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter.protoFacultyToFacultyDto;
import static COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter.protoStudentToStudentDto;
import COMP_49X_our_search.backend.authentication.OAuthChecker;
import COMP_49X_our_search.backend.gateway.dto.CreateFacultyRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.CreateStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.DisciplineDTO;
import COMP_49X_our_search.backend.gateway.dto.EditStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.StudentDTO;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import COMP_49X_our_search.backend.gateway.dto.*;
import COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import COMP_49X_our_search.backend.security.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;
import proto.profile.ProfileModule.ProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;
import proto.project.ProjectModule.CreateProjectRequest;
import proto.project.ProjectModule.CreateProjectResponse;
import proto.project.ProjectModule.ProjectRequest;

@RestController
@RequestMapping
// TODO: change once the app is hosted.
@CrossOrigin(origins = "http://localhost:3000")
public class GatewayController {
  private final ModuleInvoker moduleInvoker;
  private final OAuthChecker oAuthChecker;
  private final DepartmentService departmentService;
  private final MajorService majorService;
  private final ResearchPeriodService researchPeriodService;
  private final DisciplineService disciplineService;
  private final UmbrellaTopicService umbrellaTopicService;
  private final LogoutService logoutService;

  @Autowired
  public GatewayController(
          ModuleInvoker moduleInvoker,
          OAuthChecker oAuthChecker,
          DepartmentService departmentService,
          MajorService majorService,
          ResearchPeriodService researchPeriodService,
          UmbrellaTopicService umbrellaTopicService,
          DisciplineService disciplineService, LogoutService logoutService) {
    this.moduleInvoker = moduleInvoker;
    this.oAuthChecker = oAuthChecker;
    this.departmentService = departmentService;
    this.majorService = majorService;
    this.researchPeriodService = researchPeriodService;
    this.disciplineService = disciplineService;
    this.umbrellaTopicService = umbrellaTopicService;
    this.logoutService = logoutService;
  }

  @GetMapping("/all-projects")
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

  @GetMapping("/all-students")
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
    String[] nameParts = splitFullName(requestBody.getName());
    String firstName = nameParts[0];
    String lastName = nameParts[1];

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
    String[] nameParts = splitFullName(requestBody.getName());
    String firstName = nameParts[0];
    String lastName = nameParts[1];

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
    RetrieveProfileResponse retrieveProfileResponse =
        response.getProfileResponse().getRetrieveProfileResponse();
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
      List<DepartmentDTO> departmentDTOs =
          departmentService.getAllDepartments().stream()
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
      List<MajorDTO> majorDTOs =
          majorService.getAllMajors().stream()
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
      List<ResearchPeriodDTO> researchPeriodDTOS =
          researchPeriodService.getAllResearchPeriods().stream()
              .map(
                  researchPeriod ->
                      new ResearchPeriodDTO(researchPeriod.getId(), researchPeriod.getName()))
              .toList();
      return ResponseEntity.ok(researchPeriodDTOS);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
    }
  }

  @PutMapping("/api/studentProfiles/current")
  public ResponseEntity<StudentDTO> editStudentProfile(
      @RequestBody EditStudentRequestDTO requestBody) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String[] nameParts = splitFullName(requestBody.getName());
    String firstName = nameParts[0];
    String lastName = nameParts[1];
    boolean hasPriorExperience = requestBody.getHasPriorExperience();

    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setEditProfileRequest(
                        EditProfileRequest.newBuilder()
                            .setUserEmail(oAuthChecker.getAuthUserEmail(authentication))
                            .setStudentProfile(
                                StudentProto.newBuilder()
                                    .setFirstName(firstName)
                                    .setLastName(lastName)
                                    .setClassStatus(requestBody.getClassStatus())
                                    .setGraduationYear(
                                        Integer.parseInt(requestBody.getGraduationYear()))
                                    .addAllMajors(requestBody.getMajors())
                                    .addAllResearchFieldInterests(
                                        requestBody.getResearchFieldInterests())
                                    .addAllResearchPeriodsInterests(
                                        requestBody.getResearchPeriodsInterest())
                                    .setInterestReason(requestBody.getInterestReason())
                                    .setHasPriorExperience(hasPriorExperience)
                                    .setIsActive(requestBody.getIsActive()))))
            .build();
    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    EditProfileResponse editProfileResponse =
        response.getProfileResponse().getEditProfileResponse();
    if (editProfileResponse.getSuccess()) {
      return ResponseEntity.ok(protoStudentToStudentDto(editProfileResponse.getEditedStudent()));
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @DeleteMapping("/api/studentProfiles/current")
  public ResponseEntity<Void> deleteStudentProfile(HttpServletRequest req, HttpServletResponse res) throws IOException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setDeleteProfileRequest(
                        DeleteProfileRequest.newBuilder()
                            .setUserEmail(oAuthChecker.getAuthUserEmail(authentication))))
            .build();
    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    DeleteProfileResponse deleteProfileResponse =
        response.getProfileResponse().getDeleteProfileResponse();
    if (deleteProfileResponse.getSuccess()) {
      if (logoutService.logoutCurrentUser(req, res, authentication)) {
        return ResponseEntity.ok().build();
      }
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  private String[] splitFullName(String fullName) {
    // Split the name into two parts at the first space, e.g.
    // "John Doe" -> firstName: "John", lastName: "Doe"
    // "John Doe Bob" -> firstName: "John", lastName: "Doe Bob"
    String[] nameParts = fullName.split(" ", 2);
    String firstName = nameParts[0];
    String lastName = nameParts.length > 1 ? nameParts[1] : "";
    return new String[] {firstName, lastName};
  }

  @GetMapping("/umbrella-topics")
  public ResponseEntity<List<UmbrellaTopicDTO>> getUmbrellaTopics() {
    try {
      List<UmbrellaTopicDTO> umbrellaTopicDTOs =
          umbrellaTopicService.getAllUmbrellaTopics().stream()
              .map(ut -> new UmbrellaTopicDTO(ut.getId(), ut.getName()))
              .toList();
      return ResponseEntity.ok(umbrellaTopicDTOs);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
    }
  }

  @GetMapping("/disciplines")
  public ResponseEntity<List<DisciplineDTO>> getDisciplines() {
    try {
      // For each discipline, get the id, name, and majors. Convert the majors to majorDTOs,
      // then create a disciplineDTO with the id, name, and majorDTOs.
      List<DisciplineDTO> disciplineDTOS =
          disciplineService.getAllDisciplines().stream()
              .map(
                  discipline -> {
                    List<MajorDTO> majorDTOS =
                        majorService.getMajorsByDisciplineId(discipline.getId()).stream()
                            .map(major -> new MajorDTO(major.getId(), major.getName()))
                            .toList();
                    return new DisciplineDTO(discipline.getId(), discipline.getName(), majorDTOS);
                  })
              .toList();
      return ResponseEntity.ok(disciplineDTOS);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
    }
  }

  @PutMapping("/api/facultyProfiles/current")
  public ResponseEntity<FacultyDTO> editFacultyProfile(
      @RequestBody EditFacultyRequestDTO requestBody) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String[] nameParts = splitFullName(requestBody.getName());
    String firstName = nameParts[0];
    String lastName = nameParts[1];

    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setEditProfileRequest(
                        EditProfileRequest.newBuilder()
                            .setUserEmail(oAuthChecker.getAuthUserEmail(authentication))
                            .setFacultyProfile(
                                FacultyProto.newBuilder()
                                    .setFirstName(firstName)
                                    .setLastName(lastName)
                                    .addAllDepartments(requestBody.getDepartment()))))
            .build();

    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    EditProfileResponse editProfileResponse =
        response.getProfileResponse().getEditProfileResponse();
    if (editProfileResponse.getSuccess()) {
      return ResponseEntity.ok(protoFacultyToFacultyDto(editProfileResponse.getEditedFaculty()));
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @DeleteMapping("/api/facultyProfiles/current")
  public ResponseEntity<Void> deleteFacultyProfile(HttpServletRequest req, HttpServletResponse res) throws IOException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setDeleteProfileRequest(
                        DeleteProfileRequest.newBuilder()
                            .setUserEmail(oAuthChecker.getAuthUserEmail(authentication))))
            .build();
    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    DeleteProfileResponse deleteProfileResponse =
        response.getProfileResponse().getDeleteProfileResponse();
    if (deleteProfileResponse.getSuccess()) {
      if (logoutService.logoutCurrentUser(req, res, authentication)) {
        return ResponseEntity.ok().build();
      }
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @GetMapping("/api/facultyProfiles/current")
  public ResponseEntity<FacultyProfileDTO> getFacultyProfile() {
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
    RetrieveProfileResponse retrieveProfileResponse =
        response.getProfileResponse().getRetrieveProfileResponse();
    if (retrieveProfileResponse.getSuccess()) {
      FacultyProto facultyProto = retrieveProfileResponse.getRetrievedFaculty().getFaculty();
      List<ProjectProto> projectProtos =
          retrieveProfileResponse.getRetrievedFaculty().getProjectsList();
      List<String> departments =
          retrieveProfileResponse.getRetrievedFaculty().getFaculty().getDepartmentsList();

      List<ProjectDTO> projectDTOs =
          projectProtos.stream()
              .map(
                  project ->
                      new ProjectDTO(
                          project.getProjectId(),
                          project.getProjectName(),
                          project.getDescription(),
                          project.getDesiredQualifications(),
                          project.getUmbrellaTopicsList(),
                          project.getResearchPeriodsList(),
                          project.getIsActive(),
                          project.getMajorsList(),
                          protoFacultyToFacultyDto(project.getFaculty())))
              .toList();

      // TODO(acescudero): Refactor the logic so that the department id is
      //  returned by the module instead of calling the DepartmentService here.
      List<DepartmentDTO> departmentDTOS =
          departments.stream()
              .map(
                  departmentName ->
                      new DepartmentDTO(
                          departmentService.getDepartmentByName(departmentName).get().getId(),
                          departmentName,
                          null))
              .toList();

      FacultyProfileDTO facultyProfileDTO = new FacultyProfileDTO();
      facultyProfileDTO.setFirstName(facultyProto.getFirstName());
      facultyProfileDTO.setLastName(facultyProto.getLastName());
      facultyProfileDTO.setEmail(facultyProto.getEmail());
      facultyProfileDTO.setDepartment(departmentDTOS);
      facultyProfileDTO.setProjects(projectDTOs);

      return ResponseEntity.ok(facultyProfileDTO);
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @PostMapping("/create-project")
  public ResponseEntity<CreateProjectResponseDTO> createProject(
      @RequestBody CreateProjectRequestDTO requestBody) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProjectRequest(
                ProjectRequest.newBuilder()
                    .setCreateProjectRequest(
                        CreateProjectRequest.newBuilder()
                            .setProject(
                                ProjectProto.newBuilder()
                                    .setProjectName(requestBody.getTitle())
                                    .setDescription(requestBody.getDescription())
                                    .addAllMajors(
                                        requestBody.getDisciplines().stream()
                                            .flatMap(discipline -> discipline.getMajors().stream())
                                            .map(MajorDTO::getName)
                                            .toList())
                                    .addAllResearchPeriods(
                                        requestBody.getResearchPeriods().stream()
                                            .map(ResearchPeriodDTO::getName)
                                            .toList())
                                    .setDesiredQualifications(
                                        requestBody.getDesiredQualifications())
                                    .addAllUmbrellaTopics(
                                        requestBody.getUmbrellaTopics().stream()
                                            .map(UmbrellaTopicDTO::getName)
                                            .toList())
                                    .setIsActive(requestBody.getIsActive())
                                    .setFaculty(
                                        FacultyProto.newBuilder()
                                            .setEmail(
                                                oAuthChecker.getAuthUserEmail(authentication))))))
            .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    CreateProjectResponse createProjectResponse =
        moduleResponse.getProjectResponse().getCreateProjectResponse();

    if (createProjectResponse.getSuccess()) {
      ProjectProto createdProject = createProjectResponse.getCreatedProject();
      CreatedProjectDTO createdProjectDTO =
          new CreatedProjectDTO(
              createdProject.getProjectName(),
              createdProject.getDescription(),
              createdProject.getMajorsList().stream()
                  .map(major -> new MajorDTO(0, major))
                  .toList(),
              createdProject.getResearchPeriodsList(),
              createdProject.getDesiredQualifications(),
              createdProject.getUmbrellaTopicsList(),
              createdProject.getIsActive());

      CreateProjectResponseDTO responseDTO =
          new CreateProjectResponseDTO(
              createProjectResponse.getProjectId(),
              createdProject.getFaculty().getEmail(),
              createdProjectDTO);
      return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }
}
