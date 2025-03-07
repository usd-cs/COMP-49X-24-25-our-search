package COMP_49X_our_search.backend.project;

import COMP_49X_our_search.backend.core.ModuleController;
import COMP_49X_our_search.backend.database.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.project.ProjectModule.CreateProjectRequest;
import proto.project.ProjectModule.CreateProjectResponse;
import proto.project.ProjectModule.ProjectRequest;
import proto.project.ProjectModule.ProjectResponse;

@Service
public class ProjectModuleController implements ModuleController {

  private final ProjectCreator projectCreator;

  @Autowired
  public ProjectModuleController(ProjectCreator projectCreator) {
    this.projectCreator = projectCreator;
  }

  @Override
  public ModuleResponse processConfig(ModuleConfig moduleConfig) {
    validateConfig(moduleConfig);

    ProjectRequest request = moduleConfig.getProjectRequest();
    ProjectResponse response;
    switch (request.getOperationRequestCase()) {
      case CREATE_PROJECT_REQUEST:
        response =
            ProjectResponse.newBuilder()
                .setCreateProjectResponse(
                    // Could move this to a helper method in the future similar
                    // to the Profile module if we decide to have multiple
                    // different implementations of Project creation.
                    projectCreator.createProject(request.getCreateProjectRequest()))
                .build();
        break;
      // Add more cases as we add more operation types, e.g., edit, delete
      default:
        throw new UnsupportedOperationException(
            "Unsupported operation_request: " + request.getOperationRequestCase());
    }
    return ModuleResponse.newBuilder().setProjectResponse(response).build();
  }

  private void validateConfig(ModuleConfig moduleConfig) {
    if (!moduleConfig.hasProjectRequest()) {
      throw new IllegalArgumentException("ModuleConfig does not contain a ProjectRequest.");
    }
  }
}
