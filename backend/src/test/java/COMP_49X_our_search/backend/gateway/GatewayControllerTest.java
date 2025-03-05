package COMP_49X_our_search.backend.gateway;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import COMP_49X_our_search.backend.gateway.dto.CreateFacultyRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.CreateStudentRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.EditFacultyRequestDTO;
import COMP_49X_our_search.backend.gateway.dto.EditStudentRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.DisciplineProto;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.ProjectProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.DataTypes.StudentCollection;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.profile.ProfileModule.CreateProfileResponse;
import proto.profile.ProfileModule.EditProfileResponse;
import proto.profile.ProfileModule.ProfileResponse;
import proto.profile.ProfileModule.RetrieveProfileResponse;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
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
  }

  @Test
  @WithMockUser // include this annotation to mock that a user is authenticated to access the
                // protected endpoints of the application
  void getProjects_returnsExpectedResult() throws Exception {
    when(moduleInvoker.processConfig(any(ModuleConfig.class)))
        .thenReturn(mockModuleResponseWithProjects);

    mockMvc
        .perform(get("/projects"))
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
        .perform(get("/students"))
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
    requestDTO.setHasPriorExperience("yes");
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
        .andExpect(jsonPath("$.hasPriorExperience").value("yes"))
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
    requestDTO.setHasPriorExperience("yes");
    requestDTO.setIsActive("yes");
    requestDTO.setInterestReason("New reason");
    requestDTO.setMajor(List.of("Computer Science"));
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

    mockMvc
        .perform(get("/disciplines"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].id").value(discipline1.getId()))
        .andExpect(jsonPath("$[1].id").value(discipline2.getId()))
        .andExpect(jsonPath("$[0].name").value(discipline1.getName()))
        .andExpect(jsonPath("$[1].name").value(discipline2.getName()));
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
}
