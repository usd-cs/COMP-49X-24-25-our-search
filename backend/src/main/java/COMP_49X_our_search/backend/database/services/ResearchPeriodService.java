/**
 * Service class for managing ResearchPeriod entities. This class provides
 * business logic for retrieving research period data from the database through
 * the ResearchPeriodRepository.
 *
 * This service is annotated with @Service to indicate that it's managed by
 * Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.repositories.ResearchPeriodRepository;
import COMP_49X_our_search.backend.database.repositories.ResearchPeriodRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResearchPeriodService {

  private final ResearchPeriodRepository researchPeriodRepository;

  @Autowired
  public ResearchPeriodService(ResearchPeriodRepository ResearchPeriodRepository) {
    this.researchPeriodRepository = ResearchPeriodRepository;
  }

  public Optional<ResearchPeriod> getResearchPeriodByName(String name) {
    return researchPeriodRepository.findByName(name);
  }
}
