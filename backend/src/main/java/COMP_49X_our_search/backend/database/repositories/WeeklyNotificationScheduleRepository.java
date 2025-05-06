package COMP_49X_our_search.backend.database.repositories;

import COMP_49X_our_search.backend.database.entities.WeeklyNotificationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeeklyNotificationScheduleRepository
    extends JpaRepository<WeeklyNotificationSchedule, Integer> {}
