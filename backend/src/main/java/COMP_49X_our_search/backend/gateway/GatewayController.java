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

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import COMP_49X_our_search.backend.authentication.OAuthChecker;
import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import COMP_49X_our_search.backend.gateway.dto.CreateFacultyRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.CreateMajorRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.CreateProjectRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.CreateProjectResponseDTO;
import COMP_49X_our_search.backend.gateway.dto.CreateStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.CreatedProjectDTO;
import COMP_49X_our_search.backend.gateway.dto.DeleteRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.DepartmentDTO;
import COMP_49X_our_search.backend.gateway.dto.DisciplineDTO;
import COMP_49X_our_search.backend.gateway.dto.EditFacultyRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.EditMajorRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.EditStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.FacultyDTO;
import COMP_49X_our_search.backend.gateway.dto.FacultyProfileDTO;
import COMP_49X_our_search.backend.gateway.dto.MajorDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectDTO;
import COMP_49X_our_search.backend.gateway.dto.ResearchPeriodDTO;
import COMP_49X_our_search.backend.gateway.dto.StudentDTO;
import COMP_49X_our_search.backend.gateway.dto.UmbrellaTopicDTO;
import COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter;
import static COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter.protoFacultyToFacultyDto;
import static COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter.protoStudentToStudentDto;
import COMP_49X_our_search.backend.security.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
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
import proto.project.ProjectModule.DeleteProjectRequest;
import proto.project.ProjectModule.DeleteProjectResponse;
import proto.project.ProjectModule.EditProjectRequest;
import proto.project.ProjectModule.EditProjectResponse;
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
  private final StudentService studentService;
  private final FacultyService facultyService;
  private final ProjectService projectService;

  @Autowired
  public GatewayController(
      ModuleInvoker moduleInvoker,
      OAuthChecker oAuthChecker,
      DepartmentService departmentService,
      MajorService majorService,
      ResearchPeriodService researchPeriodService,
      UmbrellaTopicService umbrellaTopicService,
      DisciplineService disciplineService,
      LogoutService logoutService,
      StudentService studentService,
      FacultyService facultyService,
      ProjectService projectService) {
    this.moduleInvoker = moduleInvoker;
    this.oAuthChecker = oAuthChecker;
    this.departmentService = departmentService;
    this.majorService = majorService;
    this.researchPeriodService = researchPeriodService;
    this.disciplineService = disciplineService;
    this.umbrellaTopicService = umbrellaTopicService;
    this.logoutService = logoutService;
    this.studentService = studentService;
    this.facultyService = facultyService;
    this.projectService = projectService;
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
                                    .setHasPriorExperience(requestBody.getHasPriorExperience()))))
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
      responseUser.setHasPriorExperience(createdUser.getHasPriorExperience());
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
              .map(
                  department ->
                      new DepartmentDTO(department.getId(), department.getName(), null, null))
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
  public ResponseEntity<Void> deleteStudentProfile(HttpServletRequest req, HttpServletResponse res)
      throws IOException {
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

  @PutMapping("/umbrella-topic")
  public ResponseEntity<UmbrellaTopicDTO> editUmbrellaTopic(
          @RequestBody UmbrellaTopicDTO topicToUpdate) {
    try {
      UmbrellaTopic existing = umbrellaTopicService.getUmbrellaTopicById(topicToUpdate.getId());
      existing.setName(topicToUpdate.getName());

      UmbrellaTopic saved = umbrellaTopicService.saveUmbrellaTopic(existing);

      UmbrellaTopicDTO updatedDto = new UmbrellaTopicDTO(saved.getId(), saved.getName());
      return ResponseEntity.ok(updatedDto);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
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
  public ResponseEntity<Void> deleteFacultyProfile(HttpServletRequest req, HttpServletResponse res)
      throws IOException {
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
                          null,
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
              createdProject.getMajorsList().stream().map(major -> new MajorDTO(0, major)).toList(),
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

  @DeleteMapping("/student")
  public ResponseEntity<Void> deleteStudent(@RequestBody DeleteRequestDTO deleteStudentRequestDTO) {
    String studentEmail = studentService.getStudentById(deleteStudentRequestDTO.getId()).getEmail();
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setDeleteProfileRequest(
                        DeleteProfileRequest.newBuilder().setUserEmail(studentEmail)))
            .build();
    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    DeleteProfileResponse deleteProfileResponse =
        response.getProfileResponse().getDeleteProfileResponse();
    if (deleteProfileResponse.getSuccess()) {
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @GetMapping("/all-faculty")
  public ResponseEntity<List<DepartmentDTO>> getAllFaculty() {
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setFetcherRequest(
                FetcherRequest.newBuilder()
                    .setFilteredFetcher(
                        FilteredFetcher.newBuilder()
                            .setFilteredType(FilteredType.FILTERED_TYPE_FACULTY)))
            .build();

    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    FetcherResponse fetcherResponse = response.getFetcherResponse();

    return ResponseEntity.ok(
        fetcherResponse.getDepartmentHierarchy().getDepartmentsList().stream()
            .map(ProjectHierarchyConverter::protoDepartmentWithFacultyToDto)
            .toList());
  }

  @DeleteMapping("/project")
  public ResponseEntity<Void> deleteProject(@RequestBody DeleteRequestDTO deleteProjectRequestDTO) {
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProjectRequest(
                ProjectRequest.newBuilder()
                    .setDeleteProjectRequest(
                        DeleteProjectRequest.newBuilder()
                            .setProjectId(deleteProjectRequestDTO.getId())))
            .build();
    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    DeleteProjectResponse deleteProjectResponse =
        response.getProjectResponse().getDeleteProjectResponse();
    if (deleteProjectResponse.getSuccess()) {
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @PutMapping("/student")
  public ResponseEntity<StudentDTO> editStudent(@RequestBody EditStudentRequestDTO requestBody) {

    // Retrieve the student email using the provided getter method
    String studentEmail = studentService.getStudentById(requestBody.getId()).getEmail();

    // Split the full name into first and last name
    String[] nameParts = splitFullName(requestBody.getName());
    String firstName = nameParts[0];
    String lastName = nameParts[1];
    boolean hasPriorExperience = requestBody.getHasPriorExperience();

    // Build the ModuleConfig for the edit request using the studentEmail
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setEditProfileRequest(
                        EditProfileRequest.newBuilder()
                            .setUserEmail(studentEmail)
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

  @PutMapping("/project")
  public ResponseEntity<CreateProjectResponseDTO> editProject(
      @RequestBody CreateProjectRequestDTO requestBody) {
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProjectRequest(
                ProjectRequest.newBuilder()
                    .setEditProjectRequest(
                        EditProjectRequest.newBuilder()
                            .setProject(
                                ProjectProto.newBuilder()
                                    .setProjectId(requestBody.getId())
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
                                    .setIsActive(requestBody.getIsActive()))))
            .build();
    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    EditProjectResponse editProjectResponse =
        response.getProjectResponse().getEditProjectResponse();

    if (editProjectResponse.getSuccess()) {
      ProjectProto editedProject = editProjectResponse.getEditedProject();
      CreatedProjectDTO editedProjectDTO =
          new CreatedProjectDTO(
              editedProject.getProjectName(),
              editedProject.getDescription(),
              editedProject.getMajorsList().stream().map(major -> new MajorDTO(0, major)).toList(),
              editedProject.getResearchPeriodsList(),
              editedProject.getDesiredQualifications(),
              editedProject.getUmbrellaTopicsList(),
              editedProject.getIsActive());

      CreateProjectResponseDTO responseDTO =
          new CreateProjectResponseDTO(editProjectResponse.getProjectId(), null, editedProjectDTO);
      return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @DeleteMapping("/faculty")
  public ResponseEntity<Void> deleteFaculty(@RequestBody DeleteRequestDTO requestBody)
      throws IOException {
    String facultyEmail = facultyService.getFacultyById(requestBody.getId()).getEmail();

    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setDeleteProfileRequest(
                        DeleteProfileRequest.newBuilder().setUserEmail(facultyEmail)))
            .build();

    ModuleResponse response = moduleInvoker.processConfig(moduleConfig);
    DeleteProfileResponse deleteProfileResponse =
        response.getProfileResponse().getDeleteProfileResponse();

    if (deleteProfileResponse.getSuccess()) {
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }

  @PutMapping("/faculty")
  public ResponseEntity<FacultyDTO> editFaculty(@RequestBody EditFacultyRequestDTO requestBody) {
    String[] nameParts = splitFullName(requestBody.getName());
    String firstName = nameParts[0];
    String lastName = nameParts[1];
    String facultyEmail = facultyService.getFacultyById(requestBody.getId()).getEmail();

    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setProfileRequest(
                ProfileRequest.newBuilder()
                    .setEditProfileRequest(
                        EditProfileRequest.newBuilder()
                            .setUserEmail(facultyEmail)
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

  @PutMapping("/major")
  public ResponseEntity<EditMajorRequestDTO> editMajor(
      @RequestBody EditMajorRequestDTO requestBody) {
    try {
      Major major = majorService.getMajorById(requestBody.getId());
      // Make sure the new name is not an empty string, otherwise don't update.
      String newName = requestBody.getName().isEmpty() ? major.getName() : requestBody.getName();
      Set<Discipline> disciplines =
          requestBody.getDisciplines().stream()
              .map(disciplineService::getDisciplineByName)
              .collect(Collectors.toSet());

      major.setName(newName);
      major.setDisciplines(disciplines);

      Major updatedMajor = majorService.saveMajor(major);
      return ResponseEntity.ok(
          new EditMajorRequestDTO(
              updatedMajor.getId(),
              updatedMajor.getName(),
              updatedMajor.getDisciplines().stream().map(Discipline::getName).toList()));
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @DeleteMapping("/discipline")
  public ResponseEntity<Void> deleteDiscipline(@RequestBody DeleteRequestDTO requestBody) {
    try {
      disciplineService.deleteDisciplineById(requestBody.getId());
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @DeleteMapping("/department")
  public ResponseEntity<Void> deleteDepartment(@RequestBody DeleteRequestDTO requestBody) {
    try {
      departmentService.deleteByDepartmentId(requestBody.getId());
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/major")
  public ResponseEntity<Void> createMajor(@RequestBody CreateMajorRequestDTO requestBody) {
    try {
      Set<Discipline> disciplines =
          requestBody.getDisciplines().stream()
              .map(disciplineService::getDisciplineByName)
              .collect(Collectors.toSet());

      Major newMajor = new Major();
      newMajor.setName(requestBody.getName());
      newMajor.setDisciplines(disciplines);
      majorService.saveMajor(newMajor);

      return ResponseEntity.status(HttpStatus.CREATED).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/project")
  public ResponseEntity<ProjectDTO> getProject(@RequestParam("id") int id) {
    try {
      Project project = projectService.getProjectById(id);

      ProjectDTO responseProjectDTO =
          new ProjectDTO(
              project.getId(),
              project.getName(),
              project.getDescription(),
              project.getDesiredQualifications(),
              project.getUmbrellaTopics().stream().map(UmbrellaTopic::getName).toList(),
              project.getResearchPeriods().stream().map(ResearchPeriod::getName).toList(),
              project.getIsActive(),
              project.getMajors().stream().map(Major::getName).toList(),
              null
          );
      return ResponseEntity.ok(responseProjectDTO);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/discipline")
  public ResponseEntity<DisciplineDTO> editDiscipline(@RequestBody DisciplineDTO requestBody) {
    try {
      Discipline discipline = disciplineService.getDisciplineById(requestBody.getId());

      if (requestBody.getName().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
      }

      discipline.setName(requestBody.getName());

      Discipline savedDiscipline = disciplineService.saveDiscipline(discipline);

      DisciplineDTO updatedDto = new DisciplineDTO(
              savedDiscipline.getId(),
              savedDiscipline.getName(),
              majorService.getMajorsByDisciplineId(savedDiscipline.getId()).stream()
                      .map(major -> new MajorDTO(major.getId(), major.getName()))
                      .toList()
      );

      return ResponseEntity.ok(updatedDto);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
      
  @DeleteMapping("/umbrella-topic")
  public ResponseEntity<Void> deleteUmbrellaTopic(@RequestBody DeleteRequestDTO requestBody) {
    try {
      umbrellaTopicService.deleteUmbrellaTopicById(requestBody.getId());
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/faculty")
  public ResponseEntity<FacultyDTO> getFaculty(@RequestParam("id") int facultyId) {
    try {
        Faculty dbFaculty = facultyService.getFacultyById(facultyId);

        List<Project> projects = projectService.getProjectsByFacultyId(dbFaculty.getId());
        List<ProjectDTO> projectDTOs = projects.stream()
            .map(project -> new ProjectDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getDesiredQualifications(),
                project.getUmbrellaTopics().stream().map(ut -> ut.getName()).toList(),
                project.getResearchPeriods().stream().map(rp -> rp.getName()).toList(),
                project.getIsActive(),
                project.getMajors().stream().map(m -> m.getName()).toList(),
                null

            ))
            .toList();

        List<String> departmentNames = dbFaculty.getDepartments().stream()
            .map(dept -> dept.getName())
            .toList();

        FacultyDTO facultyDTO = new FacultyDTO();
        facultyDTO.setId(dbFaculty.getId());
        facultyDTO.setFirstName(dbFaculty.getFirstName());
        facultyDTO.setLastName(dbFaculty.getLastName());
        facultyDTO.setEmail(dbFaculty.getEmail());
        facultyDTO.setDepartment(departmentNames);
        facultyDTO.setProjects(projectDTOs);

        return ResponseEntity.ok(facultyDTO);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/discipline")
  public ResponseEntity<DisciplineDTO> createDiscipline(@RequestBody DisciplineDTO disciplineDTO) {
    try {
      if (disciplineDTO.getName() == null || disciplineDTO.getName().trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
      }
      Discipline discipline = new Discipline();
      discipline.setName(disciplineDTO.getName());

      Discipline savedDiscipline = disciplineService.saveDiscipline(discipline);

      List<MajorDTO> majorDTOs = majorService.getMajorsByDisciplineId(savedDiscipline.getId()).stream()
              .map(major -> new MajorDTO(major.getId(), major.getName()))
              .toList();
      DisciplineDTO responseDTO = new DisciplineDTO(savedDiscipline.getId(), savedDiscipline.getName(), majorDTOs);

      return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/student")
  public ResponseEntity<StudentDTO> getStudent(@RequestParam("id") int studentId) {
    try {
        Student dbStudent = studentService.getStudentById(studentId);
        
        // Manually build a StudentDTO from the Student entity.
        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setId(dbStudent.getId());
        studentDTO.setFirstName(dbStudent.getFirstName());
        studentDTO.setLastName(dbStudent.getLastName());
        studentDTO.setEmail(dbStudent.getEmail());
        studentDTO.setClassStatus(undergradYearToClassStatus(dbStudent.getUndergradYear()));
        studentDTO.setGraduationYear(dbStudent.getGraduationYear());
        studentDTO.setMajors(dbStudent.getMajors().stream().map(Major::getName).toList());
        studentDTO.setResearchFieldInterests(dbStudent.getResearchFieldInterests().stream().map(Major::getName).toList());
        studentDTO.setResearchPeriodsInterest(dbStudent.getResearchPeriods().stream().map(ResearchPeriod::getName).toList());
        studentDTO.setInterestReason(dbStudent.getInterestReason());
        studentDTO.setHasPriorExperience(dbStudent.getHasPriorExperience());
        studentDTO.setIsActive(dbStudent.getIsActive());
        
        return ResponseEntity.ok(studentDTO);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/research-period")
  public ResponseEntity<ResearchPeriodDTO> editResearchPeriod(@RequestBody ResearchPeriodDTO requestBody) {
    try {
      ResearchPeriod researchPeriod = researchPeriodService.getResearchPeriodById(requestBody.getId());


      if (requestBody.getName().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }

      researchPeriod.setName(requestBody.getName());

      ResearchPeriod savedResearchPeriod = researchPeriodService.saveResearchPeriod(researchPeriod);

      ResearchPeriodDTO updatedDto = new ResearchPeriodDTO(
        savedResearchPeriod.getId(),
        savedResearchPeriod.getName()
      );

      return ResponseEntity.ok(updatedDto);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }


  @PutMapping("/departments")
  public ResponseEntity<DepartmentDTO> editDepartment(@RequestBody DepartmentDTO requestBody) {
    try {
      if (requestBody.getName() == null || requestBody.getName().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }
      Department dept = departmentService.getDepartmentById(requestBody.getId());
      dept.setName(requestBody.getName());
      Department savedDept = departmentService.saveDepartment(dept);
      
      DepartmentDTO responseDto = new DepartmentDTO(savedDept.getId(), savedDept.getName(), null, null);
      return ResponseEntity.ok(responseDto);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  
  @DeleteMapping("/major")
  public ResponseEntity<Void> deleteMajor(@RequestBody DeleteRequestDTO requestBody) {
    try {
      majorService.deleteMajorById(requestBody.getId());
      return ResponseEntity.ok().build();
    } catch (IllegalStateException illegalE) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @DeleteMapping("/research-period")
  public ResponseEntity<Void> deleteResearchPeriod(@RequestBody DeleteRequestDTO requestBody) {
    try {
      researchPeriodService.deleteResearchPeriodById(requestBody.getId());
      return ResponseEntity.ok().build();
    } catch (IllegalStateException illegalE) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
  
  @PostMapping("/umbrella-topic")
  public ResponseEntity<UmbrellaTopicDTO> createUmbrellaTopic(@RequestBody UmbrellaTopicDTO requestBody) {
    try {
      if (requestBody.getName() == null || requestBody.getName().trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }
      UmbrellaTopic newTopic = new UmbrellaTopic();
      newTopic.setName(requestBody.getName());
      UmbrellaTopic savedTopic = umbrellaTopicService.saveUmbrellaTopic(newTopic);
      UmbrellaTopicDTO createdDto = new UmbrellaTopicDTO(savedTopic.getId(), savedTopic.getName());
      return ResponseEntity.status(HttpStatus.CREATED).body(createdDto);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/research-period")
  public ResponseEntity<ResearchPeriodDTO> createResearchPeriod(@RequestBody ResearchPeriodDTO requestBody) {
    try {
      if (requestBody.getName() == null || requestBody.getName().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }
      
      ResearchPeriod newPeriod = new ResearchPeriod();
      newPeriod.setName(requestBody.getName());
      
      
      ResearchPeriod savedPeriod = researchPeriodService.saveResearchPeriod(newPeriod);
      
      
      ResearchPeriodDTO responseDto = new ResearchPeriodDTO(savedPeriod.getId(), savedPeriod.getName());
      
      return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/departments")
  public ResponseEntity<DepartmentDTO> createDepartment(@RequestBody DepartmentDTO requestBody) {
    try {
      if (requestBody.getName() == null || requestBody.getName().isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }
      Department newDept = new Department();
      newDept.setName(requestBody.getName());
      
      Department savedDept = departmentService.saveDepartment(newDept);
      
      DepartmentDTO responseDto = new DepartmentDTO(savedDept.getId(), savedDept.getName(), null, null);
      return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }





  // Helper method
  private String undergradYearToClassStatus(int status) {
    switch (status) {
        case 1: return "Freshman";
        case 2: return "Sophomore";
        case 3: return "Junior";
        case 4: return "Senior";
        case 5: return "Graduate";
        default: throw new IllegalArgumentException("Invalid class status: " + status);
    }
  }
}
