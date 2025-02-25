/**
 * Direct fetcher for retrieving discipline data. This class interacs with the
 * DisciplineService to fetch all disciplines and converts them into their
 * protobuf representation.
 *
 * It ensures that requests are valid and only processes requests of type
 * DIRECT_TYPE_DISCIPLINES
 *
 * This class implements the Fetcher interface.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.fetcher;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.util.ProtoConverter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.fetcher.DataTypes.DisciplineCollection;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;

@Service
public class DisciplineFetcher implements Fetcher {

  private final DisciplineService disciplineService;

  @Autowired
  public DisciplineFetcher(DisciplineService disciplineService) {
    this.disciplineService = disciplineService;
  }

  @Override
  public FetcherResponse fetch(FetcherRequest request) {
    validateRequest(request);
    List<Discipline> disciplines = disciplineService.getAllDisciplines();
    return FetcherResponse.newBuilder()
        .setDisciplineCollection(
            DisciplineCollection.newBuilder().addAllDisciplines(disciplines
                .stream().map(ProtoConverter::toDisciplineProto).toList()))
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
    if (request.getDirectFetcher().getDirectType() != DirectType.DIRECT_TYPE_DISCIPLINES) {
      throw new IllegalArgumentException(String.format(
          "Expected DirectType 'DisciplineS', but got '%s'. This fetcher only supports DisciplineS type",
          request.getDirectFetcher().getDirectType()));
    }
  }
}
