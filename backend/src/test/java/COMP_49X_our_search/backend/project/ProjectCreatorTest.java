package COMP_49X_our_search.backend.project;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.project.ProjectModule.CreateProjectRequest;
import proto.project.ProjectModule.CreateProjectResponse;

public class ProjectCreatorTest {

  private ProjectService projectService;
  private FacultyService facultyService;
  private MajorService majorService;
  private UmbrellaTopicService umbrellaTopicService;
  private ResearchPeriodService researchPeriodService;
  private ProjectCreator projectCreator;

  @BeforeEach
  void setUp() {
    projectService = mock(ProjectService.class);
    facultyService = mock(FacultyService.class);
    majorService = mock(MajorService.class);
    umbrellaTopicService = mock(UmbrellaTopicService.class);
    researchPeriodService = mock(ResearchPeriodService.class);
    projectCreator =
        new ProjectCreator(
            projectService,
            facultyService,
            majorService,
            umbrellaTopicService,
            researchPeriodService);
  }

  @Test
  public void testCreateProject_validProjectData_returnsExpectedResult() {
    Faculty mockFaculty = new Faculty();
    mockFaculty.setId(10);
    mockFaculty.setEmail("professor@university.edu");
    mockFaculty.setFirstName("Professor");
    mockFaculty.setLastName("Smith");

    Major mockMajor = new Major();
    mockMajor.setName("Computer Science");

    UmbrellaTopic mockTopic = new UmbrellaTopic();
    mockTopic.setName("AI");

    ResearchPeriod mockPeriod = new ResearchPeriod();
    mockPeriod.setName("Fall 2024");

    when(facultyService.existsByEmail("professor@university.edu")).thenReturn(true);
    when(facultyService.getFacultyByEmail("professor@university.edu")).thenReturn(mockFaculty);
    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(mockMajor));
    when(umbrellaTopicService.getUmbrellaTopicByName("AI")).thenReturn(Optional.of(mockTopic));
    when(researchPeriodService.getResearchPeriodByName("Fall 2024")).thenReturn(Optional.of(mockPeriod));

    Project savedProject = new Project();
    savedProject.setId(1);
    savedProject.setName("New Research Project");
    savedProject.setDescription("Exploring ML applications");
    savedProject.setDesiredQualifications("Python, TensorFlow");
    savedProject.setIsActive(true);
    savedProject.setFaculty(mockFaculty);

    Set<Major> majors = new HashSet<>();
    majors.add(mockMajor);
    savedProject.setMajors(majors);

    Set<UmbrellaTopic> topics = new HashSet<>();
    topics.add(mockTopic);
    savedProject.setUmbrellaTopics(topics);

    Set<ResearchPeriod> periods = new HashSet<>();
    periods.add(mockPeriod);
    savedProject.setResearchPeriods(periods);

    when(projectService.saveProject(any(Project.class))).thenReturn(savedProject);

    FacultyProto facultyProto = FacultyProto.newBuilder()
        .setEmail("professor@university.edu")
        .setFirstName("Professor")
        .setLastName("Nonexistent")
        .build();

    ProjectProto validProject = ProjectProto.newBuilder()
        .setProjectName("New Research Project")
        .setDescription("Exploring ML applications")
        .setDesiredQualifications("Python, TensorFlow")
        .setIsActive(true)
        .addMajors("Computer Science")
        .addUmbrellaTopics("AI")
        .addResearchPeriods("Fall 2024")
        .setFaculty(facultyProto)
        .build();

    CreateProjectRequest request = CreateProjectRequest.newBuilder()
        .setProject(validProject)
        .build();

    CreateProjectResponse response = projectCreator.createProject(request);

    assertTrue(response.getSuccess());
    assertEquals(1, response.getProjectId());
    assertEquals("New Research Project", response.getCreatedProject().getProjectName());
    assertEquals("professor@university.edu", response.getCreatedProject().getFaculty().getEmail());
  }

  @Test
  public void testCreateProject_invalidProjectData_throwsException() {
    ProjectProto invalidProject =
        ProjectProto.newBuilder().setProjectName("").setDescription("Test").build();

    CreateProjectRequest request =
        CreateProjectRequest.newBuilder().setProject(invalidProject).build();
    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> projectCreator.createProject(request));

    assertTrue(
        exception
            .getMessage()
            .contains(
                "ProjectProto must have valid following fields: "
                    + "project_name, description, desired_qualifications, majors, "
                    + "umbrella_topics, research_periods"));
  }

  @Test
  public void testCreateProject_validProjectData_invalidFacultyData_throwsException() {
    FacultyProto invalidFaculty = FacultyProto.getDefaultInstance();
    ProjectProto validProjectWithInvalidFaculty =
        ProjectProto.newBuilder()
            .setProjectName("Name")
            .setDescription("Description")
            .setDesiredQualifications("Qualifications")
            .addMajors("Major")
            .addUmbrellaTopics("Topic")
            .addResearchPeriods("Period")
            .setFaculty(invalidFaculty)
            .build();

    CreateProjectRequest request =
        CreateProjectRequest.newBuilder().setProject(validProjectWithInvalidFaculty).build();

    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> projectCreator.createProject(request));

    assertTrue(
        exception
            .getMessage()
            .contains("ProjectProto must have 'FacultyProto' with 'email' field set"));
  }

  @Test
  public void testCreateProject_facultyNotFound_throwsException() {
    FacultyProto facultyProto = FacultyProto.newBuilder()
        .setEmail("nonexistent@university.edu")
        .setFirstName("Professor")
        .setLastName("Nonexistent")
        .build();

    when(facultyService.existsByEmail("nonexistent@university.edu")).thenReturn(false);

    ProjectProto validProject = ProjectProto.newBuilder()
        .setProjectName("Research Project")
        .setDescription("Description")
        .setDesiredQualifications("Qualifications")
        .addMajors("Major")
        .addUmbrellaTopics("Topic")
        .addResearchPeriods("Period")
        .setFaculty(facultyProto)
        .build();

    CreateProjectRequest request = CreateProjectRequest.newBuilder()
        .setProject(validProject)
        .build();

    CreateProjectResponse response = projectCreator.createProject(request);

    assertTrue(!response.getSuccess());
    assertTrue(response.getErrorMessage().contains("Faculty member with email 'nonexistent@university.edu' does not exist"));
  }

  @Test
  public void testCreateProject_invalidRequest_throwsException() {
    CreateProjectRequest request = CreateProjectRequest.getDefaultInstance();
    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> projectCreator.createProject(request));

    assertTrue(exception.getMessage().contains("CreateProjectRequest must contain 'project'"));
  }
}