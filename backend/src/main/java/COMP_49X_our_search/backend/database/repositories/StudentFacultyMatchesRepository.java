package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.StudentFacultyMatches;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentFacultyMatchesRepository extends JpaRepository<StudentFacultyMatches, Integer> {
  List<StudentFacultyMatches> findByStudentId(Integer studentId);
  List<StudentFacultyMatches> findByFacultyId(Integer facultyId);
}
