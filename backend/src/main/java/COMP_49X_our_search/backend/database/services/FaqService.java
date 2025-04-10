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

  public Faq getFaqById(int id) {
    return faqRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Faq not found with id: " + id));
  }

  public List<Faq> getAllFaqsByType(FaqType faqType) {
    return faqRepository.findAllByFaqType(faqType);
  }

  public Faq saveFaq(Faq faq) {
    return faqRepository.save(faq);
  }

  public void deleteFaqById(int id) {
    if (faqRepository.existsById(id)) {
      throw new RuntimeException(
          String.format(
              "Cannot delete umbrella topic with id '%s'. Umbrella topic not found.", id));
    }
    faqRepository.deleteById(id);
  }
}
