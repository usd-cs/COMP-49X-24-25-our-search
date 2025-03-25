package COMP_49X_our_search.backend.project;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import COMP_49X_our_search.backend.database.services.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.project.ProjectModule.DeleteProjectRequest;
import proto.project.ProjectModule.DeleteProjectResponse;

public class ProjectDeleterTest {

  private ProjectService projectService;
  private ProjectDeleter projectDeleter;

  @BeforeEach
  void setUp() {
    projectService = mock(ProjectService.class);
    projectDeleter = new ProjectDeleter(projectService);
  }

  @Test
  public void testDeleteProject_deletionSuccessful_returnsExpectedResponse() {
    int projectId = 42;
    DeleteProjectRequest request = DeleteProjectRequest.newBuilder()
        .setProjectId(projectId)
        .build();

    doNothing().when(projectService).deleteById(projectId);

    DeleteProjectResponse response = projectDeleter.deleteProject(request);

    assertTrue(response.getSuccess());
    assertEquals("", response.getErrorMessage());
    verify(projectService, times(1)).deleteById(projectId);
  }

  @Test
  public void testDeleteProject_projectNotFound_returnsErrorResponse() {
    int nonExistentProjectId = 999;
    DeleteProjectRequest request = DeleteProjectRequest.newBuilder()
        .setProjectId(nonExistentProjectId)
        .build();

    String errorMessage = "Project not found with id: " + nonExistentProjectId;
    doThrow(new RuntimeException(errorMessage))
        .when(projectService).deleteById(nonExistentProjectId);

    DeleteProjectResponse response = projectDeleter.deleteProject(request);

    assertFalse(response.getSuccess());
    assertEquals("Error deleting project: " + errorMessage, response.getErrorMessage());
    verify(projectService, times(1)).deleteById(nonExistentProjectId);
  }
}
