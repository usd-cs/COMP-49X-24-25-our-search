package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Faq;
import COMP_49X_our_search.backend.database.enums.FaqType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqRepository extends JpaRepository<Faq, Integer> {
  List<Faq> findAllByFaqType(FaqType faqType);
}
