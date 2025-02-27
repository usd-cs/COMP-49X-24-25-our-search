/**
 * Defines method contract for processing module configurations.
 *
 * This interface servers as an entry point for handling different types of
 * complex requests that are module-specific, such as fetching data, as well as
 * managing profiles. Implementations of this interface should process the
 * given {@link proto.core.Core.ModuleConfig} and return an appropriate
 * {@link proto.core.Core.ModuleResponse}
 *
 * @author Augusto Escudero
 */

package COMP_49X_our_search.backend.core;

import proto.core.Core.ModuleConfig;
import proto.core.Core.ModuleResponse;

public interface ModuleController {
  ModuleResponse processConfig(ModuleConfig moduleConfig);
}
