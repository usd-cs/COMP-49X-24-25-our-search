package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.YearlyNotificationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YearlyNotificationScheduleRepository
    extends JpaRepository<YearlyNotificationSchedule, Integer> {}
