package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {}
