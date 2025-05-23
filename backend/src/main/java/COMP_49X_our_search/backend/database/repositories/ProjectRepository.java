/**
 * Repository interface for managing Project entities. This interface
 * provides methods for performing CRUD operations on the "projects" table.
 *
 * It extends JpaRepository to use built-in database operations.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Project;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
  List<Project> findAllByDisciplines_Id(Integer disciplineId);
  List<Project> findAllByMajors_Id(Integer majorId);
  List<Project> findAllByFaculty_Id(Integer facultyId);
  @Transactional
  void deleteByFaculty_Id(int facultyId);
  @Query("SELECT p FROM Project p WHERE p.createdAt >= :createdAfter")
  List<Project> findProjectsCreatedAfter(@Param("createdAfter") LocalDateTime createdAfter);
}
