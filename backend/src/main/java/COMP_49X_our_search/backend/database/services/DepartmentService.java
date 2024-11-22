package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.repositories.DepartmentRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {

  private final DepartmentRepository departmentRepository;

  @Autowired
  public DepartmentService(DepartmentRepository departmentRepository) {
    this.departmentRepository = departmentRepository;
  }

  public List<Department> getAllDepartments() {
    return departmentRepository.findAll();
  }
}
