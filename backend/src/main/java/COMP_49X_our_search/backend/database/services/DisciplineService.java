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
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DisciplineService {

  private final DisciplineRepository disciplineRepository;

  @Autowired
  public DisciplineService(DisciplineRepository disciplineRepository) {
    this.disciplineRepository = disciplineRepository;
  }

  public List<Discipline> getAllDisciplines() {
    return disciplineRepository.findAll();
  }
}
