/**
 * Service class for managing Discipline entities. This class provides business
 * logic for retrieving discipline data from the database through the
 * DisciplineRepository.
 *
 * This service is annotated with @Service to indicate that it's managed by
 * Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.repositories.DisciplineRepository;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisciplineService {

  private final DisciplineRepository disciplineRepository;
  @Autowired
  public DisciplineService(DisciplineRepository disciplineRepository, MajorRepository majorRepository) {
    this.disciplineRepository = disciplineRepository;
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
    Discipline discipline = disciplineRepository.findById(id)
        .orElseThrow(() -> new RuntimeException(
            String.format("Cannot delete discipline with id '%s'. Discipline not found.", id)
        ));

    // Since we have a relationship tables, when we delete a discipline we have
    // to remove these relationships first before attempting to delete the
    // discipline.
    discipline.getMajors().forEach(major -> major.getDisciplines().remove(discipline));
    discipline.getStudents().forEach(student -> student.getDisciplines().remove(discipline));

    discipline.getMajors().clear();
    discipline.getStudents().clear();

    disciplineRepository.delete(discipline);
  }
}
