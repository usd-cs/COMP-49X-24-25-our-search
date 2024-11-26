package COMP_49X_our_search.backend.gateway;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.fetcher.FetcherModuleController;
import org.junit.jupiter.api.BeforeEach;

public class ModuleInvokerTest {

  private ModuleInvoker moduleInvoker;
  private FetcherModuleController fetcherModuleController;

  @BeforeEach
  void setUp() {
    fetcherModuleController = mock(FetcherModuleController.class);
    moduleInvoker = new ModuleInvoker(fetcherModuleController);
  }
}
