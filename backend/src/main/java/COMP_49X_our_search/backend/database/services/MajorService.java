/**
 * Service class for managing Major entities. This class provides business
 * logic for retrieving major data from the database through the
 * MajorRepository.
 *
 * This service is annotated with @Service to indicate that it's managed by
 * Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MajorService {

  private final MajorRepository majorRepository;

  @Autowired
  public MajorService(MajorRepository majorRepository) {
    this.majorRepository = majorRepository;
  }

  public List<Major> getAllMajors() {
    return majorRepository.findAll();
  }

  public List<Major> getMajorsByDisciplineId(int disciplineId) {
    return majorRepository.findAllByDisciplines_Id(disciplineId);
  }

  public Optional<Major> getMajorByName(String name) {
    return majorRepository.findMajorByName(name);
  }
}
