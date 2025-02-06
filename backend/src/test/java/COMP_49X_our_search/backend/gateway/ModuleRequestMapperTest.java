package COMP_49X_our_search.backend.gateway;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.gateway.ModuleRequestMapper;
import org.junit.jupiter.api.Test;
import proto.core.Core.ModuleConfig;
import proto.fetcher.FetcherModule.FetcherRequest;

public class ModuleRequestMapperTest {

  @Test
  public void testGetRequestClass_supportedCase_returnsExpectedResult() {
    ModuleConfig moduleConfig = ModuleConfig.newBuilder()
        .setFetcherRequest(FetcherRequest.getDefaultInstance()).build();
    Class<?> result = ModuleRequestMapper.getRequestClass(moduleConfig);
    assertEquals(FetcherRequest.class, result, "Expected FetcherRequest class");
  }

  @Test
  public void testGetRequestClass_unsupportedCase_returnsExpectedResult() {
    ModuleConfig moduleConfig = ModuleConfig.getDefaultInstance();
    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
      ModuleRequestMapper.getRequestClass(moduleConfig);
    });
    assertTrue(exception.getMessage().contains("Unsupported request type"));
  }
}
