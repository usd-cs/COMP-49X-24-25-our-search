package COMP_49X_our_search.backend.fetcher;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;

public class DisciplineFetcherTest {
  private DisciplineFetcher disciplineFetcher;
  private DisciplineService disciplineService;

  @BeforeEach
  void setUp() {
    disciplineService = mock(DisciplineService.class);
    disciplineFetcher = new DisciplineFetcher(disciplineService);
  }

  @Test
  public void testFetch_validRequest_returnsExpectedResponse() {
    Discipline engineering = new Discipline("Engineering");
    engineering.setId(0);
    Discipline lifeSciences = new Discipline("Life Sciences");
    lifeSciences.setId(1);
    List<Discipline> disciplines = Arrays.asList(engineering, lifeSciences);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    FetcherRequest request = FetcherRequest.newBuilder()
        .setDirectFetcher(
            DirectFetcher.newBuilder().setDirectType(DirectType.DIRECT_TYPE_DISCIPLINES))
        .build();
    FetcherResponse response = disciplineFetcher.fetch(request);

    assertNotNull(response);
    assertEquals(2, response.getDisciplineCollection().getDisciplinesCount());
    assertEquals("Engineering", response.getDisciplineCollection()
        .getDisciplines(0).getDisciplineName());
    assertEquals("Life Sciences", response.getDisciplineCollection()
        .getDisciplines(1).getDisciplineName());
  }

  @Test
  public void testFetch_missingFetcherType_throwsException() {
    FetcherRequest invalidRequest = FetcherRequest.getDefaultInstance();

    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
      disciplineFetcher.fetch(invalidRequest);
    });

    assertTrue(exception.getMessage().contains(
        "Expected fetcher_type to be set, but no fetcher type was provided"));
  }
}
