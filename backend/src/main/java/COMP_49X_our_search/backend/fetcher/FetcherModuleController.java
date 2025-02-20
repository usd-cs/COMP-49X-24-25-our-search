package COMP_49X_our_search.backend.fetcher;

import COMP_49X_our_search.backend.core.ModuleController;
import java.util.EnumMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredType;

@Service
public class FetcherModuleController implements ModuleController {

  private final Map<DirectType, Fetcher> directTypeFetcherMap;
  private final Map<FilteredType, Fetcher> filteredTypeFetcherMap;
  private final DisciplineFetcher disciplineFetcher;
  private final ProjectFetcher projectFetcher;
  private final StudentFetcher studentFetcher;

  @Autowired
  public FetcherModuleController(DisciplineFetcher disciplineFetcher,
      ProjectFetcher projectFetcher, StudentFetcher studentFetcher) {
    // Initialize EnumMaps for mapping fetcher types to fetcher implementations
    this.directTypeFetcherMap = new EnumMap<>(DirectType.class);
    this.filteredTypeFetcherMap = new EnumMap<>(FilteredType.class);

    this.disciplineFetcher = disciplineFetcher;
    this.projectFetcher = projectFetcher;
    this.studentFetcher = studentFetcher;

    // Map DirectType values to the appropriate fetcher implementation
    directTypeFetcherMap.put(DirectType.DIRECT_TYPE_DISCIPLINES, disciplineFetcher);

    // Map FilteredType values to the appropriate fetcher implementations
    filteredTypeFetcherMap.put(FilteredType.FILTERED_TYPE_PROJECTS, projectFetcher);
    filteredTypeFetcherMap.put(FilteredType.FILTERED_TYPE_STUDENTS, studentFetcher);
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
    DirectType type = request.getDirectFetcher().getDirectType();
    Fetcher fetcher = directTypeFetcherMap.get(type);

    if (fetcher == null) {
      throw new UnsupportedOperationException("Unsupported DirectType: " + type);
    }
    return fetcher.fetch(request);
  }

  private FetcherResponse handleFilteredFetcher(FetcherRequest request) {
    FilteredType type = request.getFilteredFetcher().getFilteredType();
    Fetcher fetcher = filteredTypeFetcherMap.get(type);

    if (fetcher == null) {
      throw new UnsupportedOperationException("Unsupported FilteredType: " + type);
    }
    return fetcher.fetch(request);
  }
}
