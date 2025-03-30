package COMP_49X_our_search.backend.database;

import COMP_49X_our_search.backend.database.entities.Student;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.repositories.ResearchPeriodRepository;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;

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

  @Test
  void testGetAllResearchPeriods() {
    ResearchPeriod fallResearchPeriod = new ResearchPeriod("Fall", null, null);
    ResearchPeriod winterResearchPeriod = new ResearchPeriod("Winter", null, null);

    Mockito.when(researchPeriodRepository.findAll())
            .thenReturn(List.of(fallResearchPeriod, winterResearchPeriod));

    List<ResearchPeriod> retrievedPeriods = researchPeriodService.getAllResearchPeriods();

    assertEquals(2, retrievedPeriods.size());
    assertTrue(retrievedPeriods.containsAll(List.of(fallResearchPeriod, winterResearchPeriod)));
  }

  @Test
  void testGetResearchPeriodById_exists_returnsExpectedResponse() {
    // Arrange
    ResearchPeriod rp = new ResearchPeriod();
    rp.setId(1);
    rp.setName("Fall 2024");

    when(researchPeriodRepository.findById(1)).thenReturn(Optional.of(rp));

    // Act
    ResearchPeriod result = researchPeriodService.getResearchPeriodById(1);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getId());
    assertEquals("Fall 2024", result.getName());
  }

  @Test
  void testGetResearchPeriodById_notExists_throwsException() {
    // Arrange
    when(researchPeriodRepository.findById(1)).thenReturn(Optional.empty());

    // Act & Assert
    Exception exception = assertThrows(RuntimeException.class, () -> {
      researchPeriodService.getResearchPeriodById(1);
    });
    String expectedMessage = "Research period not found with id: 1";
    assertTrue(exception.getMessage().contains(expectedMessage));
  }

  @Test
  public void deleteResearchPeriodById_successfulDeletion() {
    ResearchPeriod researchPeriod = new ResearchPeriod();
    researchPeriod.setStudents(Set.of());
    researchPeriod.setProjects(Set.of());

    when(researchPeriodRepository.findById(1)).thenReturn(Optional.of(researchPeriod));

    assertDoesNotThrow(() -> researchPeriodService.deleteResearchPeriodById(1));
    verify(researchPeriodRepository, times(1)).delete(researchPeriod);
  }

  @Test
  public void deleteResearchPeriodById_researchPeriodNotFound_throwsRuntimeException() {
    when(researchPeriodRepository.findById(1)).thenReturn(Optional.empty());

    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> researchPeriodService.deleteResearchPeriodById(1));

    assertEquals("Cannot delete research period with id '1'. Research period not found.",
        exception.getMessage());
    verify(researchPeriodRepository, never()).delete(any());
  }

  @Test
  public void deleteResearchPeriodById_researchPeriodHasStudents_throwsIllegalStateException() {
    ResearchPeriod researchPeriod = new ResearchPeriod();
    Student student = new Student();
    researchPeriod.setStudents(Set.of(student));
    researchPeriod.setProjects(Set.of());

    when(researchPeriodRepository.findById(1)).thenReturn(Optional.of(researchPeriod));

    IllegalStateException exception = assertThrows(IllegalStateException.class,
        () -> researchPeriodService.deleteResearchPeriodById(1));

    assertEquals("Research Period has students associated with it, cannot delete",
        exception.getMessage());
    verify(researchPeriodRepository, never()).delete(any());
  }
}
