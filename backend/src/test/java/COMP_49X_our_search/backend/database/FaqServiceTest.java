package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import COMP_49X_our_search.backend.database.entities.Faq;
import COMP_49X_our_search.backend.database.enums.FaqType;
import COMP_49X_our_search.backend.database.repositories.FaqRepository;
import COMP_49X_our_search.backend.database.services.FaqService;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {FaqService.class})
@ActiveProfiles("test")
public class FaqServiceTest {

  @Autowired
  private FaqService faqService;

  @MockBean
  private FaqRepository faqRepository;

  @Test
  void testGetAllStudentFaqs() {
    Faq faq1 = new Faq(1, "What is OUR?", "OUR stands for Office of Undergraduate Research.", FaqType.STUDENT);
    Faq faq2 = new Faq(2, "How do I apply?", "You can apply via the portal.", FaqType.STUDENT);

    List<Faq> expectedFaqs = Arrays.asList(faq1, faq2);

    when(faqRepository.findAllByFaqType(FaqType.STUDENT)).thenReturn(expectedFaqs);

    List<Faq> result = faqService.getAllFaqsByType(FaqType.STUDENT);

    assertNotNull(result);
    assertEquals(2, result.size());
    assertTrue(result.contains(faq1));
    assertTrue(result.contains(faq2));

    verify(faqRepository, times(1)).findAllByFaqType(FaqType.STUDENT);
  }

  @Test
  void testGetAllFacultyFaqs() {
    Faq faq1 = new Faq(3, "How to post a project?", "Use the faculty dashboard.", FaqType.FACULTY);

    List<Faq> expectedFaqs = List.of(faq1);

    when(faqRepository.findAllByFaqType(FaqType.FACULTY)).thenReturn(expectedFaqs);

    List<Faq> result = faqService.getAllFaqsByType(FaqType.FACULTY);

    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals(faq1, result.getFirst());

    verify(faqRepository, times(1)).findAllByFaqType(FaqType.FACULTY);
  }
}
