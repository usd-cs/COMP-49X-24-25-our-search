/**
 * Controller class for managing project-related operations. This class maps project operation types
 * to their corresponding project creation, editing, or deletion implementations and processes
 * requests accordingly.
 *
 * <p>Supported operations: - **Project Creation** (currently supported) - **Project Editing**
 * (planned) - **Project Deletion** (planed)
 *
 * <p>Implements the ModuleController interface.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.project;

import COMP_49X_our_search.backend.core.ModuleController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.project.ProjectModule.ProjectRequest;
import proto.project.ProjectModule.ProjectResponse;

@Service
public class ProjectModuleController implements ModuleController {

  private final ProjectCreator projectCreator;
  private final ProjectDeleter projectDeleter;
  private final ProjectEditor projectEditor;

  @Autowired
  public ProjectModuleController(
      ProjectCreator projectCreator, ProjectDeleter projectDeleter, ProjectEditor projectEditor) {
    this.projectCreator = projectCreator;
    this.projectDeleter = projectDeleter;
    this.projectEditor = projectEditor;
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
      case DELETE_PROJECT_REQUEST:
        response =
            ProjectResponse.newBuilder()
                .setDeleteProjectResponse(
                    // See above comment
                    projectDeleter.deleteProject(request.getDeleteProjectRequest()))
                .build();
        break;
      case EDIT_PROJECT_REQUEST:
        response =
            ProjectResponse.newBuilder()
                .setEditProjectResponse(
                    // See above comment
                    projectEditor.editProject(request.getEditProjectRequest()))
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
