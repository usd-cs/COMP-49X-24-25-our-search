/**
 * Centralized invoker for processing module requests. This component
 * dynamically routes incoming requests to the appropriate backend module
 * controllers, which ensures modularity and scalability.
 *
 * Responsibilities:
 * - Maps module request types to their corresponding controllers.
 * - Delegates processing to the appropriate module (e.g. Fetcher, Profile)
 *
 * Despite not being a module controller itself, it implements the
 * 'ModuleController' interface because it receives and returns the same data as
 * a module controller.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.gateway;

import COMP_49X_our_search.backend.core.ModuleController;
import COMP_49X_our_search.backend.fetcher.FetcherModuleController;
import COMP_49X_our_search.backend.profile.ProfileModuleController;
import COMP_49X_our_search.backend.project.ProjectModuleController;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleConfig.ModuleRequestCase;
import proto.core.Core.ModuleResponse;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.profile.ProfileModule.ProfileRequest;
import proto.project.ProjectModule.ProjectRequest;

@Component
public class ModuleInvoker implements ModuleController {
  private final Map<Class<?>, ModuleController> moduleControllerMap;

  @Autowired
  public ModuleInvoker(
      FetcherModuleController fetcherModuleController,
      ProfileModuleController profileModuleController,
      ProjectModuleController projectModuleController
      ) {
    this.moduleControllerMap = new HashMap<>();

    // Bind module controllers
    this.moduleControllerMap.put(FetcherRequest.class, fetcherModuleController);
    this.moduleControllerMap.put(ProfileRequest.class, profileModuleController);
    this.moduleControllerMap.put(ProjectRequest.class, projectModuleController);
  }

  @Override
  public ModuleResponse processConfig(ModuleConfig moduleConfig) {
    validateConfig(moduleConfig);
    return moduleControllerMap.get(getRequestClass(moduleConfig)).processConfig(moduleConfig);
  }

  private Class<?> getRequestClass(ModuleConfig moduleConfig) {
    switch (moduleConfig.getModuleRequestCase()) {
      case FETCHER_REQUEST:
        return FetcherRequest.class;
      case PROFILE_REQUEST:
        return ProfileRequest.class;
      case PROJECT_REQUEST:
        return ProjectRequest.class;
      // Add more cases here as more modules are added.
      default:
        throw new IllegalArgumentException(
            "Unsupported request type: " + moduleConfig.getModuleRequestCase());
    }
  }

  private void validateConfig(ModuleConfig moduleConfig) {
    if (moduleConfig == null) {
      throw new IllegalArgumentException("ModuleConfig cannot be null.");
    }
    if (moduleConfig.getModuleRequestCase() == ModuleRequestCase.MODULEREQUEST_NOT_SET) {
      throw new IllegalArgumentException("Request type not set in ModuleConfig");
    }
    Class<?> requestClass = getRequestClass(moduleConfig);
    if (!moduleControllerMap.containsKey(requestClass)) {
      throw new IllegalArgumentException(
          String.format(
              "No controller registered for request type %s in ModuleConfig",
              requestClass.getSimpleName()));
    }
  }
}
