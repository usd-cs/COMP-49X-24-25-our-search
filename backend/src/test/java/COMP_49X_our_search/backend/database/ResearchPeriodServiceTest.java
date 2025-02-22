package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.repositories.ResearchPeriodRepository;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {ResearchPeriodService.class})
@ActiveProfiles("test")
public class ResearchPeriodServiceTest {

  @Autowired
  private ResearchPeriodService researchPeriodService;

  @MockBean
  private ResearchPeriodRepository researchPeriodRepository;

  @Test
  void testGetResearchPeriodByName_Found() {
    String periodName = "Fall";
    ResearchPeriod fallResearchPeriod = new ResearchPeriod();
    fallResearchPeriod.setName(periodName);

    Mockito.when(researchPeriodRepository.findByName(periodName))
        .thenReturn(Optional.of(fallResearchPeriod));

    Optional<ResearchPeriod> retrievedPeriod = researchPeriodService.getResearchPeriodByName(periodName);

    assertTrue(retrievedPeriod.isPresent());
    assertEquals(periodName, retrievedPeriod.get().getName());
  }

  @Test
  void testGetResearchPeriodByName_NotFound() {
    String periodName = "Winter";

    Mockito.when(researchPeriodRepository.findByName(periodName))
        .thenReturn(Optional.empty());

    Optional<ResearchPeriod> retrievedPeriod = researchPeriodService.getResearchPeriodByName(periodName);

    assertTrue(retrievedPeriod.isEmpty());
  }
}
