package COMP_49X_our_search.backend.gateway;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.fetcher.FetcherModuleController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;
import proto.data.Entities.DisciplineProto;
import proto.fetcher.DataTypes.DisciplineCollection;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;

public class ModuleInvokerTest {

  private ModuleInvoker moduleInvoker;
  private FetcherModuleController fetcherModuleController;

  @BeforeEach
  void setUp() {
    fetcherModuleController = mock(FetcherModuleController.class);
    moduleInvoker = new ModuleInvoker(fetcherModuleController);
  }

  @Test
  public void testProcessConfig_validFetcherRequest_returnsExpectedResponse() {
    FetcherRequest mockRequest = FetcherRequest.newBuilder()
        .setDirectFetcher(
            DirectFetcher.newBuilder().setDirectType(DirectType.DIRECT_TYPE_DISCIPLINES))
        .build();
    FetcherResponse mockResponse = FetcherResponse.newBuilder()
        .setDisciplineCollection(
            DisciplineCollection.newBuilder().addDisciplines(
                DisciplineProto.newBuilder().setDisciplineName("Engineering")))
        .build();
    when(fetcherModuleController.processConfig(any(ModuleConfig.class)))
        .thenReturn(ModuleResponse.newBuilder().setFetcherResponse(mockResponse)
            .build());

    ModuleConfig validConfig =
        ModuleConfig.newBuilder().setFetcherRequest(mockRequest).build();
    ModuleResponse response = moduleInvoker.processConfig(validConfig);

    assertEquals(mockResponse, response.getFetcherResponse());
  }

  @Test
  public void testProcessConfig_nullModuleConfig_throwsException() {
    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
      moduleInvoker.processConfig(null);
    });

    assertEquals("ModuleConfig cannot be null.", exception.getMessage());
  }

  @Test
  public void testProcessConfig_missingRequestCase_throwsException() {
    ModuleConfig invalidConfig = ModuleConfig.getDefaultInstance();

    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
      moduleInvoker.processConfig(invalidConfig);
    });

    assertEquals("Request type not set in ModuleConfig",
        exception.getMessage());
  }
}
