package COMP_49X_our_search.backend.gateway;

import COMP_49X_our_search.backend.authentication.OAuthChecker;
import COMP_49X_our_search.backend.database.enums.FaqType;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.security.RoleAuthorizationService;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;

import COMP_49X_our_search.backend.database.entities.*;
import COMP_49X_our_search.backend.database.enums.EmailNotificationType;
import COMP_49X_our_search.backend.database.services.*;
import COMP_49X_our_search.backend.gateway.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

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
import COMP_49X_our_search.backend.gateway.dto.CreateStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.DeleteRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.DepartmentDTO;
import COMP_49X_our_search.backend.gateway.dto.DisciplineDTO;
import COMP_49X_our_search.backend.gateway.dto.EditFacultyRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.EditMajorRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.EditStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.MajorDTO;
import COMP_49X_our_search.backend.gateway.dto.ResearchPeriodDTO;
import COMP_49X_our_search.backend.gateway.dto.UmbrellaTopicDTO;
import COMP_49X_our_search.backend.security.LogoutService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.DisciplineProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.DataTypes.DepartmentHierarchy;
import proto.fetcher.DataTypes.DepartmentWithFaculty;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.FacultyWithProjects;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.DataTypes.StudentCollection;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.DeleteProfileResponse;
import proto.profile.ProfileModule.EditProfileResponse;
import proto.profile.ProfileModule.FacultyProfile;
import proto.profile.ProfileModule.ProfileResponse;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;
import proto.project.ProjectModule.CreateProjectResponse;
import proto.project.ProjectModule.DeleteProjectResponse;
import proto.project.ProjectModule.EditProjectResponse;
import proto.project.ProjectModule.ProjectResponse;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "DOMAIN=http://localhost"
})
public class GatewayControllerTest {

  private final ObjectMapper objectMapper = new ObjectMapper();
  @Autowired private MockMvc mockMvc;
  @MockBean private ModuleInvoker moduleInvoker;
  private ModuleResponse mockModuleResponseWithProjects;
  private ModuleResponse mockModuleResponseWithStudents;
  @MockBean private ClientRegistrationRepository clientRegistrationRepository;
  @MockBean private ResearchPeriodService researchPeriodService;
  @MockBean private DepartmentService departmentService;
  @MockBean private MajorService majorService;
  @MockBean private UmbrellaTopicService umbrellaTopicService;
  @MockBean private DisciplineService disciplineService;
  @MockBean private LogoutService logoutService;
  @MockBean private Authentication authentication;
  @MockBean private HttpSession session;
  @MockBean private SecurityContextHolderAwareRequestWrapper requestWrapper;
  @MockBean private StudentService studentService;
  @MockBean private FacultyService facultyService;
  @MockBean private ProjectService projectService;
  @MockBean private EmailNotificationService emailNotificationService;
  @MockBean private FaqService faqService;
  @MockBean private RoleAuthorizationService roleAuthorizationService;
  @MockBean private UserService userService;

  @BeforeEach
  void setUp() {
    FacultyProto faculty =
        FacultyProto.newBuilder()
            .setFirstName("Dr.")
            .setLastName("Faculty")
            .setEmail("faculty@test.com")
            .build();

    ProjectProto project =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("AI Project")
            .setDescription("Research in AI and Machine Learning")
            .setDesiredQualifications("Knowledge of ML and basic AI algorithms")
            .setIsActive(true)
            .addMajors("Computer Science")
            .addUmbrellaTopics("AI")
            .addResearchPeriods("Fall 2025")
            .setFaculty(faculty)
            .build();

    StudentProto student =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    MajorProto major =
        MajorProto.newBuilder().setMajorId(1).setMajorName("Computer Science").build();

    MajorWithEntityCollection majorWithProjects =
        MajorWithEntityCollection.newBuilder()
            .setMajor(major)
            .setProjectCollection(ProjectCollection.newBuilder().addProjects(project))
            .build();

    MajorWithEntityCollection majorWithStudents =
        MajorWithEntityCollection.newBuilder()
            .setMajor(major)
            .setStudentCollection(StudentCollection.newBuilder().addStudents(student))
            .build();

    DisciplineProto discipline =
        DisciplineProto.newBuilder().setDisciplineId(1).setDisciplineName("Engineering").build();

    DisciplineWithMajors disciplineWithMajorsAndProjects =
        DisciplineWithMajors.newBuilder()
            .setDiscipline(discipline)
            .addMajors(majorWithProjects)
            .build();

    DisciplineWithMajors disciplineWithMajorsAndStudents =
        DisciplineWithMajors.newBuilder()
            .setDiscipline(discipline)
            .addMajors(majorWithStudents)
            .build();

    ProjectHierarchy projectHierarchyWithProjects =
        ProjectHierarchy.newBuilder().addDisciplines(disciplineWithMajorsAndProjects).build();

    ProjectHierarchy projectHierarchyWithStudents =
        ProjectHierarchy.newBuilder().addDisciplines(disciplineWithMajorsAndStudents).build();

    mockModuleResponseWithProjects =
        ModuleResponse.newBuilder()
            .setFetcherResponse(
                FetcherResponse.newBuilder().setProjectHierarchy(projectHierarchyWithProjects))
            .build();

    mockModuleResponseWithStudents =
        ModuleResponse.newBuilder()
            .setFetcherResponse(
                FetcherResponse.newBuilder().setProjectHierarchy(projectHierarchyWithStudents))
            .build();
    when(roleAuthorizationService.checkUserRoles(any(Authentication.class), any(String[].class)))
        .thenReturn(true);
  }

  @Test
  @WithMockUser // include this annotation to mock that a user is authenticated to access the
  // protected endpoints of the application
  void getProjects_returnsExpectedResult() throws Exception {
    when(moduleInvoker.processConfig(any(ModuleConfig.class)))
        .thenReturn(mockModuleResponseWithProjects);

    mockMvc
        .perform(get("/all-projects"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Engineering"))
        .andExpect(jsonPath("$[0].majors[0].id").value(1))
        .andExpect(jsonPath("$[0].majors[0].name").value("Computer Science"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].id").value(1))
        .andExpect(jsonPath("$[0].majors[0].posts[0].name").value("AI Project"))
        .andExpect(
            jsonPath("$[0].majors[0].posts[0].description")
                .value("Research in AI and Machine Learning"))
        .andExpect(
            jsonPath("$[0].majors[0].posts[0].desiredQualifications")
                .value("Knowledge of ML and basic AI algorithms"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].isActive").value(true))
        .andExpect(jsonPath("$[0].majors[0].posts[0].majors[0]").value("Computer Science"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].umbrellaTopics[0]").value("AI"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].researchPeriods[0]").value("Fall 2025"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].faculty.firstName").value("Dr."))
        .andExpect(jsonPath("$[0].majors[0].posts[0].faculty.lastName").value("Faculty"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].faculty.email").value("faculty@test.com"));
  }

  @Test
  @WithMockUser
  void getStudents_returnsExpectedResult() throws Exception {
    when(moduleInvoker.processConfig(any(ModuleConfig.class)))
        .thenReturn(mockModuleResponseWithStudents);

    mockMvc
        .perform(get("/all-students"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Engineering"))
        .andExpect(jsonPath("$[0].majors[0].id").value(1))
        .andExpect(jsonPath("$[0].majors[0].name").value("Computer Science"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].firstName").value("First"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].lastName").value("Last"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].email").value("flast@test.com"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].classStatus").value("Senior"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].graduationYear").value(2025))
        .andExpect(jsonPath("$[0].majors[0].posts[0].majors[0]").value("Computer Science"))
        .andExpect(
            jsonPath("$[0].majors[0].posts[0].researchFieldInterests[0]").value("Computer Science"))
        .andExpect(
            jsonPath("$[0].majors[0].posts[0].researchPeriodsInterest[0]").value("Fall 2025"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].interestReason").value("Test reason"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].hasPriorExperience").value(true))
        .andExpect(jsonPath("$[0].majors[0].posts[0].isActive").value(true));
  }

  @Test
  @WithMockUser
  void createStudent_returnsExpectedResult() throws Exception {
    StudentProto createdStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    CreateProfileResponse createProfileResponse =
        CreateProfileResponse.newBuilder()
            .setSuccess(true)
            .setCreatedStudent(createdStudent)
            .build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setCreateProfileResponse(createProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    CreateStudentRequestDTO requestDTO = new CreateStudentRequestDTO();
    requestDTO.setName("First Last");
    requestDTO.setClassStatus("Senior");
    requestDTO.setGraduationYear("2025");
    requestDTO.setHasPriorExperience(true);
    requestDTO.setInterestReason("Test reason");
    requestDTO.setMajor(List.of("Computer Science"));
    requestDTO.setResearchFieldInterests(List.of("Computer Science"));
    requestDTO.setResearchPeriodsInterest(List.of("Fall 2025"));

    mockMvc
        .perform(
            post("/api/studentProfiles")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isCreated()) // Expect HTTP 201 Created
        .andExpect(jsonPath("$.name").value("First Last"))
        .andExpect(jsonPath("$.classStatus").value("Senior"))
        .andExpect(jsonPath("$.graduationYear").value("2025"))
        .andExpect(jsonPath("$.hasPriorExperience").value(true))
        .andExpect(jsonPath("$.interestReason").value("Test reason"))
        .andExpect(jsonPath("$.major[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchFieldInterests[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchPeriodsInterest[0]").value("Fall 2025"));
  }

  @Test
  @WithMockUser
  void createFaculty_returnsExpectedResult() throws Exception {
    FacultyProto createdFaculty =
        FacultyProto.newBuilder()
            .setFirstName("John")
            .setLastName("Doe")
            .setEmail("johndoe@test.com")
            .addDepartments("Computer Science")
            .build();

    CreateProfileResponse createProfileResponse =
        CreateProfileResponse.newBuilder()
            .setSuccess(true)
            .setCreatedFaculty(createdFaculty)
            .build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setCreateProfileResponse(createProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    CreateFacultyRequestDTO requestDTO = new CreateFacultyRequestDTO();
    requestDTO.setName("John Doe");
    requestDTO.setDepartment(List.of("Computer Science"));

    mockMvc
        .perform(
            post("/api/facultyProfiles")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name").value("John Doe"))
        .andExpect(jsonPath("$.department[0]").value("Computer Science"));
  }

  @Test
  @WithMockUser
  void getCurrentProfile_returnsExpectedResult() throws Exception {
    StudentProto retrievedStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    RetrieveProfileResponse retrieveProfileResponse =
        RetrieveProfileResponse.newBuilder()
            .setSuccess(true)
            .setRetrievedStudent(retrievedStudent)
            .build();

    ProfileResponse profileResponse =
        ProfileResponse.newBuilder().setRetrieveProfileResponse(retrieveProfileResponse).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder().setProfileResponse(profileResponse).build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    mockMvc
        .perform(get("/api/studentProfiles/current"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("First"))
        .andExpect(jsonPath("$.lastName").value("Last"))
        .andExpect(jsonPath("$.classStatus").value("Senior"))
        .andExpect(jsonPath("$.email").value("flast@test.com"))
        .andExpect(jsonPath("$.graduationYear").value(2025))
        .andExpect(jsonPath("$.hasPriorExperience").value(true))
        .andExpect(jsonPath("$.isActive").value(true))
        .andExpect(jsonPath("$.interestReason").value("Test reason"))
        .andExpect(jsonPath("$.majors[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchFieldInterests[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchPeriodsInterest[0]").value("Fall 2025"));
  }

  @Test
  @WithMockUser
  void getResearchPeriods_returnsExpectedSuccess() throws Exception {
    ResearchPeriod period1 = new ResearchPeriod(1, "Period 1");
    ResearchPeriod period2 = new ResearchPeriod(2, "Period 2");
    List<ResearchPeriod> researchPeriods = List.of(period1, period2);

    when(researchPeriodService.getAllResearchPeriods()).thenReturn(researchPeriods);

    mockMvc
        .perform(get("/research-periods"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].id").value(period1.getId()))
        .andExpect(jsonPath("$[1].id").value(period2.getId()))
        .andExpect(jsonPath("$[0].name").value(period1.getName()))
        .andExpect(jsonPath("$[1].name").value(period2.getName()));
  }

  @Test
  @WithMockUser
  void getDepartments_returnsExpectedSuccess() throws Exception {
    Department dept1 = new Department(1, "Engineering, Math, and Life Sciences");
    Department dept2 = new Department(2, "Visual Arts");
    List<Department> departments = List.of(dept1, dept2);

    when(departmentService.getAllDepartments()).thenReturn(departments);

    mockMvc
        .perform(get("/departments"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].id").value(dept1.getId()))
        .andExpect(jsonPath("$[1].id").value(dept2.getId()))
        .andExpect(jsonPath("$[0].name").value(dept1.getName()))
        .andExpect(jsonPath("$[1].name").value(dept2.getName()));
  }

  @Test
  @WithMockUser
  void getMajors_returnsExpectedSuccess() throws Exception {
    Major major1 = new Major(1, "Computer Science");
    Major major2 = new Major(2, "Math");
    List<Major> majors = List.of(major1, major2);
    when(majorService.getAllMajors()).thenReturn(majors);

    mockMvc
        .perform(get("/majors"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].id").value(major1.getId()))
        .andExpect(jsonPath("$[1].id").value(major2.getId()))
        .andExpect(jsonPath("$[0].name").value(major1.getName()))
        .andExpect(jsonPath("$[1].name").value(major2.getName()));
  }

  @Test
  @WithMockUser
  void editStudentProfile_returnsExpectedResult() throws Exception {
    StudentProto editedStudent =
        StudentProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("New reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    EditProfileResponse editProfileResponse =
        EditProfileResponse.newBuilder().setSuccess(true).setEditedStudent(editedStudent).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setEditProfileResponse(editProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    EditStudentRequestDTO requestDTO = new EditStudentRequestDTO();
    requestDTO.setName("UpdatedFirst UpdatedLast");
    requestDTO.setClassStatus("Senior");
    requestDTO.setGraduationYear("2025");
    requestDTO.setHasPriorExperience(true);
    requestDTO.setIsActive(true);
    requestDTO.setInterestReason("New reason");
    requestDTO.setMajors(List.of("Computer Science"));
    requestDTO.setResearchFieldInterests(List.of("Computer Science"));
    requestDTO.setResearchPeriodsInterest(List.of("Fall 2025"));

    mockMvc
        .perform(
            put("/api/studentProfiles/current")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk()) // Expect HTTP 200 OK
        .andExpect(jsonPath("$.firstName").value("UpdatedFirst"))
        .andExpect(jsonPath("$.lastName").value("UpdatedLast"))
        .andExpect(jsonPath("$.email").value("flast@test.com"))
        .andExpect(jsonPath("$.classStatus").value("Senior"))
        .andExpect(jsonPath("$.graduationYear").value(2025))
        .andExpect(jsonPath("$.hasPriorExperience").value(true))
        .andExpect(jsonPath("$.isActive").value(true))
        .andExpect(jsonPath("$.interestReason").value("New reason"))
        .andExpect(jsonPath("$.majors[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchFieldInterests[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchPeriodsInterest[0]").value("Fall 2025"));
  }

  @Test
  @WithMockUser
  void getUmbrellaTopics_returnsExpectedSuccess() throws Exception {
    UmbrellaTopic topic1 = new UmbrellaTopic(1, "race");
    UmbrellaTopic topic2 = new UmbrellaTopic(2, "intersectionality");
    List<UmbrellaTopic> topics = List.of(topic1, topic2);
    when(umbrellaTopicService.getAllUmbrellaTopics()).thenReturn(topics);

    mockMvc
        .perform(get("/umbrella-topics"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].id").value(topic1.getId()))
        .andExpect(jsonPath("$[1].id").value(topic2.getId()))
        .andExpect(jsonPath("$[0].name").value(topic1.getName()))
        .andExpect(jsonPath("$[1].name").value(topic2.getName()));
  }

  @Test
  @WithMockUser
  void getDisciplines_returnsExpectedSuccess() throws Exception {
    Discipline discipline1 = new Discipline(1, "Engineering, Math, and Life Sciences");
    Discipline discipline2 = new Discipline(2, "Visual Arts");
    List<Discipline> disciplines = List.of(discipline1, discipline2);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    Major major1 = new Major(1, "Computer Science");
    Major major2 = new Major(2, "Math");
    Major major3 = new Major(3, "Drawing");
    when(majorService.getMajorsByDisciplineId(discipline1.getId()))
        .thenReturn(List.of(major1, major2));
    when(majorService.getMajorsByDisciplineId(discipline2.getId())).thenReturn(List.of(major3));

    mockMvc
        .perform(get("/disciplines"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].id").value(discipline1.getId()))
        .andExpect(jsonPath("$[1].id").value(discipline2.getId()))
        .andExpect(jsonPath("$[0].name").value(discipline1.getName()))
        .andExpect(jsonPath("$[1].name").value(discipline2.getName()))
        .andExpect(jsonPath("$[0].majors.length()").value(2))
        .andExpect(jsonPath("$[0].majors[0].id").value(major1.getId()))
        .andExpect(jsonPath("$[0].majors[0].name").value(major1.getName()))
        .andExpect(jsonPath("$[0].majors[1].id").value(major2.getId()))
        .andExpect(jsonPath("$[0].majors[1].name").value(major2.getName()))
        .andExpect(jsonPath("$[1].majors.length()").value(1))
        .andExpect(jsonPath("$[1].majors[0].id").value(major3.getId()))
        .andExpect(jsonPath("$[1].majors[0].name").value(major3.getName()));
  }

  @Test
  @WithMockUser
  void editFacultyProfile_returnsExpectedResult() throws Exception {
    FacultyProto editedFaculty =
        FacultyProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("faculty@test.com")
            .addDepartments("Life and Physical Sciences")
            .build();

    EditProfileResponse editProfileResponse =
        EditProfileResponse.newBuilder().setSuccess(true).setEditedFaculty(editedFaculty).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setEditProfileResponse(editProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    EditFacultyRequestDTO requestDTO = new EditFacultyRequestDTO();
    requestDTO.setName("UpdatedFirst UpdatedLast");
    requestDTO.setDepartment(List.of("Life and Physical Sciences"));

    mockMvc
        .perform(
            put("/api/facultyProfiles/current")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk()) // Expect HTTP 200 OK
        .andExpect(jsonPath("$.firstName").value("UpdatedFirst"))
        .andExpect(jsonPath("$.lastName").value("UpdatedLast"))
        .andExpect(jsonPath("$.email").value("faculty@test.com"))
        .andExpect(jsonPath("$.department[0]").value("Life and Physical Sciences"));
  }

  @Test
  @WithMockUser
  void deleteCurrentProfile_returnsExpectedResult() throws Exception {
    DeleteProfileResponse deleteProfileResponse =
        DeleteProfileResponse.newBuilder().setSuccess(true).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setDeleteProfileResponse(deleteProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    requestWrapper = mock(SecurityContextHolderAwareRequestWrapper.class);
    when(requestWrapper.getSession()).thenReturn(session);
    when(requestWrapper.isUserInRole(anyString())).thenReturn(true);
    authentication =
        new UsernamePasswordAuthenticationToken(
            new org.springframework.security.core.userdetails.User(
                "user", "password", AuthorityUtils.createAuthorityList("ROLE_USER")),
            "password",
            AuthorityUtils.createAuthorityList("ROLE_USER"));

    when(logoutService.logoutCurrentUser(
            any(SecurityContextHolderAwareRequestWrapper.class),
            any(HttpServletResponse.class),
            eq(authentication)))
        .thenReturn(true);

    mockMvc.perform(delete("/api/facultyProfiles/current")).andExpect(status().isOk());

    mockMvc.perform(delete("/api/studentProfiles/current")).andExpect(status().isOk());

    verify(logoutService, times(2))
        .logoutCurrentUser(
            any(SecurityContextHolderAwareRequestWrapper.class),
            any(HttpServletResponse.class),
            eq(authentication));
  }

  @Test
  @WithMockUser
  void getFacultyProfile_returnsExpectedResult() throws Exception {
    FacultyProto facultyProto =
        FacultyProto.newBuilder()
            .setFirstName("John")
            .setLastName("Doe")
            .setEmail("faculty@test.com")
            .addDepartments("Engineering, Math, and Computer Science")
            .build();

    ProjectProto projectProto =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("AI Research")
            .setDescription("Exploring AI models")
            .setDesiredQualifications("Machine Learning Experience")
            .setIsActive(true)
            .addMajors("Computer Science")
            .addUmbrellaTopics("Artificial Intelligence")
            .addResearchPeriods("Fall 2025")
            .setFaculty(facultyProto)
            .build();

    FacultyProfile facultyProfile =
        FacultyProfile.newBuilder().setFaculty(facultyProto).addProjects(projectProto).build();

    RetrieveProfileResponse retrieveProfileResponse =
        RetrieveProfileResponse.newBuilder()
            .setSuccess(true)
            .setProfileId(1)
            .setRetrievedFaculty(facultyProfile)
            .build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setRetrieveProfileResponse(retrieveProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);
    when(departmentService.getDepartmentByName("Engineering, Math, and Computer Science"))
        .thenReturn(Optional.of(new Department(1, "Engineering, Math, and Computer Science")));

    mockMvc
        .perform(get("/api/facultyProfiles/current"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("John"))
        .andExpect(jsonPath("$.lastName").value("Doe"))
        .andExpect(jsonPath("$.email").value("faculty@test.com"))
        .andExpect(jsonPath("$.department[0].id").value(1))
        .andExpect(
            jsonPath("$.department[0].name").value("Engineering, Math, and Computer Science"))
        .andExpect(jsonPath("$.projects[0].id").value(1))
        .andExpect(jsonPath("$.projects[0].name").value("AI Research"))
        .andExpect(jsonPath("$.projects[0].description").value("Exploring AI models"))
        .andExpect(
            jsonPath("$.projects[0].desiredQualifications").value("Machine Learning Experience"))
        .andExpect(jsonPath("$.projects[0].isActive").value(true))
        .andExpect(jsonPath("$.projects[0].majors[0]").value("Computer Science"))
        .andExpect(jsonPath("$.projects[0].umbrellaTopics[0]").value("Artificial Intelligence"))
        .andExpect(jsonPath("$.projects[0].researchPeriods[0]").value("Fall 2025"))
        .andExpect(jsonPath("$.projects[0].faculty.firstName").value("John"))
        .andExpect(jsonPath("$.projects[0].faculty.lastName").value("Doe"))
        .andExpect(jsonPath("$.projects[0].faculty.email").value("faculty@test.com"))
        .andExpect(
            jsonPath("$.projects[0].faculty.department[0]")
                .value("Engineering, Math, and Computer Science"));
  }

  @Test
  @WithMockUser
  void createProject_returnsExpectedResult() throws Exception {
    ProjectProto createdProject =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("Test title")
            .setDescription("Test description")
            .setDesiredQualifications("Test qualifications")
            .setIsActive(false)
            .addAllMajors(List.of("Computer Science"))
            .addAllUmbrellaTopics(List.of("AI"))
            .addAllResearchPeriods(List.of("Fall 2025"))
            .setFaculty(FacultyProto.newBuilder().setEmail("faculty@test.com"))
            .build();

    CreateProjectResponse createProjectResponse =
        CreateProjectResponse.newBuilder()
            .setSuccess(true)
            .setProjectId(1)
            .setCreatedProject(createdProject)
            .build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProjectResponse(
                proto.project.ProjectModule.ProjectResponse.newBuilder()
                    .setCreateProjectResponse(createProjectResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    CreateProjectRequestDTO requestDTO =
        new CreateProjectRequestDTO(
            1,
            "Test title",
            "Test description",
            List.of(
                new DisciplineDTO(1, "Engineering", List.of(new MajorDTO(1, "Computer Science"))),
                new DisciplineDTO(2, "Life and Physical Sciences", List.of())),
            List.of(new ResearchPeriodDTO(1, "Fall 2025")),
            "Test qualifications",
            List.of(new UmbrellaTopicDTO(1, "AI")),
            false);

    mockMvc
        .perform(
            post("/create-project")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.projectId").value(1))
        .andExpect(jsonPath("$.facultyEmail").value("faculty@test.com"))
        .andExpect(jsonPath("$.createdProject.title").value("Test title"))
        .andExpect(jsonPath("$.createdProject.description").value("Test description"))
        .andExpect(jsonPath("$.createdProject.desiredQualifications").value("Test qualifications"))
        .andExpect(jsonPath("$.createdProject.active").value(false))
        .andExpect(jsonPath("$.createdProject.majors[0].name").value("Computer Science"))
        .andExpect(jsonPath("$.createdProject.umbrellaTopics[0]").value("AI"))
        .andExpect(jsonPath("$.createdProject.researchPeriods[0]").value("Fall 2025"));
  }

  @Test
  @WithMockUser
  void deleteStudent_success_returnsOk() throws Exception {
    int studentId = 1;
    Student student = new Student();
    student.setId(studentId);
    student.setEmail("student@test.com");

    DeleteRequestDTO deleteStudentRequestDTO = new DeleteRequestDTO();
    deleteStudentRequestDTO.setId(studentId);

    // Mock studentService response
    when(studentService.getStudentById(studentId)).thenReturn(student);

    // Mock successful module response
    DeleteProfileResponse deleteProfileResponse =
        DeleteProfileResponse.newBuilder().setSuccess(true).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setDeleteProfileResponse(deleteProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    // Execute the request and verify
    mockMvc
        .perform(
            delete("/student")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(deleteStudentRequestDTO)))
        .andExpect(status().isOk());

    // Verify interactions
    verify(studentService, times(1)).getStudentById(studentId);
    verify(moduleInvoker, times(1)).processConfig(any(ModuleConfig.class));
  }

  @Test
  @WithMockUser
  void getAllFaculty_returnsExpectedResult() throws Exception {
    DepartmentProto engineeringProto =
        DepartmentProto.newBuilder().setDepartmentId(1).setDepartmentName("Engineering").build();

    FacultyProto facultyProto =
        FacultyProto.newBuilder()
            .setFacultyId(1)
            .setFirstName("John")
            .setLastName("Smith")
            .setEmail("jsmith@test.com")
            .addDepartments("Engineering")
            .build();

    ProjectProto projectProto =
        ProjectProto.newBuilder()
            .setProjectId(10)
            .setProjectName("Research Project")
            .setDescription("A sample research project")
            .setDesiredQualifications("Programming skills")
            .setIsActive(true)
            .addMajors("Computer Science")
            .addUmbrellaTopics("AI")
            .addResearchPeriods("Fall 2025")
            .build();

    FacultyWithProjects facultyWithProjects =
        FacultyWithProjects.newBuilder().setFaculty(facultyProto).addProjects(projectProto).build();

    DepartmentWithFaculty departmentWithFaculty =
        DepartmentWithFaculty.newBuilder()
            .setDepartment(engineeringProto)
            .addFacultyWithProjects(facultyWithProjects)
            .build();

    DepartmentHierarchy departmentHierarchy =
        DepartmentHierarchy.newBuilder().addDepartments(departmentWithFaculty).build();

    FetcherResponse fetcherResponse =
        FetcherResponse.newBuilder().setDepartmentHierarchy(departmentHierarchy).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder().setFetcherResponse(fetcherResponse).build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    mockMvc
        .perform(get("/all-faculty"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Engineering"))
        .andExpect(jsonPath("$[0].faculty.length()").value(1))
        .andExpect(jsonPath("$[0].faculty[0].firstName").value("John"))
        .andExpect(jsonPath("$[0].faculty[0].lastName").value("Smith"))
        .andExpect(jsonPath("$[0].faculty[0].email").value("jsmith@test.com"))
        .andExpect(jsonPath("$[0].faculty[0].department[0]").value("Engineering"))
        .andExpect(jsonPath("$[0].faculty[0].projects.length()").value(1))
        .andExpect(jsonPath("$[0].faculty[0].projects[0].id").value(10))
        .andExpect(jsonPath("$[0].faculty[0].projects[0].name").value("Research Project"))
        .andExpect(
            jsonPath("$[0].faculty[0].projects[0].description").value("A sample research project"))
        .andExpect(
            jsonPath("$[0].faculty[0].projects[0].desiredQualifications")
                .value("Programming skills"))
        .andExpect(jsonPath("$[0].faculty[0].projects[0].isActive").value(true))
        .andExpect(jsonPath("$[0].faculty[0].projects[0].majors[0]").value("Computer Science"))
        .andExpect(jsonPath("$[0].faculty[0].projects[0].umbrellaTopics[0]").value("AI"))
        .andExpect(jsonPath("$[0].faculty[0].projects[0].researchPeriods[0]").value("Fall 2025"));
  }

  @Test
  @WithMockUser
  void deleteProject_success_returnsOk() throws Exception {
    int projectId = 1;
    String facultyEmail = "faculty@example.com";

    when(roleAuthorizationService.checkUserRoles(any(), any()))
        .thenReturn(true);

    Faculty fac = new Faculty();
    fac.setEmail(facultyEmail);
    Project project = new Project();
    project.setId(projectId);
    project.setFaculty(fac);
    when(projectService.getProjectById(projectId)).thenReturn(project);

    DeleteProjectResponse deleteProjectResponse =
        DeleteProjectResponse.newBuilder().setSuccess(true).build();
    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProjectResponse(
                ProjectResponse.newBuilder()
                    .setDeleteProjectResponse(deleteProjectResponse))
            .build();
    when(moduleInvoker.processConfig(any(ModuleConfig.class)))
        .thenReturn(moduleResponse);

    DeleteRequestDTO body = new DeleteRequestDTO();
    body.setId(projectId);

    mockMvc.perform(delete("/project")
            .contentType("application/json")
            .content(objectMapper.writeValueAsString(body)))
        .andExpect(status().isOk());

    verify(moduleInvoker).processConfig(any(ModuleConfig.class));
  }

  @Test
  @WithMockUser
  void editStudent_returnsExpectedResult() throws Exception {
    Student student = new Student();
    student.setId(1);
    student.setEmail("flast@test.com");
    when(studentService.getStudentById(1)).thenReturn(student);

    StudentProto editedStudent =
        StudentProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("New reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    EditProfileResponse editProfileResponse =
        EditProfileResponse.newBuilder().setSuccess(true).setEditedStudent(editedStudent).build();
    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setEditProfileResponse(editProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    EditStudentRequestDTO requestDTO = new EditStudentRequestDTO();
    requestDTO.setId(1);
    requestDTO.setName("UpdatedFirst UpdatedLast");
    requestDTO.setClassStatus("Senior");
    requestDTO.setGraduationYear("2025");
    requestDTO.setHasPriorExperience(true);
    requestDTO.setIsActive(true);
    requestDTO.setInterestReason("New reason");
    requestDTO.setMajors(List.of("Computer Science"));
    requestDTO.setResearchFieldInterests(List.of("Computer Science"));
    requestDTO.setResearchPeriodsInterest(List.of("Fall 2025"));

    mockMvc
        .perform(
            put("/student")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("UpdatedFirst"))
        .andExpect(jsonPath("$.lastName").value("UpdatedLast"))
        .andExpect(jsonPath("$.email").value("flast@test.com"))
        .andExpect(jsonPath("$.classStatus").value("Senior"))
        .andExpect(jsonPath("$.graduationYear").value(2025))
        .andExpect(jsonPath("$.hasPriorExperience").value(true))
        .andExpect(jsonPath("$.isActive").value(true))
        .andExpect(jsonPath("$.interestReason").value("New reason"))
        .andExpect(jsonPath("$.majors[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchFieldInterests[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchPeriodsInterest[0]").value("Fall 2025"));
  }

  @Test
  @WithMockUser
  void editProject_returnsExpectedResult() throws Exception {
    String facultyEmail = "faculty@example.com";
    Faculty fac = new Faculty();
    fac.setEmail(facultyEmail);

    Project projectEntity = new Project();
    projectEntity.setId(1);
    projectEntity.setFaculty(fac);

    when(projectService.getProjectById(1)).thenReturn(projectEntity);

    when(roleAuthorizationService.checkUserRoles(any(), any()))
        .thenReturn(true);
    when(userService.getUserRoleByEmail(facultyEmail))
        .thenReturn(UserRole.FACULTY);

    EditProjectResponse editProjectResponse =
        EditProjectResponse.newBuilder()
            .setSuccess(true)
            .setProjectId(1)
            .setEditedProject(
                ProjectProto.newBuilder()
                    .setProjectId(1)
                    .setProjectName("Updated Test Title")
                    .setDescription("Updated Test Description")
                    .setDesiredQualifications("Updated Test Qualifications")
                    .setIsActive(true)
                    .addAllMajors(List.of("Biomedical Engineering"))
                    .addAllUmbrellaTopics(List.of("The Human Experience"))
                    .addAllResearchPeriods(List.of("Fall 2025"))
                    .setFaculty(
                        proto.data.Entities.FacultyProto.newBuilder()
                            .setEmail(facultyEmail))
                    .build())
            .build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProjectResponse(
                proto.project.ProjectModule.ProjectResponse.newBuilder()
                    .setEditProjectResponse(editProjectResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class)))
        .thenReturn(moduleResponse);

    CreateProjectRequestDTO requestDTO = new CreateProjectRequestDTO(
        1,
        "Updated Test Title",
        "Updated Test Description",
        List.of(new DisciplineDTO(1, "Engineering",
            List.of(new MajorDTO(1, "Biomedical Engineering")))),
        List.of(new ResearchPeriodDTO(3, "Fall 2025")),
        "Updated Test Qualifications",
        List.of(new UmbrellaTopicDTO(1, "The Human Experience")),
        true);

    mockMvc.perform(put("/project")
            .contentType("application/json")
            .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.projectId").value(1))
        .andExpect(jsonPath("$.createdProject.title").value("Updated Test Title"))
        .andExpect(jsonPath("$.createdProject.description").value("Updated Test Description"))
        .andExpect(jsonPath("$.createdProject.desiredQualifications")
            .value("Updated Test Qualifications"))
        .andExpect(jsonPath("$.createdProject.active").value(true))
        .andExpect(jsonPath("$.createdProject.majors[0].name")
            .value("Biomedical Engineering"))
        .andExpect(jsonPath("$.createdProject.umbrellaTopics[0]")
            .value("The Human Experience"))
        .andExpect(jsonPath("$.createdProject.researchPeriods[0]")
            .value("Fall 2025"));
  }

  @Test
  @WithMockUser
  void deleteFaculty_success_returnsOk() throws Exception {
    int facultyId = 1;
    Faculty faculty = new Faculty();
    faculty.setId(facultyId);
    faculty.setEmail("faculty@test.com");

    DeleteRequestDTO deleteRequestDTO = new DeleteRequestDTO();
    deleteRequestDTO.setId(facultyId);

    when(facultyService.getFacultyById(facultyId)).thenReturn(faculty);

    DeleteProfileResponse deleteProfileResponse =
        DeleteProfileResponse.newBuilder().setSuccess(true).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setDeleteProfileResponse(deleteProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    mockMvc
        .perform(
            delete("/faculty")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(deleteRequestDTO)))
        .andExpect(status().isOk());

    verify(facultyService, times(1)).getFacultyById(facultyId);
    verify(moduleInvoker, times(1)).processConfig(any(ModuleConfig.class));
  }

  @Test
  @WithMockUser
  void editFaculty_returnsExpectedResult() throws Exception {
    Faculty mockFacultyDTO = new Faculty();
    mockFacultyDTO.setEmail("faculty@test.com");
    when(facultyService.getFacultyById(anyInt())).thenReturn(mockFacultyDTO);

    FacultyProto editedFaculty =
        FacultyProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("faculty@test.com")
            .addDepartments("Life and Physical Sciences")
            .build();

    EditProfileResponse editProfileResponse =
        EditProfileResponse.newBuilder().setSuccess(true).setEditedFaculty(editedFaculty).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setEditProfileResponse(editProfileResponse))
            .build();

    when(moduleInvoker.processConfig(any(ModuleConfig.class))).thenReturn(moduleResponse);

    EditFacultyRequestDTO requestDTO = new EditFacultyRequestDTO();
    requestDTO.setId(1);
    requestDTO.setName("UpdatedFirst UpdatedLast");
    requestDTO.setDepartment(List.of("Life and Physical Sciences"));

    mockMvc
        .perform(
            put("/faculty")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("UpdatedFirst"))
        .andExpect(jsonPath("$.lastName").value("UpdatedLast"))
        .andExpect(jsonPath("$.email").value("faculty@test.com"))
        .andExpect(jsonPath("$.department[0]").value("Life and Physical Sciences"));
  }

  @Test
  @WithMockUser
  void editMajor_returnsExpectedResult() throws Exception {
    int majorId = 1;
    Major originalMajor = new Major(majorId, "Computer Science");
    Discipline oldDiscipline = new Discipline(1, "Engineering, Math, and Computer Science");
    Discipline newDiscipline = new Discipline(2, "Life and Physical Sciences");

    Set<Discipline> originalDisciplines = new HashSet<>();
    originalDisciplines.add(oldDiscipline);
    originalMajor.setDisciplines(originalDisciplines);

    Set<Discipline> updatedDisciplines = new HashSet<>();
    updatedDisciplines.add(newDiscipline);

    Major updatedMajor = new Major(majorId, "Data Science");
    updatedMajor.setDisciplines(updatedDisciplines);

    EditMajorRequestDTO requestDTO = new EditMajorRequestDTO();
    requestDTO.setId(majorId);
    requestDTO.setName("Data Science");
    requestDTO.setDisciplines(List.of("Life and Physical Sciences"));

    when(majorService.getMajorById(majorId)).thenReturn(originalMajor);
    when(disciplineService.getDisciplineByName("Life and Physical Sciences"))
        .thenReturn(newDiscipline);
    when(majorService.editMajor(eq(majorId), eq("Data Science"), any(Set.class)))
        .thenReturn(updatedMajor);

    mockMvc
        .perform(
            put("/major")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(majorId))
        .andExpect(jsonPath("$.name").value("Data Science"))
        .andExpect(jsonPath("$.disciplines.length()").value(1))
        .andExpect(jsonPath("$.disciplines[0]").value("Life and Physical Sciences"));

    verify(majorService, times(1)).getMajorById(majorId);
    verify(disciplineService, times(1)).getDisciplineByName("Life and Physical Sciences");
    verify(majorService, times(1)).editMajor(eq(majorId), eq("Data Science"), any(Set.class));
  }

  @Test
  @WithMockUser
  void editUmbrellaTopic_returnsExpectedResult() throws Exception {
    UmbrellaTopic existingTopic = new UmbrellaTopic();
    existingTopic.setId(1);
    existingTopic.setName("Old Name");

    UmbrellaTopic updatedTopic = new UmbrellaTopic();
    updatedTopic.setId(1);
    updatedTopic.setName("New Name");

    when(umbrellaTopicService.getUmbrellaTopicById(1)).thenReturn(existingTopic);
    when(umbrellaTopicService.saveUmbrellaTopic(any(UmbrellaTopic.class))).thenReturn(updatedTopic);

    UmbrellaTopicDTO requestDTO = new UmbrellaTopicDTO(1, "New Name");

    mockMvc
        .perform(
            put("/umbrella-topic")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("New Name"));
  }

  @Test
  @WithMockUser
  void deleteDiscipline_returnsExpectedResult() throws Exception {
    DeleteRequestDTO deleteRequestDTO = new DeleteRequestDTO();
    deleteRequestDTO.setId(1);

    doNothing().when(disciplineService).deleteDisciplineById(1);

    mockMvc
        .perform(
            delete("/discipline")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(deleteRequestDTO)))
        .andExpect(status().isOk());

    verify(disciplineService, times(1)).deleteDisciplineById(1);
  }

  @Test
  @WithMockUser
  void deleteDepartment_returnsExpectedResult() throws Exception {
    DeleteRequestDTO deleteRequestDTO = new DeleteRequestDTO();
    deleteRequestDTO.setId(1);

    doNothing().when(departmentService).deleteByDepartmentId(1);

    mockMvc
        .perform(
            delete("/department")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(deleteRequestDTO)))
        .andExpect(status().isOk());

    verify(departmentService, times(1)).deleteByDepartmentId(1);
  }

  @Test
  @WithMockUser
  void createMajor_returnsExpectedResult() throws Exception {
    CreateMajorRequestDTO requestDTO = new CreateMajorRequestDTO();
    requestDTO.setName("Computer Engineering");
    requestDTO.setDisciplines(List.of("Engineering", "Computer Science"));

    Discipline engineering = new Discipline(1, "Engineering");
    Discipline computerScience = new Discipline(2, "Computer Science");

    Major savedMajor = new Major(1, "Computer Engineering");
    Set<Discipline> savedDisciplines = new HashSet<>();
    savedDisciplines.add(engineering);
    savedDisciplines.add(computerScience);
    savedMajor.setDisciplines(savedDisciplines);

    when(disciplineService.getDisciplineByName("Engineering")).thenReturn(engineering);
    when(disciplineService.getDisciplineByName("Computer Science")).thenReturn(computerScience);
    when(majorService.saveMajor(any(Major.class))).thenReturn(savedMajor);

    mockMvc
        .perform(
            post("/major")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isCreated());

    verify(disciplineService, times(1)).getDisciplineByName("Engineering");
    verify(disciplineService, times(1)).getDisciplineByName("Computer Science");
  }

  @Test
  @WithMockUser
  void getProject_returnsExpectedResult() throws Exception {
    int projectId = 8;

    Project project = new Project();
    project.setId(projectId);
    project.setName("AI Research Project");
    project.setDescription("Advanced research in artificial intelligence");
    project.setDesiredQualifications("Machine learning experience");
    project.setIsActive(true);

    Set<UmbrellaTopic> umbrellaTopics = new HashSet<>();
    umbrellaTopics.add(new UmbrellaTopic(1, "Artificial Intelligence"));
    umbrellaTopics.add(new UmbrellaTopic(2, "Machine Learning"));
    project.setUmbrellaTopics(umbrellaTopics);

    Set<ResearchPeriod> researchPeriods = new HashSet<>();
    researchPeriods.add(new ResearchPeriod(1, "Fall 2025"));
    researchPeriods.add(new ResearchPeriod(2, "Spring 2026"));
    project.setResearchPeriods(researchPeriods);

    Set<Major> majors = new HashSet<>();
    majors.add(new Major(1, "Computer Science"));
    majors.add(new Major(2, "Data Science"));
    project.setMajors(majors);

    when(projectService.getProjectById(projectId)).thenReturn(project);

    mockMvc
        .perform(get("/project").param("id", String.valueOf(projectId)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(projectId))
        .andExpect(jsonPath("$.name").value("AI Research Project"))
        .andExpect(jsonPath("$.description").value("Advanced research in artificial intelligence"))
        .andExpect(jsonPath("$.desiredQualifications").value("Machine learning experience"))
        .andExpect(jsonPath("$.isActive").value(true))
        .andExpect(
            jsonPath("$.umbrellaTopics", hasItems("Artificial Intelligence", "Machine Learning")))
        .andExpect(jsonPath("$.researchPeriods", hasItems("Fall 2025", "Spring 2026")))
        .andExpect(jsonPath("$.majors", hasItems("Computer Science", "Data Science")));

    verify(projectService, times(1)).getProjectById(projectId);
  }

  @Test
  @WithMockUser
  void editDiscipline_returnsExpectedResult() throws Exception {
    Discipline existingDiscipline = new Discipline(1, "Old Name");

    Discipline updatedDiscipline = new Discipline(1, "New Name");

    Major major1 = new Major(10, "Computer Science");
    Major major2 = new Major(20, "Math");

    DisciplineDTO requestDTO = new DisciplineDTO(1, "New Name", null);

    when(disciplineService.getDisciplineById(1)).thenReturn(existingDiscipline);
    when(disciplineService.editDiscipline(1, "New Name")).thenReturn(updatedDiscipline);
    when(majorService.getMajorsByDisciplineId(1)).thenReturn(List.of(major1, major2));

    mockMvc
        .perform(
            put("/discipline")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("New Name"))
        .andExpect(jsonPath("$.majors.length()").value(2))
        .andExpect(jsonPath("$.majors[0].id").value(10))
        .andExpect(jsonPath("$.majors[0].name").value("Computer Science"))
        .andExpect(jsonPath("$.majors[1].id").value(20))
        .andExpect(jsonPath("$.majors[1].name").value("Math"));

    verify(disciplineService, times(1)).editDiscipline(1, "New Name");
    verify(majorService, times(1)).getMajorsByDisciplineId(1);
  }

  @Test
  @WithMockUser
  void deleteUmbrellaTopic_returnsExpectedResult() throws Exception {
    DeleteRequestDTO deleteRequestDTO = new DeleteRequestDTO();
    deleteRequestDTO.setId(1);

    doNothing().when(umbrellaTopicService).deleteUmbrellaTopicById(1);

    mockMvc
        .perform(
            delete("/umbrella-topic")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(deleteRequestDTO)))
        .andExpect(status().isOk());

    verify(umbrellaTopicService, times(1)).deleteUmbrellaTopicById(1);
  }

  @Test
  @WithMockUser
  void getFacultyProfileById_returnsExpectedResult() throws Exception {
    // Set up sample faculty data
    int facultyId = 3;
    Faculty sampleFaculty = new Faculty();
    sampleFaculty.setId(facultyId);
    sampleFaculty.setFirstName("Dr. John");
    sampleFaculty.setLastName("Doe");
    sampleFaculty.setEmail("john.doe@example.com");

    // Create a sample Department and add it to a HashSet, then assign to faculty
    Department dept = new Department();
    dept.setId(1);
    dept.setName("Engineering");
    Set<Department> departmentSet = new HashSet<>();
    departmentSet.add(dept);
    sampleFaculty.setDepartments(departmentSet);

    // Create sample Major objects for the project and add to a HashSet
    Major major1 = new Major();
    major1.setId(1);
    major1.setName("Computer Science");
    Major major2 = new Major();
    major2.setId(2);
    major2.setName("Education");
    Set<Major> majorSet = new HashSet<>();
    majorSet.add(major1);
    majorSet.add(major2);

    // Create a sample UmbrellaTopic
    UmbrellaTopic ut = new UmbrellaTopic();
    ut.setName("AI");
    Set<UmbrellaTopic> umbrellaTopics = new HashSet<>();
    umbrellaTopics.add(ut);

    // Create a sample ResearchPeriod
    ResearchPeriod rp = new ResearchPeriod();
    rp.setName("Fall 2025");
    Set<ResearchPeriod> researchPeriods = new HashSet<>();
    researchPeriods.add(rp);

    // Set up a sample project associated with the faculty.
    Project sampleProject = new Project();
    sampleProject.setId(1001);
    sampleProject.setName("AI Research");
    sampleProject.setDescription("Exploring AI in education.");
    sampleProject.setDesiredQualifications("Experience in Python and AI frameworks.");
    sampleProject.setIsActive(true);
    sampleProject.setMajors(majorSet);
    sampleProject.setUmbrellaTopics(umbrellaTopics);
    sampleProject.setResearchPeriods(researchPeriods);
    sampleProject.setFaculty(sampleFaculty);
    List<Project> projects = List.of(sampleProject);

    // Mock the service calls
    when(facultyService.getFacultyById(facultyId)).thenReturn(sampleFaculty);
    when(projectService.getProjectsByFacultyId(facultyId)).thenReturn(projects);

    // Perform the GET request and verify the returned JSON
    mockMvc
        .perform(get("/faculty").param("id", String.valueOf(facultyId)))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(facultyId))
        .andExpect(jsonPath("$.firstName").value("Dr. John"))
        .andExpect(jsonPath("$.lastName").value("Doe"))
        .andExpect(jsonPath("$.email").value("john.doe@example.com"))
        // Verify that the department is returned as a DepartmentDTO with a 'name'
        // property
        .andExpect(jsonPath("$.department[0]").value("Engineering"))
        // Verify project details
        .andExpect(jsonPath("$.projects[0].id").value(1001))
        .andExpect(jsonPath("$.projects[0].name").value("AI Research"))
        .andExpect(jsonPath("$.projects[0].description").value("Exploring AI in education."))
        .andExpect(
            jsonPath("$.projects[0].desiredQualifications")
                .value("Experience in Python and AI frameworks."))
        .andExpect(jsonPath("$.projects[0].isActive").value(true))
        // Check that both majors exist (order is not guaranteed)
        .andExpect(jsonPath("$.projects[0].majors").isArray())
        .andExpect(jsonPath("$.projects[0].majors", hasItem("Computer Science")))
        .andExpect(jsonPath("$.projects[0].majors", hasItem("Education")))
        // Check umbrella topics and research periods (since they're sets, we expect
        // arrays)
        .andExpect(jsonPath("$.projects[0].umbrellaTopics").isArray())
        .andExpect(jsonPath("$.projects[0].umbrellaTopics", hasItem("AI")))
        .andExpect(jsonPath("$.projects[0].researchPeriods").isArray())
        .andExpect(jsonPath("$.projects[0].researchPeriods", hasItem("Fall 2025")));
  }

  @Test
  @WithMockUser
  void createDiscipline_validRequest_returnsCreated() throws Exception {
    DisciplineDTO requestDTO = new DisciplineDTO();
    requestDTO.setName("Engineering");

    Discipline savedDiscipline = new Discipline(1, "Engineering");
    when(disciplineService.saveDiscipline(any(Discipline.class))).thenReturn(savedDiscipline);
    when(majorService.getMajorsByDisciplineId(1)).thenReturn(List.of());

    mockMvc
        .perform(
            post("/discipline")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("Engineering"))
        .andExpect(jsonPath("$.majors.length()").value(0));

    verify(disciplineService, times(1)).saveDiscipline(any(Discipline.class));
    verify(majorService, times(1)).getMajorsByDisciplineId(1);
  }

  @Test
  @WithMockUser
  void createDiscipline_emptyName_returnsBadRequest() throws Exception {
    DisciplineDTO requestDTO = new DisciplineDTO();
    requestDTO.setName("  "); // empty after trim

    mockMvc
        .perform(
            post("/discipline")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser
  void createDiscipline_serviceThrowsException_returnsInternalServerError() throws Exception {
    DisciplineDTO requestDTO = new DisciplineDTO();
    requestDTO.setName("Engineering");

    when(disciplineService.saveDiscipline(any(Discipline.class)))
        .thenThrow(new RuntimeException("DB error"));

    mockMvc
        .perform(
            post("/discipline")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isInternalServerError());
  }

  @Test
  @WithMockUser
  void getStudent_returnsExpectedResult() throws Exception {
    int studentId = 42;

    Student sampleStudent = new Student();
    sampleStudent.setId(studentId);
    sampleStudent.setFirstName("Jane");
    sampleStudent.setLastName("Doe");
    sampleStudent.setEmail("jane.doe@example.com");
    sampleStudent.setUndergradYear(1); // 1 maps to "Freshman"
    sampleStudent.setGraduationYear(2025);

    Major major = new Major();
    major.setName("Computer Science");
    Set<Major> majors = new HashSet<>();
    majors.add(major);
    sampleStudent.setMajors(majors);

    Major researchField = new Major();
    researchField.setName("Mathematics");
    Set<Major> researchFields = new HashSet<>();
    researchFields.add(researchField);
    sampleStudent.setResearchFieldInterests(researchFields);

    ResearchPeriod rp = new ResearchPeriod();
    rp.setName("Fall 2024");
    Set<ResearchPeriod> researchPeriods = new HashSet<>();
    researchPeriods.add(rp);
    sampleStudent.setResearchPeriods(researchPeriods);

    sampleStudent.setInterestReason("I love research");
    sampleStudent.setHasPriorExperience(true);
    sampleStudent.setIsActive(true);

    // Mock the service call to return the sample student.
    when(studentService.getStudentById(studentId)).thenReturn(sampleStudent);

    // Perform the GET request using a query parameter "id"
    mockMvc
        .perform(get("/student").param("id", String.valueOf(studentId)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(studentId))
        .andExpect(jsonPath("$.firstName").value("Jane"))
        .andExpect(jsonPath("$.lastName").value("Doe"))
        .andExpect(jsonPath("$.email").value("jane.doe@example.com"))
        // undergradYear 1 maps to "Freshman" by undergradYearToClassStatus
        .andExpect(jsonPath("$.classStatus").value("Freshman"))
        .andExpect(jsonPath("$.graduationYear").value(2025))
        // Since we have one major, one research field, and one research period:
        .andExpect(jsonPath("$.majors[0]").value("Computer Science"))
        .andExpect(jsonPath("$.researchFieldInterests[0]").value("Mathematics"))
        .andExpect(jsonPath("$.researchPeriodsInterest[0]").value("Fall 2024"))
        .andExpect(jsonPath("$.interestReason").value("I love research"))
        .andExpect(jsonPath("$.hasPriorExperience").value(true))
        .andExpect(jsonPath("$.isActive").value(true));
  }

  @Test
  @WithMockUser
  void deleteResearchPeriod_returnsExpectedResult() throws Exception {
    DeleteRequestDTO deleteRequestDTO = new DeleteRequestDTO();
    deleteRequestDTO.setId(1);

    doNothing().when(researchPeriodService).deleteResearchPeriodById(1);

    mockMvc
        .perform(
            delete("/research-period")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(deleteRequestDTO)))
        .andExpect(status().isOk());

    verify(researchPeriodService, times(1)).deleteResearchPeriodById(1);
  }

  @Test
  @WithMockUser
  void editResearchPeriod_returnsExpectedResult() throws Exception {
    int periodId = 1;
    String newName = "Spring 2025";

    ResearchPeriod existingPeriod = new ResearchPeriod();
    existingPeriod.setId(periodId);
    existingPeriod.setName("Fall 2024");

    ResearchPeriod updatedPeriod = new ResearchPeriod();
    updatedPeriod.setId(periodId);
    updatedPeriod.setName(newName);

    when(researchPeriodService.getResearchPeriodById(periodId)).thenReturn(existingPeriod);
    when(researchPeriodService.saveResearchPeriod(existingPeriod)).thenReturn(updatedPeriod);

    ResearchPeriodDTO requestDto = new ResearchPeriodDTO(periodId, newName);
    String requestJson = objectMapper.writeValueAsString(requestDto);

    mockMvc
        .perform(put("/research-period").contentType("application/json").content(requestJson))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(periodId))
        .andExpect(jsonPath("$.name").value(newName));
  }

  @Test
  @WithMockUser
  void editDepartment_returnsExpectedResult() throws Exception {
    int deptId = 4;
    String oldName = "Old Department";
    String newName = "Updated Department";

    Department existingDept = new Department();
    existingDept.setId(deptId);
    existingDept.setName(oldName);

    Department updatedDept = new Department();
    updatedDept.setId(deptId);
    updatedDept.setName(newName);

    when(departmentService.getDepartmentById(deptId)).thenReturn(existingDept);
    when(departmentService.saveDepartment(existingDept)).thenReturn(updatedDept);

    DepartmentDTO requestDto = new DepartmentDTO();
    requestDto.setId(deptId);
    requestDto.setName(newName);

    String requestJson = objectMapper.writeValueAsString(requestDto);

    mockMvc
        .perform(put("/department").contentType("application/json").content(requestJson))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(deptId))
        .andExpect(jsonPath("$.name").value(newName));
  }

  @Test
  @WithMockUser
  void createUmbrellaTopic_validRequest_returnsCreated() throws Exception {
    UmbrellaTopicDTO requestDTO = new UmbrellaTopicDTO();
    requestDTO.setName("Test Topic");

    UmbrellaTopic savedTopic = new UmbrellaTopic();
    savedTopic.setId(1);
    savedTopic.setName("Test Topic");

    when(umbrellaTopicService.saveUmbrellaTopic(any(UmbrellaTopic.class))).thenReturn(savedTopic);

    mockMvc
        .perform(
            post("/umbrella-topic")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("Test Topic"));

    verify(umbrellaTopicService, times(1)).saveUmbrellaTopic(any(UmbrellaTopic.class));
  }

  @Test
  @WithMockUser
  void createUmbrellaTopic_emptyName_returnsBadRequest() throws Exception {
    UmbrellaTopicDTO requestDTO = new UmbrellaTopicDTO();
    requestDTO.setName("   "); // empty after trim

    mockMvc
        .perform(
            post("/umbrella-topic")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser
  void createUmbrellaTopic_serviceThrowsException_returnsInternalServerError() throws Exception {
    UmbrellaTopicDTO requestDTO = new UmbrellaTopicDTO();
    requestDTO.setName("Test Topic");

    when(umbrellaTopicService.saveUmbrellaTopic(any(UmbrellaTopic.class)))
        .thenThrow(new RuntimeException("DB error"));

    mockMvc
        .perform(
            post("/umbrella-topic")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isInternalServerError());
  }

  @Test
  @WithMockUser
  void editEmailNotifications_validRequest_returnsUpdatedNotifications() throws Exception {
    EmailNotification studentNotification = new EmailNotification();
    studentNotification.setId(1);
    studentNotification.setSubject("Old Student Subject");
    studentNotification.setBody("Old Student Body");
    studentNotification.setEmailNotificationType(EmailNotificationType.STUDENTS);

    EmailNotification facultyNotification = new EmailNotification();
    facultyNotification.setId(2);
    facultyNotification.setSubject("Old Faculty Subject");
    facultyNotification.setBody("Old Faculty Body");
    facultyNotification.setEmailNotificationType(EmailNotificationType.FACULTY);

    when(emailNotificationService.getAllEmailNotifications())
        .thenReturn(List.of(studentNotification, facultyNotification));
    when(emailNotificationService.saveEmailNotification(any(EmailNotification.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    List<EmailNotificationDTO> requestList =
        List.of(
            new EmailNotificationDTO("STUDENTS", "New Student Subject", "New Student Body"),
            new EmailNotificationDTO("FACULTY", "New Faculty Subject", "New Faculty Body"));

    mockMvc
        .perform(
            put("/email-templates")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestList)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(
            jsonPath("$[?(@.type=='STUDENTS')].subject").value(hasItem("New Student Subject")))
        .andExpect(jsonPath("$[?(@.type=='STUDENTS')].body").value(hasItem("New Student Body")))
        .andExpect(
            jsonPath("$[?(@.type=='FACULTY')].subject").value(hasItem("New Faculty Subject")))
        .andExpect(jsonPath("$[?(@.type=='FACULTY')].body").value(hasItem("New Faculty Body")));

    verify(emailNotificationService, times(1)).getAllEmailNotifications();
    verify(emailNotificationService, times(2)).saveEmailNotification(any(EmailNotification.class));
  }

  @Test
  @WithMockUser
  void createResearchPeriod_returnsExpectedResult() throws Exception {
    String newName = "Spring 2025";

    ResearchPeriodDTO requestDto = new ResearchPeriodDTO();
    requestDto.setName(newName);

    ResearchPeriod savedPeriod = new ResearchPeriod();
    savedPeriod.setId(1);
    savedPeriod.setName(newName);

    when(researchPeriodService.saveResearchPeriod(any(ResearchPeriod.class)))
        .thenReturn(savedPeriod);

    String requestJson = objectMapper.writeValueAsString(requestDto);

    mockMvc
        .perform(post("/research-period").contentType("application/json").content(requestJson))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value(newName));
  }

  @Test
  @WithMockUser
  void createDepartment_returnsExpectedResult() throws Exception {
    int deptId = 5;
    String deptName = "New Department";

    Department newDept = new Department();
    newDept.setName(deptName);

    Department savedDept = new Department();
    savedDept.setId(deptId);
    savedDept.setName(deptName);

    when(departmentService.saveDepartment(any(Department.class))).thenReturn(savedDept);

    DepartmentDTO requestDto = new DepartmentDTO();
    requestDto.setName(deptName);

    String requestJson = objectMapper.writeValueAsString(requestDto);

    mockMvc
        .perform(post("/department").contentType("application/json").content(requestJson))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(deptId))
        .andExpect(jsonPath("$.name").value(deptName));
  }

  @Test
  @WithMockUser
  void getEmailNotifications_returnsExpectedResult() throws Exception {
    EmailNotification notification1 = new EmailNotification();
    notification1.setId(1);
    notification1.setSubject("Welcome Student");
    notification1.setBody("Hello, welcome to the research portal!");
    notification1.setEmailNotificationType(EmailNotificationType.STUDENTS);

    EmailNotification notification2 = new EmailNotification();
    notification2.setId(2);
    notification2.setSubject("Faculty Match");
    notification2.setBody("A student is interested in your research!");
    notification2.setEmailNotificationType(EmailNotificationType.FACULTY);

    when(emailNotificationService.getAllEmailNotifications())
        .thenReturn(List.of(notification1, notification2));

    mockMvc
        .perform(get("/email-templates"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[?(@.type=='STUDENTS')].subject").value(hasItem("Welcome Student")))
        .andExpect(
            jsonPath("$[?(@.type=='STUDENTS')].body")
                .value(hasItem("Hello, welcome to the research portal!")))
        .andExpect(jsonPath("$[?(@.type=='FACULTY')].subject").value(hasItem("Faculty Match")))
        .andExpect(
            jsonPath("$[?(@.type=='FACULTY')].body")
                .value(hasItem("A student is interested in your research!")));

    verify(emailNotificationService, times(1)).getAllEmailNotifications();
  }

  @Test
  @WithMockUser
  void getStudentFaqs_returnsExpectedFaqs() throws Exception {
    Faq faq = new Faq(1, "What is OUR?", "Office of Undergraduate Research", FaqType.STUDENT);
    when(faqService.getAllFaqsByType(FaqType.STUDENT)).thenReturn(List.of(faq));

    mockMvc
        .perform(get("/all-student-faqs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].question").value("What is OUR?"))
        .andExpect(jsonPath("$[0].answer").value("Office of Undergraduate Research"));
  }

  @Test
  @WithMockUser
  void getFacultyFaqs_returnsExpectedFaqs() throws Exception {
    Faq faq = new Faq(2, "How do I post a project?", "Use the faculty dashboard", FaqType.FACULTY);
    when(faqService.getAllFaqsByType(FaqType.FACULTY)).thenReturn(List.of(faq));

    mockMvc
        .perform(get("/all-faculty-faqs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].id").value(2))
        .andExpect(jsonPath("$[0].question").value("How do I post a project?"))
        .andExpect(jsonPath("$[0].answer").value("Use the faculty dashboard"));
  }

  @Test
  @WithMockUser
  void getAdminFaqs_returnsExpectedFaqs() throws Exception {
    Faq faq = new Faq(3, "How do I approve accounts?", "Via the admin panel", FaqType.ADMIN);
    when(faqService.getAllFaqsByType(FaqType.ADMIN)).thenReturn(List.of(faq));

    mockMvc
        .perform(get("/all-admin-faqs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].id").value(3))
        .andExpect(jsonPath("$[0].question").value("How do I approve accounts?"))
        .andExpect(jsonPath("$[0].answer").value("Via the admin panel"));
  }

  @Test
  @WithMockUser
  void createFaq_returnsExpectedResult() throws Exception {
    Faq faq = new Faq(1, "Test question", "Test answer", FaqType.STUDENT);
    when(faqService.saveFaq(any(Faq.class))).thenReturn(faq);

    FaqRequestDTO requestDTO = new FaqRequestDTO();
    requestDTO.setId(1); // This will be ignored by the controller.
    requestDTO.setQuestion("Test question");
    requestDTO.setAnswer("Test answer");
    requestDTO.setType(FaqType.STUDENT);

    String requestJson = objectMapper.writeValueAsString(requestDTO);

    mockMvc
        .perform(post("/faq").contentType("application/json").content(requestJson))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.question").value("Test question"))
        .andExpect(jsonPath("$.answer").value("Test answer"))
        .andExpect(jsonPath("$.type").value("STUDENT"));

    verify(faqService, times(1)).saveFaq(any(Faq.class));
  }

  @Test
  @WithMockUser
  void editFaq_returnsExpectedResult() throws Exception {
    Faq existingFaq = new Faq(1, "Old question", "Old answer", FaqType.STUDENT);
    when(faqService.getFaqById(1)).thenReturn(existingFaq);

    Faq editedFaq = new Faq(1, "Updated question", "Updated answer", FaqType.STUDENT);
    when(faqService.saveFaq(any(Faq.class))).thenReturn(editedFaq);

    FaqRequestDTO requestDTO = new FaqRequestDTO();
    requestDTO.setId(1);
    requestDTO.setQuestion("Updated question");
    requestDTO.setAnswer("Updated answer");
    requestDTO.setType(FaqType.STUDENT); // Will be ignored by the controller

    String requestJson = objectMapper.writeValueAsString(requestDTO);

    mockMvc
        .perform(put("/faq").contentType("application/json").content(requestJson))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.question").value("Updated question"))
        .andExpect(jsonPath("$.answer").value("Updated answer"))
        .andExpect(jsonPath("$.type").value("STUDENT"));

    verify(faqService, times(1)).getFaqById(1);
    verify(faqService, times(1)).saveFaq(any(Faq.class));
  }

  @Test
  @WithMockUser
  void deleteFaq_returnsExpectedResult() throws Exception {
    FaqRequestDTO requestDTO = new FaqRequestDTO();
    requestDTO.setId(1);

    doNothing().when(faqService).deleteFaqById(1);

    mockMvc
        .perform(
            delete("/faq")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(requestDTO)))
        .andExpect(status().isOk());

    verify(faqService, times(1)).deleteFaqById(1);
  }

  @Test
  @WithMockUser
  void getProjects_withFilters_returnsFilteredProjects() throws Exception {
    FacultyProto faculty =
        FacultyProto.newBuilder()
            .setFirstName("Dr.")
            .setLastName("Faculty")
            .setEmail("faculty@test.com")
            .build();

    ProjectProto project =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("AI Project")
            .setDescription("Research in AI and Machine Learning")
            .setDesiredQualifications("Knowledge of ML and basic AI algorithms")
            .setIsActive(true)
            .addMajors("Computer Science")
            .addUmbrellaTopics("AI")
            .addResearchPeriods("Fall 2025")
            .setFaculty(faculty)
            .build();

    MajorProto major =
        MajorProto.newBuilder().setMajorId(1).setMajorName("Computer Science").build();

    MajorWithEntityCollection majorWithProjects =
        MajorWithEntityCollection.newBuilder()
            .setMajor(major)
            .setProjectCollection(ProjectCollection.newBuilder().addProjects(project))
            .build();

    DisciplineProto discipline =
        DisciplineProto.newBuilder().setDisciplineId(1).setDisciplineName("Engineering").build();

    DisciplineWithMajors disciplineWithMajorsAndProjects =
        DisciplineWithMajors.newBuilder()
            .setDiscipline(discipline)
            .addMajors(majorWithProjects)
            .build();

    ProjectHierarchy projectHierarchyWithProjects =
        ProjectHierarchy.newBuilder().addDisciplines(disciplineWithMajorsAndProjects).build();

    ModuleResponse filteredResponse =
        ModuleResponse.newBuilder()
            .setFetcherResponse(
                FetcherResponse.newBuilder().setProjectHierarchy(projectHierarchyWithProjects))
            .build();

    when(moduleInvoker.processConfig(
            argThat(
                config -> {
                  FilteredFetcher filteredFetcher = config.getFetcherRequest().getFilteredFetcher();
                  return filteredFetcher.getMajorIdsList().contains(1)
                      && filteredFetcher.getResearchPeriodIdsList().contains(2)
                      && filteredFetcher.getUmbrellaTopicIdsList().contains(3)
                      && filteredFetcher.getKeywords().equals("machine learning");
                })))
        .thenReturn(filteredResponse);

    mockMvc
        .perform(
            get("/all-projects")
                .param("majors", "1")
                .param("researchPeriods", "2")
                .param("umbrellaTopics", "3")
                .param("search", "machine learning"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Engineering"))
        .andExpect(jsonPath("$[0].majors[0].id").value(1))
        .andExpect(jsonPath("$[0].majors[0].name").value("Computer Science"))
        .andExpect(jsonPath("$[0].majors[0].posts[0].name").value("AI Project"));

    verify(moduleInvoker)
        .processConfig(
            argThat(
                config -> {
                  FilteredFetcher filteredFetcher = config.getFetcherRequest().getFilteredFetcher();
                  return filteredFetcher.getMajorIdsList().contains(1)
                      && filteredFetcher.getResearchPeriodIdsList().contains(2)
                      && filteredFetcher.getUmbrellaTopicIdsList().contains(3)
                      && filteredFetcher.getKeywords().equals("machine learning");
                }));
  }

  @Test
  @WithMockUser
  void getAllFaculty_withKeywordFilter_returnsFilteredFaculty() throws Exception {
    DepartmentProto engineeringProto =
        DepartmentProto.newBuilder().setDepartmentId(1).setDepartmentName("Engineering").build();

    FacultyProto facultyProto =
        FacultyProto.newBuilder()
            .setFacultyId(1)
            .setFirstName("John")
            .setLastName("Smith")
            .setEmail("jsmith@test.com")
            .addDepartments("Engineering")
            .build();

    FacultyWithProjects facultyWithProjects =
        FacultyWithProjects.newBuilder().setFaculty(facultyProto).build();

    DepartmentWithFaculty departmentWithFaculty =
        DepartmentWithFaculty.newBuilder()
            .setDepartment(engineeringProto)
            .addFacultyWithProjects(facultyWithProjects)
            .build();

    DepartmentHierarchy departmentHierarchy =
        DepartmentHierarchy.newBuilder().addDepartments(departmentWithFaculty).build();

    FetcherResponse fetcherResponse =
        FetcherResponse.newBuilder().setDepartmentHierarchy(departmentHierarchy).build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder().setFetcherResponse(fetcherResponse).build();

    when(moduleInvoker.processConfig(
            argThat(
                config -> {
                  FilteredFetcher filteredFetcher = config.getFetcherRequest().getFilteredFetcher();
                  return filteredFetcher.getFilteredType() == FilteredType.FILTERED_TYPE_FACULTY
                      && filteredFetcher.getKeywords().equals("john");
                })))
        .thenReturn(moduleResponse);

    mockMvc
        .perform(get("/all-faculty").param("search", "john"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].name").value("Engineering"))
        .andExpect(jsonPath("$[0].faculty[0].firstName").value("John"))
        .andExpect(jsonPath("$[0].faculty[0].lastName").value("Smith"))
        .andExpect(jsonPath("$[0].faculty[0].email").value("jsmith@test.com"));

    verify(moduleInvoker)
        .processConfig(
            argThat(
                config -> {
                  FilteredFetcher filteredFetcher = config.getFetcherRequest().getFilteredFetcher();
                  return filteredFetcher.getFilteredType() == FilteredType.FILTERED_TYPE_FACULTY
                      && filteredFetcher.getKeywords().equals("john");
                }));
  }

  @Test
  @WithMockUser
  void getFacultyProfile_withFilters_returnsFilteredProjects() throws Exception {
    FacultyProto facultyProto =
        FacultyProto.newBuilder()
            .setFirstName("John")
            .setLastName("Doe")
            .setEmail("faculty@test.com")
            .addDepartments("Engineering, Math, and Computer Science")
            .build();

    ProjectProto projectProto =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("AI Research")
            .setDescription("Exploring AI models")
            .setDesiredQualifications("Machine Learning Experience")
            .setIsActive(true)
            .addMajors("Computer Science")
            .addUmbrellaTopics("Artificial Intelligence")
            .addResearchPeriods("Fall 2025")
            .setFaculty(facultyProto)
            .build();

    FacultyProfile facultyProfile =
        FacultyProfile.newBuilder().setFaculty(facultyProto).addProjects(projectProto).build();

    RetrieveProfileResponse retrieveProfileResponse =
        RetrieveProfileResponse.newBuilder()
            .setSuccess(true)
            .setProfileId(1)
            .setRetrievedFaculty(facultyProfile)
            .build();

    ModuleResponse moduleResponse =
        ModuleResponse.newBuilder()
            .setProfileResponse(
                ProfileResponse.newBuilder().setRetrieveProfileResponse(retrieveProfileResponse))
            .build();

    when(moduleInvoker.processConfig(
            argThat(
                config -> {
                  RetrieveProfileRequest request =
                      config.getProfileRequest().getRetrieveProfileRequest();
                  FilteredFetcher filters = request.getFilters();
                  return filters.getMajorIdsList().contains(1)
                      && filters.getResearchPeriodIdsList().contains(2)
                      && filters.getUmbrellaTopicIdsList().contains(3)
                      && filters.getKeywords().equals("AI");
                })))
        .thenReturn(moduleResponse);

    when(departmentService.getDepartmentByName("Engineering, Math, and Computer Science"))
        .thenReturn(Optional.of(new Department(1, "Engineering, Math, and Computer Science")));

    mockMvc
        .perform(
            get("/api/facultyProfiles/current")
                .param("majors", "1")
                .param("researchPeriods", "2")
                .param("umbrellaTopics", "3")
                .param("search", "AI"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.firstName").value("John"))
        .andExpect(jsonPath("$.lastName").value("Doe"))
        .andExpect(jsonPath("$.projects[0].name").value("AI Research"));

    verify(moduleInvoker)
        .processConfig(
            argThat(
                config -> {
                  RetrieveProfileRequest request =
                      config.getProfileRequest().getRetrieveProfileRequest();
                  FilteredFetcher filters = request.getFilters();
                  return filters.getMajorIdsList().contains(1)
                      && filters.getResearchPeriodIdsList().contains(2)
                      && filters.getUmbrellaTopicIdsList().contains(3)
                      && filters.getKeywords().equals("AI");
                }));
  }
}
