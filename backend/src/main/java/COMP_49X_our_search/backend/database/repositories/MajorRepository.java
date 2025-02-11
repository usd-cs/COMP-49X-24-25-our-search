package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Major;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MajorRepository extends JpaRepository<Major, Integer> {
  List<Major> findAllByDisciplines_Id(Integer disciplineId);
}
