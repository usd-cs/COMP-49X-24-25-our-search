/**
 * Service class for managing Discipline entities. This class provides business logic for retrieving
 * discipline data from the database through the DisciplineRepository.
 *
 * <p>This service is annotated with @Service to indicate that it's managed by Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.repositories.DisciplineRepository;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import COMP_49X_our_search.backend.util.Constants;
import COMP_49X_our_search.backend.util.exceptions.ForbiddenDisciplineActionException;
import jakarta.annotation.PostConstruct;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisciplineService {

  private final DisciplineRepository disciplineRepository;

  @Autowired
  public DisciplineService(DisciplineRepository disciplineRepository) {
    this.disciplineRepository = disciplineRepository;
  }

  @PostConstruct
  public void initializeSpecialDisciplines() {
    if (disciplineRepository.findByName(Constants.DISCIPLINE_OTHER).isEmpty()) {
      Discipline otherDiscipline = new Discipline();
      otherDiscipline.setName(Constants.DISCIPLINE_OTHER);
      disciplineRepository.save(otherDiscipline);
    }
  }

  public Discipline getOtherDiscipline() {
    return disciplineRepository
        .findByName(Constants.DISCIPLINE_OTHER)
        .orElseGet(
            () -> {
              Discipline otherDiscipline = new Discipline();
              otherDiscipline.setName(Constants.DISCIPLINE_OTHER);
              return disciplineRepository.save(otherDiscipline);
            });
  }

  public List<Discipline> getAllDisciplines() {
    return disciplineRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
  }

  public Discipline getDisciplineByName(String name) {
    return disciplineRepository
        .findByName(name)
        .orElseThrow(() -> new RuntimeException("Major not found with name: " + name));
  }

  @Transactional
  public void deleteDisciplineById(int id) {
    Discipline discipline =
        disciplineRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new RuntimeException(
                        String.format(
                            "Cannot delete discipline with id '%s'. Discipline not found.", id)));

    if (discipline.getName().equals(Constants.DISCIPLINE_OTHER)) {
      throw new ForbiddenDisciplineActionException("Discipline discipline 'Other' is not allowed.");
    }

    // Since we have a relationship tables, when we delete a discipline we have
    // to remove these relationships first before attempting to delete the
    // discipline.

    Discipline otherDiscipline = getOtherDiscipline();
    discipline
        .getMajors()
        .forEach(
            major -> {
              major.getDisciplines().remove(discipline);
              // If the discipline that was removed was the only discipline a
              // major belonged to, the major should be moved to the "Other"
              // discipline, otherwise it would stay unassociated.
              if (major.getDisciplines().isEmpty()) {
                major.getDisciplines().add(otherDiscipline);
                otherDiscipline.getMajors().add(major);
              }
            });
    discipline.getStudents().forEach(student -> student.getDisciplines().remove(discipline));

    discipline.getMajors().clear();
    discipline.getStudents().clear();

    disciplineRepository.delete(discipline);
  }

  public Discipline getDisciplineById(int id) {
    return disciplineRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Discipline not found with id: " + id));
  }

  public Discipline saveDiscipline(Discipline discipline) {
    // Make sure we're only using this method for creating disciplines.
    if (discipline.getId() != null) {
      throw new IllegalArgumentException(
          "Discipline id provided. For existing disciplines, use editDiscipline instead");
    }

    if (discipline.getName().equals(Constants.DISCIPLINE_OTHER)) {
      throw new ForbiddenDisciplineActionException(
          "Creating a discipline with name 'Other' is not allowed.");
    }

    return disciplineRepository.save(discipline);
  }

  @Transactional
  public Discipline editDiscipline(int id, String newName) {
    Discipline existingDiscipline = getDisciplineById(id);

    if (existingDiscipline.getName().equals(Constants.DISCIPLINE_OTHER)) {
      throw new ForbiddenDisciplineActionException("Editing discipline 'Other' is not allowed.");
    }

    existingDiscipline.setName(newName);
    return disciplineRepository.save(existingDiscipline);
  }
}
