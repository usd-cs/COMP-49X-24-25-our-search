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

  @Autowired private FaqService faqService;

  @MockBean private FaqRepository faqRepository;

  @Test
  void testGetAllStudentFaqs() {
    Faq faq1 =
        new Faq(
            1, "What is OUR?", "OUR stands for Office of Undergraduate Research.", FaqType.STUDENT);
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

  @Test
  void testSaveEmailNotification() {
    Faq faq = new Faq(1, "test question", "test answer", FaqType.STUDENT);

    when(faqRepository.save(faq)).thenReturn(faq);

    Faq savedFaq = faqService.saveFaq(faq);

    assertNotNull(savedFaq);
    assertEquals(1, savedFaq.getId());
    assertEquals("test question", savedFaq.getQuestion());
    assertEquals("test answer", savedFaq.getAnswer());
    assertEquals(FaqType.STUDENT, savedFaq.getFaqType());
  }

  @Test
  void testGetFaqById_success() {
    Faq faq = new Faq(1, "Sample question", "Sample answer", FaqType.STUDENT);

    when(faqRepository.findById(1)).thenReturn(java.util.Optional.of(faq));

    Faq result = faqService.getFaqById(1);

    assertNotNull(result);
    assertEquals(1, result.getId());
    assertEquals("Sample question", result.getQuestion());
    assertEquals("Sample answer", result.getAnswer());
    assertEquals(FaqType.STUDENT, result.getFaqType());

    verify(faqRepository, times(1)).findById(1);
  }

  @Test
  void testGetFaqById_notFound() {
    when(faqRepository.findById(999)).thenReturn(java.util.Optional.empty());

    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
      faqService.getFaqById(999);
    });

    assertEquals("Faq not found with id: 999", exception.getMessage());

    verify(faqRepository, times(1)).findById(999);
  }
}
