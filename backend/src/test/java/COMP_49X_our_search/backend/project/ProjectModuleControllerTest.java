package COMP_49X_our_search.backend.project;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.project.ProjectModule.CreateProjectRequest;
import proto.project.ProjectModule.CreateProjectResponse;
import proto.project.ProjectModule.ProjectRequest;
import proto.project.ProjectModule.ProjectResponse;

public class ProjectModuleControllerTest {

  private ProjectModuleController projectModuleController;
  private ProjectCreator projectCreator;
  private ProjectDeleter projectDeleter;
  private ProjectEditor projectEditor;

  @BeforeEach
  void setUp() {
    projectCreator = mock(ProjectCreator.class);
    projectDeleter = mock(ProjectDeleter.class);
    projectEditor = mock(ProjectEditor.class);
    projectModuleController = new ProjectModuleController(projectCreator, projectDeleter, projectEditor);
  }

  @Test
  public void testProcessConfig_validRequest_createProject_returnsExpectedResult() {
    FacultyProto faculty = FacultyProto.newBuilder()
        .setEmail("faculty@test.com")
        .setFirstName("John")
        .setLastName("Doe")
        .build();

    ProjectProto validProject = ProjectProto.newBuilder()
        .setProjectName("Research Project")
        .setDescription("Project Description")
        .setDesiredQualifications("Required Qualifications")
        .setIsActive(true)
        .addMajors("Computer Science")
        .addUmbrellaTopics("Machine Learning")
        .addResearchPeriods("Fall 2025")
        .setFaculty(faculty)
        .build();

    CreateProjectRequest createProjectRequest = CreateProjectRequest.newBuilder()
        .setProject(validProject)
        .build();

    CreateProjectResponse mockCreateProjectResponse = CreateProjectResponse.newBuilder()
        .setSuccess(true)
        .setProjectId(1)
        .setCreatedProject(validProject)
        .build();

    ProjectRequest projectRequest = ProjectRequest.newBuilder()
        .setCreateProjectRequest(createProjectRequest)
        .build();

    ProjectResponse mockProjectResponse = ProjectResponse.newBuilder()
        .setCreateProjectResponse(mockCreateProjectResponse)
        .build();

    when(projectCreator.createProject(createProjectRequest))
        .thenReturn(mockCreateProjectResponse);

    ModuleConfig moduleConfig = ModuleConfig.newBuilder()
        .setProjectRequest(projectRequest)
        .build();

    ModuleResponse response = projectModuleController.processConfig(moduleConfig);

    assertEquals(mockProjectResponse, response.getProjectResponse());
  }

  @Test
  public void testProcessConfig_createProjectFailed_returnsErrorResponse() {
    FacultyProto faculty = FacultyProto.newBuilder()
        .setEmail("faculty@test.com")
        .build();

    ProjectProto invalidProject = ProjectProto.newBuilder()
        .setProjectName("Research Project")
        .setFaculty(faculty)
        .build();

    CreateProjectRequest createProjectRequest = CreateProjectRequest.newBuilder()
        .setProject(invalidProject)
        .build();

    CreateProjectResponse mockErrorResponse = CreateProjectResponse.newBuilder()
        .setSuccess(false)
        .setErrorMessage("Project is missing required fields")
        .build();

    ProjectRequest projectRequest = ProjectRequest.newBuilder()
        .setCreateProjectRequest(createProjectRequest)
        .build();

    ProjectResponse mockProjectResponse = ProjectResponse.newBuilder()
        .setCreateProjectResponse(mockErrorResponse)
        .build();

    when(projectCreator.createProject(createProjectRequest))
        .thenReturn(mockErrorResponse);

    ModuleConfig moduleConfig = ModuleConfig.newBuilder()
        .setProjectRequest(projectRequest)
        .build();

    ModuleResponse response = projectModuleController.processConfig(moduleConfig);

    assertEquals(mockProjectResponse, response.getProjectResponse());
  }

  @Test
  public void testProcessConfig_operationTypeNotSet_throwsException() {
    ProjectRequest emptyRequest = ProjectRequest.getDefaultInstance();

    ModuleConfig moduleConfig = ModuleConfig.newBuilder()
        .setProjectRequest(emptyRequest)
        .build();

    Exception exception = assertThrows(
        UnsupportedOperationException.class,
        () -> projectModuleController.processConfig(moduleConfig)
    );

    assertEquals("Unsupported operation_request: OPERATIONREQUEST_NOT_SET", exception.getMessage());
  }

  @Test
  public void testProcessConfig_requestDoesNotContainProjectRequest_throwsException() {
    ModuleConfig emptyConfig = ModuleConfig.getDefaultInstance();

    Exception exception = assertThrows(
        IllegalArgumentException.class,
        () -> projectModuleController.processConfig(emptyConfig)
    );

    assertEquals("ModuleConfig does not contain a ProjectRequest.", exception.getMessage());
  }

  @Test
  public void testProcessConfig_unsupportedOperationType_throwsException() {
    ProjectRequest.Builder customRequestBuilder = ProjectRequest.newBuilder();

    ProjectRequest customRequest = customRequestBuilder.build();

    ModuleConfig moduleConfig = ModuleConfig.newBuilder()
        .setProjectRequest(customRequest)
        .build();

    Exception exception = assertThrows(
        UnsupportedOperationException.class,
        () -> projectModuleController.processConfig(moduleConfig)
    );

    assertEquals("Unsupported operation_request: OPERATIONREQUEST_NOT_SET", exception.getMessage());
  }
}