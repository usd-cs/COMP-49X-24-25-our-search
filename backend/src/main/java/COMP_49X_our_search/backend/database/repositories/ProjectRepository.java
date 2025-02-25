package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Project;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
  List<Project> findAllByDisciplines_Id(Integer disciplineId);

  List<Project> findAllByMajors_Id(Integer majorId);
}
