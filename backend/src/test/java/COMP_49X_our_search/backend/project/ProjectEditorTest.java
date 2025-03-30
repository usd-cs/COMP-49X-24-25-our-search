package COMP_49X_our_search.backend.project;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.ProjectProto;
import proto.project.ProjectModule.EditProjectRequest;
import proto.project.ProjectModule.EditProjectResponse;

public class ProjectEditorTest {

  private ProjectService projectService;
  private MajorService majorService;
  private UmbrellaTopicService umbrellaTopicService;
  private ResearchPeriodService researchPeriodService;
  private ProjectEditor projectEditor;

  @BeforeEach
  void setUp() {
    projectService = mock(ProjectService.class);
    majorService = mock(MajorService.class);
    umbrellaTopicService = mock(UmbrellaTopicService.class);
    researchPeriodService = mock(ResearchPeriodService.class);
    projectEditor =
        new ProjectEditor(
            projectService,
            majorService,
            umbrellaTopicService,
            researchPeriodService);
  }

  @Test
  public void testEditProject_validProjectData_returnsSuccessResponse() {
    Project mockProject = new Project();
    mockProject.setId(1);
    mockProject.setName("Old Project Name");
    mockProject.setDescription("Old Description");
    mockProject.setDesiredQualifications("Old Qualifications");
    mockProject.setIsActive(false);
    mockProject.setMajors(new HashSet<>());
    mockProject.setUmbrellaTopics(new HashSet<>());
    mockProject.setResearchPeriods(new HashSet<>());

    Major mockMajor = new Major();
    mockMajor.setName("Computer Science");

    UmbrellaTopic mockTopic = new UmbrellaTopic();
    mockTopic.setName("AI");

    ResearchPeriod mockPeriod = new ResearchPeriod();
    mockPeriod.setName("Fall 2024");

    when(projectService.existsById(1)).thenReturn(true);
    when(projectService.getProjectById(1)).thenReturn(mockProject);
    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(mockMajor));
    when(umbrellaTopicService.getUmbrellaTopicByName("AI")).thenReturn(Optional.of(mockTopic));
    when(researchPeriodService.getResearchPeriodByName("Fall 2024")).thenReturn(Optional.of(mockPeriod));

    Project savedProject = new Project();
    savedProject.setId(1);
    savedProject.setName("New Project Name");
    savedProject.setDescription("New Description");
    savedProject.setDesiredQualifications("New Qualifications");
    savedProject.setIsActive(true);
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

    ProjectProto validProject = ProjectProto.newBuilder()
        .setProjectId(1)
        .setProjectName("New Project Name")
        .setDescription("New Description")
        .setDesiredQualifications("New Qualifications")
        .setIsActive(true)
        .addMajors("Computer Science")
        .addUmbrellaTopics("AI")
        .addResearchPeriods("Fall 2024")
        .build();

    EditProjectRequest request = EditProjectRequest.newBuilder()
        .setProject(validProject)
        .build();

    EditProjectResponse response = projectEditor.editProject(request);
    System.out.println(response.getErrorMessage());

    assertTrue(response.getSuccess());
    assertEquals(1, response.getProjectId());
    assertEquals("New Project Name", response.getEditedProject().getProjectName());
  }

  @Test
  public void testEditProject_projectNotFound_returnsFailureResponse() {
    when(projectService.existsById(999)).thenReturn(false);

    ProjectProto invalidProject = ProjectProto.newBuilder()
        .setProjectId(999)
        .setProjectName("New Project Name")
        .setDescription("New Description")
        .setDesiredQualifications("New Qualifications")
        .setIsActive(true)
        .addMajors("Computer Science")
        .addUmbrellaTopics("AI")
        .addResearchPeriods("Fall 2024")
        .build();

    EditProjectRequest request = EditProjectRequest.newBuilder()
        .setProject(invalidProject)
        .build();

    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> projectEditor.editProject(request));

    assertTrue(
        exception.getMessage()
            .contains("Project with id: 999 not found.")
    );
  }

  @Test
  public void testEditProject_invalidProjectData_returnsFailureResponse() {
    when(projectService.existsById(1)).thenReturn(true);

    ProjectProto invalidProject = ProjectProto.newBuilder()
        .setProjectId(1)
        .setProjectName("")  // Empty project name
        .setDescription("Description")
        .setDesiredQualifications("Qualifications")
        .addMajors("Computer Science")
        .addUmbrellaTopics("AI")
        .addResearchPeriods("Fall 2024")
        .build();

    EditProjectRequest request = EditProjectRequest.newBuilder()
        .setProject(invalidProject)
        .build();

    Exception exception =
        assertThrows(IllegalArgumentException.class, () -> projectEditor.editProject(request));

    assertTrue(
        exception.getMessage()
            .contains("ProjectProto must have valid following fields:"));
  }

  @Test
  public void testEditProject_majorNotFound_returnsFailureResponse() {
    Project mockProject = new Project();
    mockProject.setId(1);

    when(projectService.existsById(1)).thenReturn(true);
    when(projectService.getProjectById(1)).thenReturn(mockProject);
    when(majorService.getMajorByName("NonExistentMajor")).thenReturn(Optional.empty());

    ProjectProto invalidProject = ProjectProto.newBuilder()
        .setProjectId(1)
        .setProjectName("Project Name")
        .setDescription("Description")
        .setDesiredQualifications("Qualifications")
        .addMajors("NonExistentMajor")
        .addUmbrellaTopics("AI")
        .addResearchPeriods("Fall 2024")
        .build();

    EditProjectRequest request = EditProjectRequest.newBuilder()
        .setProject(invalidProject)
        .build();

    EditProjectResponse response = projectEditor.editProject(request);

    assertFalse(response.getSuccess());
    assertTrue(response.getErrorMessage().contains("Major not found: NonExistentMajor"));
  }

  @Test
  public void testEditProject_umbrellaTopicNotFound_returnsFailureResponse() {
    Project mockProject = new Project();
    mockProject.setId(1);

    Major mockMajor = new Major();
    mockMajor.setName("Computer Science");

    when(projectService.existsById(1)).thenReturn(true);
    when(projectService.getProjectById(1)).thenReturn(mockProject);
    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(mockMajor));
    when(umbrellaTopicService.getUmbrellaTopicByName("NonExistentTopic")).thenReturn(Optional.empty());

    ProjectProto invalidProject = ProjectProto.newBuilder()
        .setProjectId(1)
        .setProjectName("Project Name")
        .setDescription("Description")
        .setDesiredQualifications("Qualifications")
        .addMajors("Computer Science")
        .addUmbrellaTopics("NonExistentTopic")
        .addResearchPeriods("Fall 2024")
        .build();

    EditProjectRequest request = EditProjectRequest.newBuilder()
        .setProject(invalidProject)
        .build();

    EditProjectResponse response = projectEditor.editProject(request);

    assertFalse(response.getSuccess());
    assertTrue(response.getErrorMessage().contains("Umbrella topic not found: NonExistentTopic"));
  }

  @Test
  public void testEditProject_researchPeriodNotFound_returnsFailureResponse() {
    Project mockProject = new Project();
    mockProject.setId(1);

    Major mockMajor = new Major();
    mockMajor.setName("Computer Science");

    UmbrellaTopic mockTopic = new UmbrellaTopic();
    mockTopic.setName("AI");

    when(projectService.existsById(1)).thenReturn(true);
    when(projectService.getProjectById(1)).thenReturn(mockProject);
    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(mockMajor));
    when(umbrellaTopicService.getUmbrellaTopicByName("AI")).thenReturn(Optional.of(mockTopic));
    when(researchPeriodService.getResearchPeriodByName("NonExistentPeriod")).thenReturn(Optional.empty());

    ProjectProto invalidProject = ProjectProto.newBuilder()
        .setProjectId(1)
        .setProjectName("Project Name")
        .setDescription("Description")
        .setDesiredQualifications("Qualifications")
        .addMajors("Computer Science")
        .addUmbrellaTopics("AI")
        .addResearchPeriods("NonExistentPeriod")
        .build();

    EditProjectRequest request = EditProjectRequest.newBuilder()
        .setProject(invalidProject)
        .build();

    EditProjectResponse response = projectEditor.editProject(request);

    assertFalse(response.getSuccess());
    assertTrue(response.getErrorMessage().contains("Umbrella topic not found: NonExistentPeriod"));
  }

  @Test
  public void testEditProject_emptyMajorsList_returnsFailureResponse() {
    when(projectService.existsById(1)).thenReturn(true);

    ProjectProto invalidProject = ProjectProto.newBuilder()
        .setProjectId(1)
        .setProjectName("Project Name")
        .setDescription("Description")
        .setDesiredQualifications("Qualifications")
        .addUmbrellaTopics("AI")
        .addResearchPeriods("Fall 2024")
        .build();

    EditProjectRequest request = EditProjectRequest.newBuilder()
        .setProject(invalidProject)
        .build();

    Exception exception = assertThrows(
        IllegalArgumentException.class,
        () -> projectEditor.editProject(request)
    );

    assertTrue(exception.getMessage().contains("ProjectProto must have valid following fields:"));
  }

  @Test
  public void testEditProject_invalidRequest_throwsException() {
    EditProjectRequest request = EditProjectRequest.getDefaultInstance();

    Exception exception = assertThrows(
        IllegalArgumentException.class,
        () -> projectEditor.editProject(request)
    );

    assertTrue(exception.getMessage().contains("EditProjectRequest must contain 'project'"));
  }
}