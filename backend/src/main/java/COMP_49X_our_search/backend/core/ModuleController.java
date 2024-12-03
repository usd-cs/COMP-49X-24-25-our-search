package COMP_49X_our_search.backend.core;

import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;

public interface ModuleController {
  ModuleResponse processConfig(ModuleConfig moduleConfig);
}
