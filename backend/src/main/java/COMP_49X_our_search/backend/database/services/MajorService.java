/**
 * Service class for managing Major entities. This class provides business logic for retrieving
 * major data from the database through the MajorRepository.
 *
 * <p>This service is annotated with @Service to indicate that it's managed by Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MajorService {

  private final MajorRepository majorRepository;

  @Autowired
  public MajorService(MajorRepository majorRepository) {
    this.majorRepository = majorRepository;
  }

  public List<Major> getAllMajors() {
    return majorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
  }

  public List<Major> getMajorsByDisciplineId(int disciplineId) {
    return majorRepository.findAllByDisciplines_Id(disciplineId);
  }

  public Optional<Major> getMajorByName(String name) {
    return majorRepository.findMajorByName(name);
  }

  public Major getMajorById(int id) {
    return majorRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Major not found with id: " + id));
  }

  public Major saveMajor(Major major) {
    return majorRepository.save(major);
  }

  @Transactional
  public void deleteMajorById(int id) {
    Major major = majorRepository.findById(id)
        .orElseThrow(() -> new RuntimeException(
            String.format("Cannot delete major with id '%s'. Major not found.", id)
        ));

    if (!major.getStudents().isEmpty()) {
      throw new IllegalStateException("Major has students associated with it, cannot delete");
    }

    if (!major.getProjects().isEmpty()) {
      throw new IllegalStateException("Major has projects associated with it, cannot delete");
    }

    majorRepository.delete(major);
  }
}
