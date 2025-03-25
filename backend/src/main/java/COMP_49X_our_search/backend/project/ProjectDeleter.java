package COMP_49X_our_search.backend.project;

import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.project.ProjectModule.DeleteProjectRequest;
import proto.project.ProjectModule.DeleteProjectResponse;

@Service
public class ProjectDeleter {

  private final ProjectService projectService;

  @Autowired
  public ProjectDeleter(ProjectService projectService) {
    this.projectService = projectService;
  }

  public DeleteProjectResponse deleteProject(DeleteProjectRequest request) {
    // No need to validate the request itself for now since it only asks for the
    // project id, which defaults to 0 if not set, so we can just call the
    // project service which throws an exception if the project is not found.
    try {
      projectService.deleteById(request.getProjectId());

      return DeleteProjectResponse.newBuilder().setSuccess(true).build();
    } catch (Exception e) {
      return DeleteProjectResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage("Error deleting project: " + e.getMessage())
          .build();
    }
    }
}
