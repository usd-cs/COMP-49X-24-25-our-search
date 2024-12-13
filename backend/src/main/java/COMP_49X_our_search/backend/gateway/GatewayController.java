package COMP_49X_our_search.backend.gateway;

import static COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter.protoDepartmentWithMajorsToDto;

import COMP_49X_our_search.backend.gateway.dto.DepartmentDTO;
import COMP_49X_our_search.backend.gateway.dto.ProjectHierarchyDTO;
import COMP_49X_our_search.backend.gateway.util.ProjectHierarchyConverter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000") // TODO: change once the app is
                                                // hosted.
public class GatewayController {
  private final ModuleInvoker moduleInvoker;

  @Autowired
  public GatewayController(ModuleInvoker moduleInvoker) {
    this.moduleInvoker = moduleInvoker;
  }

  @GetMapping("/projects")
  public ResponseEntity<List<DepartmentDTO>> getProjects() {
    ModuleConfig moduleConfig = ModuleConfig.newBuilder()
        .setFetcherRequest(
            FetcherRequest.newBuilder().setFilteredFetcher(FilteredFetcher
                .newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS)))
        .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    return ResponseEntity.ok(moduleResponse.getFetcherResponse()
        .getProjectHierarchy().getDepartmentsList().stream()
        .map(ProjectHierarchyConverter::protoDepartmentWithMajorsToDto)
        .toList());
  }
}
