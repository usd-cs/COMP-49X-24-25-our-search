package COMP_49X_our_search.backend.gateway;

import COMP_49X_our_search.backend.gateway.dto.DepartmentDTO;
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

@RestController
@RequestMapping("/gateway")
@CrossOrigin(origins = "http://localhost:3000") // TODO: change once the app is hosted.
public class GatewayController {
  private final ModuleInvoker moduleInvoker;

  @Autowired
  public GatewayController(ModuleInvoker moduleInvoker) {
    this.moduleInvoker = moduleInvoker;
  }

  @GetMapping("/fetch/departments")
  public ResponseEntity<List<DepartmentDTO>> fetchDepartments() {
    ModuleConfig moduleConfig =
        ModuleConfig.newBuilder()
            .setFetcherRequest(
                FetcherRequest.newBuilder()
                    .setDirectFetcher(
                        DirectFetcher.newBuilder().setDirectType(DirectType.DEPARTMENTS)))
            .build();
    ModuleResponse moduleResponse = moduleInvoker.processConfig(moduleConfig);
    return ResponseEntity.ok(
        moduleResponse.getFetcherResponse().getDepartmentCollection().getDepartmentsList().stream()
            .map(departmentProto -> new DepartmentDTO(departmentProto.getDepartmentName()))
            .toList());
  }
}
