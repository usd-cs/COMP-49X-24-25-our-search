package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Integer> {
  boolean existsByEmail(String email);
}
