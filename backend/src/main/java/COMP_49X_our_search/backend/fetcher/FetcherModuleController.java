package COMP_49X_our_search.backend.fetcher;

import COMP_49X_our_search.backend.core.ModuleController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredType;

@Service
public class FetcherModuleController implements ModuleController {

  private final DepartmentFetcher departmentFetcher;
  private final ProjectFetcher projectFetcher;

  @Autowired
  public FetcherModuleController(DepartmentFetcher departmentFetcher,
      ProjectFetcher projectFetcher) {
    this.departmentFetcher = departmentFetcher;
    this.projectFetcher = projectFetcher;
  }

  @Override
  public ModuleResponse processConfig(ModuleConfig moduleConfig) {
    validateConfig(moduleConfig);

    FetcherRequest request = moduleConfig.getFetcherRequest();
    FetcherResponse response;
    switch (request.getFetcherTypeCase()) {
      case DIRECT_FETCHER:
        response = handleDirectFetcher(request);
        break;
      case FILTERED_FETCHER:
        response = handleFilteredFetcher(request);
        break;
      // Add more cases if other fetcher types are added.
      default:
        throw new UnsupportedOperationException(
            "Unsupported FetcherType: " + request.getFetcherTypeCase());
    }

    return ModuleResponse.newBuilder().setFetcherResponse(response).build();
  }

  private void validateConfig(ModuleConfig moduleConfig) {
    if (!moduleConfig.hasFetcherRequest()) {
      throw new IllegalArgumentException(
          "ModuleConfig does not contain a FetcherRequest.");
    }
  }

  private FetcherResponse handleDirectFetcher(FetcherRequest request) {
    if (request.getDirectFetcher().getDirectType() == DirectType.DEPARTMENTS) {
      return departmentFetcher.fetch(request);
    }
    // Add more cases as we add more direct types.
    throw new UnsupportedOperationException("Unsupported DirectType: "
        + request.getDirectFetcher().getDirectType());
  }

  private FetcherResponse handleFilteredFetcher(FetcherRequest request) {
    if (request.getFilteredFetcher()
        .getFilteredType() == FilteredType.PROJECTS) {
      return projectFetcher.fetch(request);
    }
    // Add more cases as we add more filtered types.
    throw new UnsupportedOperationException("Unsupported FilteredType: "
        + request.getFilteredFetcher().getFilteredType());
  }
}
