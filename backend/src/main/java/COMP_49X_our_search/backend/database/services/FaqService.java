package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Faq;
import COMP_49X_our_search.backend.database.enums.FaqType;
import COMP_49X_our_search.backend.database.repositories.FaqRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FaqService {

  private final FaqRepository faqRepository;

  @Autowired
  public FaqService(FaqRepository faqRepository) {
    this.faqRepository = faqRepository;
  }

  public List<Faq> getAllFaqsByType(FaqType faqType) {
    return faqRepository.findAllByFaqType(faqType);
  }
}
