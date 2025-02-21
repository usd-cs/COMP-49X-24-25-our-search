package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Major;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MajorRepository extends JpaRepository<Major, Integer> {
  List<Major> findAllByDisciplines_Id(Integer disciplineId);
  Optional<Major> findMajorByName(String name);
}
