package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearchPeriodRepository
    extends JpaRepository<ResearchPeriod, Integer> {
  Optional<ResearchPeriod> findByName(String name);
}
