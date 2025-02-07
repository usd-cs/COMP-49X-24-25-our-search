package COMP_49X_our_search.backend.gateway;

import COMP_49X_our_search.backend.core.ModuleController;
import COMP_49X_our_search.backend.fetcher.FetcherModuleController;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleConfig.ModuleRequestCase;
import proto.core.Core.ModuleResponse;
import proto.fetcher.FetcherModule.FetcherRequest;

@Component
public class ModuleInvoker implements ModuleController {
  private final Map<Class<?>, ModuleController> moduleControllerMap;

  @Autowired
  public ModuleInvoker(FetcherModuleController fetcherModuleController) {
    this.moduleControllerMap = new HashMap<>();

    // Bind module controllers
    this.moduleControllerMap.put(FetcherRequest.class, fetcherModuleController);
  }

  @Override
  public ModuleResponse processConfig(ModuleConfig moduleConfig) {
    validateConfig(moduleConfig);
    return moduleControllerMap.get(getRequestClass(moduleConfig))
        .processConfig(moduleConfig);
  }

  private Class<?> getRequestClass(ModuleConfig moduleConfig) {
    switch (moduleConfig.getModuleRequestCase()) {
      case FETCHER_REQUEST:
        return FetcherRequest.class;
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
    if (moduleConfig
        .getModuleRequestCase() == ModuleRequestCase.MODULEREQUEST_NOT_SET) {
      throw new IllegalArgumentException(
          "Request type not set in ModuleConfig");
    }
    Class<?> requestClass = getRequestClass(moduleConfig);
    if (!moduleControllerMap.containsKey(requestClass)) {
      throw new IllegalArgumentException(String.format(
          "No controller registered for request type %s in ModuleConfig",
          requestClass.getSimpleName()));
    }
  }
}
