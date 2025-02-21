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
