package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.ProjectStudentMatches;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectStudentMatchesRepository extends JpaRepository<ProjectStudentMatches, Integer> {
  List<ProjectStudentMatches> findByStudentId(Integer studentId);
  List<ProjectStudentMatches> findByProjectId(Integer projectId);
}
