/**
 * Controller class for managing fetcher requests.
 * This class maps fetcher types to their corresponding fetcher implementations
 * and processes requests accordingly.
 *
 * It supports:
 * - **Direct fetching (e.g. fetching disciplines)
 * - **Filtered fetching (e.g., fetching students or projects)
 *
 * Direct fetchers retrieve all records of a specific entity from the database
 * without applying any filters. For example, fetching all disciplines. These
 * fetchers do not support filtering.
 *
 * Filtered fetchers retrieve records with the possibility of applying filters
 * (not implemented yet). For example, fetching all students in a specific major
 * or projects available during a particular research period.
 *
 * Implements the ModuleController interface.
 *
 * @author Augusto Escudero
 */
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
  private final FacultyFetcher facultyFetcher;

  @Autowired
  public FetcherModuleController(DisciplineFetcher disciplineFetcher,
      ProjectFetcher projectFetcher, StudentFetcher studentFetcher, FacultyFetcher facultyFetcher) {
    // Initialize EnumMaps for mapping fetcher types to fetcher implementations
    this.directTypeFetcherMap = new EnumMap<>(DirectType.class);
    this.filteredTypeFetcherMap = new EnumMap<>(FilteredType.class);

    this.disciplineFetcher = disciplineFetcher;
    this.projectFetcher = projectFetcher;
    this.studentFetcher = studentFetcher;
    this.facultyFetcher = facultyFetcher;

    // Map DirectType values to the appropriate fetcher implementation
    directTypeFetcherMap.put(DirectType.DIRECT_TYPE_DISCIPLINES, disciplineFetcher);

    // Map FilteredType values to the appropriate fetcher implementations
    filteredTypeFetcherMap.put(FilteredType.FILTERED_TYPE_PROJECTS, projectFetcher);
    filteredTypeFetcherMap.put(FilteredType.FILTERED_TYPE_STUDENTS, studentFetcher);
    filteredTypeFetcherMap.put(FilteredType.FILTERED_TYPE_FACULTY, facultyFetcher);
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
