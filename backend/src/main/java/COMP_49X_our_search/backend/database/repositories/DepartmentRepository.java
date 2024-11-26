package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {}
