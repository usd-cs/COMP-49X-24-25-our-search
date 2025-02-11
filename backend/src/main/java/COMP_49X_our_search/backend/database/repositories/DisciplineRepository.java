package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.Discipline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplineRepository
    extends JpaRepository<Discipline, Integer> {
}
