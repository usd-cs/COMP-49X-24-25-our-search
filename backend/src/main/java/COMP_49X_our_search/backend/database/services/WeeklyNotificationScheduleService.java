package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.WeeklyNotificationSchedule;
import COMP_49X_our_search.backend.database.repositories.WeeklyNotificationScheduleRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.time.DayOfWeek;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class WeeklyNotificationScheduleService {

  private final WeeklyNotificationScheduleRepository repository;

  @Value("classpath:email-notification-schedule-defaults.json")
  private Resource defaultsResource;

  @Autowired
  public WeeklyNotificationScheduleService(WeeklyNotificationScheduleRepository repository) {
    this.repository = repository;
  }

  @PostConstruct
  public void populateDefaultWeeklySchedule() {
    if (repository.count() == 0) {
      try (InputStream inputStream = defaultsResource.getInputStream()) {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode defaults = objectMapper.readTree(inputStream);
        DayOfWeek defaultDay =
            DayOfWeek.valueOf(defaults.get("weeklyNotificationDay").asText().toUpperCase());

        WeeklyNotificationSchedule defaultSchedule = new WeeklyNotificationSchedule(defaultDay);
        repository.save(defaultSchedule);
        System.out.println("Default weekly notification schedule created: " + defaultSchedule);
      } catch (IOException e) {
        System.err.println(
            "Failed to load default weekly notification schedule: " + e.getMessage());
      }
    } else {
      System.out.println("Weekly notification schedule already exists.");
    }
  }

  public WeeklyNotificationSchedule getSchedule() {
    // For now, we're only using 1 entry
    return repository.findById(1).orElse(null);
  }

  public WeeklyNotificationSchedule updateSchedule(DayOfWeek newDay) {
    WeeklyNotificationSchedule schedule =
        repository.findById(1).orElse(new WeeklyNotificationSchedule());
    schedule.setNotificationDay(newDay);
    return repository.save(schedule);
  }
}
