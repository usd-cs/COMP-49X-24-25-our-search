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

@Service
public class FetcherModuleController implements ModuleController {

  private final DepartmentFetcher departmentFetcher;

  @Autowired
  public FetcherModuleController(DepartmentFetcher departmentFetcher) {
    this.departmentFetcher = departmentFetcher;
  }

  @Override
  public ModuleResponse processConfig(ModuleConfig moduleConfig) {
    validateConfig(moduleConfig);

    FetcherRequest request = moduleConfig.getFetcherRequest();
    FetcherResponse response;
    if (request.getFetcherTypeCase() == FetcherTypeCase.DIRECT_FETCHER) {
      response = handleDirectFetcher(request);
    }
    // Add more cases as we add more fetcher types.
    else {
      throw new UnsupportedOperationException(
          "Unsupported FetcherType: " + request.getFetcherTypeCase());
    }

    return ModuleResponse.newBuilder().setFetcherResponse(response).build();
  }

  private void validateConfig(ModuleConfig moduleConfig) {
    if (!moduleConfig.hasFetcherRequest()) {
      throw new IllegalArgumentException("ModuleConfig does not contain a FetcherRequest.");
    }
  }

  private FetcherResponse handleDirectFetcher(FetcherRequest request) {
    if (request.getDirectFetcher().getDirectType() == DirectType.DEPARTMENTS) {
      return departmentFetcher.fetch(request);
    }
    // Add more cases as we add more direct types.
    throw new UnsupportedOperationException(
        "Unsupported DirectType: " + request.getDirectFetcher().getDirectType());
  }
}
