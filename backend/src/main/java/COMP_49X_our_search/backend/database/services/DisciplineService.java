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
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.DisciplineRepository;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisciplineService {

  private final DisciplineRepository disciplineRepository;
  private final MajorRepository majorRepository;

  @Autowired
  public DisciplineService(DisciplineRepository disciplineRepository, MajorRepository majorRepository) {
    this.disciplineRepository = disciplineRepository;
    this.majorRepository = majorRepository;
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

    Set<Major> associatedMajors = new HashSet<>(discipline.getMajors());

    // Since we have a majors_disciplines table, when we delete a discipline we
    // have to remove the relationship from each major, e.g. if Computer Science
    // belongs to the Engineering and Mathematics disciplines, and we remove
    // Mathematics, we should first remove the Computer Science <-> Mathematics
    // relationship.
    associatedMajors
        .forEach(major -> {
          major.getDisciplines().remove(discipline);
          majorRepository.save(major);
        });

    discipline.getMajors().clear();
    disciplineRepository.save(discipline);

    disciplineRepository.deleteById(id);
  }
}
