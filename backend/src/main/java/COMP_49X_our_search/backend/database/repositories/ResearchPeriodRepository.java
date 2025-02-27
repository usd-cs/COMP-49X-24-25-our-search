/**
 * Repository interface for managing ResearchPeriod entities. This interface
 * provides methods for performing CRUD operations on the "research_periods"
 * table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearchPeriodRepository
    extends JpaRepository<ResearchPeriod, Integer> {
  Optional<ResearchPeriod> findByName(String name);
}
