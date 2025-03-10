/**
 * Service class for managing Department entities. This class provides business
 * logic for retrieving department data from the database through the
 * DepartmentRepository.
 *
 * This service is annotated with @Service to indicate that it's managed by
 * Spring.
 *
 * @author Augusto Escudero
 * @author Natalie Jungquist
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.repositories.DepartmentRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {

  private final DepartmentRepository departmentRepository;

  @Autowired
  public DepartmentService(DepartmentRepository departmentRepository) {
    this.departmentRepository = departmentRepository;
  }

  public List<Department> getAllDepartments() {
    return departmentRepository.findAll(Sort.by(Sort.Direction.ASC, "name")); // returns the departments in alphabetical order
  }

  public Optional<Department> getDepartmentByName(String name) {
    return departmentRepository.findDepartmentByName(name);
  }
}
