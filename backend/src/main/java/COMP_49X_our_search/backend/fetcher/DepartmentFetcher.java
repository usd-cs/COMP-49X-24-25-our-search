package COMP_49X_our_search.backend.fetcher;

import static COMP_49X_our_search.backend.util.ProtoConverter.toDepartmentProto;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.util.ProtoConverter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.DepartmentProto;
import proto.fetcher.DataTypes.DepartmentCollection;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;

@Service
public class DepartmentFetcher implements Fetcher {

  private final DepartmentService departmentService;

  @Autowired
  public DepartmentFetcher(DepartmentService departmentService) {
    this.departmentService = departmentService;
  }

  @Override
  public FetcherResponse fetch(FetcherRequest request) {
    validateRequest(request);
    List<Department> departments = departmentService.getAllDepartments();
    return FetcherResponse.newBuilder()
        .setDepartmentCollection(
            DepartmentCollection.newBuilder().addAllDepartments(departments
                .stream().map(ProtoConverter::toDepartmentProto).toList()))
        .build();
  }

  private void validateRequest(FetcherRequest request) {
    // Check if request contains a fetcher_type
    if (request.getFetcherTypeCase() == FetcherTypeCase.FETCHERTYPE_NOT_SET) {
      throw new IllegalArgumentException(String.format(
          "Expected fetcher_type to be set, but no fetcher type was provided. Valid types: %s",
          "direct_fetcher"));
    }
    if (request
        .getFetcherTypeCase() != FetcherRequest.FetcherTypeCase.DIRECT_FETCHER) {
      throw new IllegalArgumentException(
          String.format("Expected fetcher_type 'direct_fetcher', but got '%s'",
              request.getFetcherTypeCase().toString().toLowerCase()));
    }
    if (request.getDirectFetcher().getDirectType() != DirectType.DIRECT_TYPE_DEPARTMENTS) {
      throw new IllegalArgumentException(String.format(
          "Expected DirectType 'DEPARTMENTS', but got '%s'. This fetcher only supports DEPARTMENTS type",
          request.getDirectFetcher().getDirectType()));
    }
  }
}
