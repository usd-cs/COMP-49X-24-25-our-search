package COMP_49X_our_search.backend.project;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.project.ProjectModule.CreateProjectRequest;

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
    // TODO(acescudero): Implement
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
  public void testCreateProject_invalidRequest_throwsException() {
    CreateProjectRequest request = CreateProjectRequest.getDefaultInstance();
    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> projectCreator.createProject(request));

    assertTrue(exception.getMessage().contains("CreateProjectRequest must contain 'project'"));
  }
}
