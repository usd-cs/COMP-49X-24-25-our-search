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

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.repositories.ResearchPeriodRepository;
import org.springframework.transaction.annotation.Transactional;

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

  public List<ResearchPeriod> getAllResearchPeriods() {
    return researchPeriodRepository.findAll();
  }

  public ResearchPeriod getResearchPeriodById(int id) {
    return researchPeriodRepository
      .findById(id)
      .orElseThrow(() -> new RuntimeException("Research period not found with id: " + id));
  }

  public ResearchPeriod saveResearchPeriod(ResearchPeriod researchPeriod) {
    return researchPeriodRepository.save(researchPeriod);
  }

  @Transactional
  public void deleteResearchPeriodById(int id) {
    ResearchPeriod researchPeriod = researchPeriodRepository.findById(id)
        .orElseThrow(() -> new RuntimeException(
            String.format("Cannot delete research period with id '%s'. Research period not found.", id)
        ));

    if (!researchPeriod.getStudents().isEmpty()) {
      throw new IllegalStateException("Research Period has students associated with it, cannot delete");
    }

    if (!researchPeriod.getProjects().isEmpty()) {
      throw new IllegalStateException("Research Period has projects associated with it, cannot delete");
    }

    researchPeriodRepository.delete(researchPeriod);
  }


  // TODO only get the ones that apply to this academic year or delete them every year and add new ones every year...?
}
