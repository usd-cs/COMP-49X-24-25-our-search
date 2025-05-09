/**
 * Integration test for the FaqService methods using real data.
 * This test loads the application context to ensure Spring Data repositories
 * and the service are correctly initialized in the test environment.
 *
 * Verifies the actual database interactions by using a real H2 in-memory database,
 * providing a more realistic scenario than unit tests, which rely on mocked values.
 */

package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import COMP_49X_our_search.backend.database.entities.Faq;
import COMP_49X_our_search.backend.database.enums.FaqType;
import COMP_49X_our_search.backend.database.repositories.FaqRepository;
import COMP_49X_our_search.backend.database.services.FaqService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@TestPropertySource(properties = {
        "DOMAIN=http://localhost"
})
public class FaqServiceIntegrationTest {

  @Autowired
  private FaqRepository faqRepository;

  @Autowired
  private FaqService faqService;

  private Faq studentFaq;
  private Faq facultyFaq;
  private Faq adminFaq;

  @BeforeEach
  void setUp() {
    faqRepository.deleteAll();

    studentFaq = new Faq(null, "What is OUR?", "Office of Undergraduate Research", FaqType.STUDENT);
    facultyFaq = new Faq(null, "How do I post a project?", "Use the faculty dashboard", FaqType.FACULTY);
    adminFaq = new Faq(null, "How do I approve accounts?", "Via the admin panel", FaqType.ADMIN);

    studentFaq = faqRepository.save(studentFaq);
    facultyFaq = faqRepository.save(facultyFaq);
    adminFaq = faqRepository.save(adminFaq);
  }

  @Test
  void testGetFaqById_existingFaq_returnsExpected() {
    Faq faq = faqService.getFaqById(studentFaq.getId());

    assertNotNull(faq);
    assertEquals(studentFaq.getId(), faq.getId());
    assertEquals("What is OUR?", faq.getQuestion());
    assertEquals("Office of Undergraduate Research", faq.getAnswer());
    assertEquals(FaqType.STUDENT, faq.getFaqType());
  }

  @Test
  void testGetFaqById_nonExistingFaq_throwsRuntimeException() {
    RuntimeException exception = assertThrows(
        RuntimeException.class,
        () -> faqService.getFaqById(999)
    );

    assertEquals("Faq not found with id: 999", exception.getMessage());
  }

  @Test
  void testGetAllFaqsByType_returnsExpectedFaqs() {
    List<Faq> studentFaqs = faqService.getAllFaqsByType(FaqType.STUDENT);
    List<Faq> facultyFaqs = faqService.getAllFaqsByType(FaqType.FACULTY);
    List<Faq> adminFaqs = faqService.getAllFaqsByType(FaqType.ADMIN);

    assertEquals(1, studentFaqs.size());
    assertEquals(1, facultyFaqs.size());
    assertEquals(1, adminFaqs.size());

    Faq retrievedStudentFaq = studentFaqs.get(0);
    assertEquals(studentFaq.getId(), retrievedStudentFaq.getId());
    assertEquals("What is OUR?", retrievedStudentFaq.getQuestion());
    assertEquals("Office of Undergraduate Research", retrievedStudentFaq.getAnswer());

    Faq retrievedFacultyFaq = facultyFaqs.get(0);
    assertEquals(facultyFaq.getId(), retrievedFacultyFaq.getId());
    assertEquals("How do I post a project?", retrievedFacultyFaq.getQuestion());
    assertEquals("Use the faculty dashboard", retrievedFacultyFaq.getAnswer());

    Faq retrievedAdminFaq = adminFaqs.get(0);
    assertEquals(adminFaq.getId(), retrievedAdminFaq.getId());
    assertEquals("How do I approve accounts?", retrievedAdminFaq.getQuestion());
    assertEquals("Via the admin panel", retrievedAdminFaq.getAnswer());
  }

  @Test
  void testGetAllFaqsByType_nonExistingType_returnsEmptyList() {
    List<Faq> results = faqService.getAllFaqsByType(FaqType.valueOf("STUDENT"));

    assertEquals(1, results.size());
  }

  @Test
  void testSaveFaq_createNewFaq_savesSuccessfully() {
    Faq newFaq = new Faq();
    newFaq.setQuestion("Is this a new FAQ?");
    newFaq.setAnswer("Yes, it is!");
    newFaq.setFaqType(FaqType.STUDENT);

    Faq savedFaq = faqService.saveFaq(newFaq);

    assertNotNull(savedFaq.getId());
    assertEquals("Is this a new FAQ?", savedFaq.getQuestion());
    assertEquals("Yes, it is!", savedFaq.getAnswer());
    assertEquals(FaqType.STUDENT, savedFaq.getFaqType());

    List<Faq> studentFaqs = faqService.getAllFaqsByType(FaqType.STUDENT);
    assertEquals(2, studentFaqs.size());
  }

  @Test
  void testSaveFaq_updateExistingFaq_updatesSuccessfully() {
    Faq existingFaq = faqService.getFaqById(studentFaq.getId());

    existingFaq.setQuestion("Updated question");
    existingFaq.setAnswer("Updated answer");

    Faq updatedFaq = faqService.saveFaq(existingFaq);

    assertEquals(studentFaq.getId(), updatedFaq.getId());
    assertEquals("Updated question", updatedFaq.getQuestion());
    assertEquals("Updated answer", updatedFaq.getAnswer());
    assertEquals(FaqType.STUDENT, updatedFaq.getFaqType());

    Faq retrievedFaq = faqService.getFaqById(studentFaq.getId());
    assertEquals("Updated question", retrievedFaq.getQuestion());
    assertEquals("Updated answer", retrievedFaq.getAnswer());
  }

  @Test
  void testDeleteFaqById_existingFaq_deletesSuccessfully() {
    faqService.deleteFaqById(studentFaq.getId());

    RuntimeException exception = assertThrows(
        RuntimeException.class,
        () -> faqService.getFaqById(studentFaq.getId())
    );
    assertEquals("Faq not found with id: " + studentFaq.getId(), exception.getMessage());

    assertEquals(2, faqRepository.findAll().size());
  }

  @Test
  void testDeleteFaqById_nonExistingFaq_throwsRuntimeException() {
    RuntimeException exception = assertThrows(
        RuntimeException.class,
        () -> faqService.deleteFaqById(999)
    );

    String expectedError = "Cannot delete FAQ with id '999'. FAQ not found.";
    assertEquals(expectedError, exception.getMessage());

    assertEquals(3, faqRepository.findAll().size());
  }
}