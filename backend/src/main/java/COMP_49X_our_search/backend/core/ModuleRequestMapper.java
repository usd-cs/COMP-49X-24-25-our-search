package COMP_49X_our_search.backend.core;


import proto.core.Core.ModuleConfig;
import proto.fetcher.FetcherModule.FetcherRequest;

public class ModuleRequestMapper {

  public static Class<?> getRequestClass(ModuleConfig moduleConfig) {
    switch (moduleConfig.getModuleRequestCase()) {
      case FETCHER_REQUEST:
        return FetcherRequest.class;
      // Add more cases here as more modules are added.
      default:
        throw new IllegalArgumentException(
            "Unsupported request type: " + moduleConfig.getModuleRequestCase());
    }
  }
}
