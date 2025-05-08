package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.YearlyNotificationSchedule;
import COMP_49X_our_search.backend.database.repositories.YearlyNotificationScheduleRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class YearlyNotificationScheduleService {

  private final YearlyNotificationScheduleRepository repository;

  @Value("classpath:email-notification-schedule-defaults.json")
  private Resource defaultsResource;

  @Autowired
  public YearlyNotificationScheduleService(
      YearlyNotificationScheduleRepository yearlyNotificationRepository) {
    this.repository = yearlyNotificationRepository;
  }

  @PostConstruct
  public void populateDefaultYearlySchedule() {
    if (repository.count() == 0) {
      try (InputStream inputStream = defaultsResource.getInputStream()) {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode defaults = objectMapper.readTree(inputStream);
        LocalDateTime defaultDateTime =
            LocalDateTime.parse(defaults.get("yearlyNotificationDateTime").asText());

        YearlyNotificationSchedule defaultSchedule =
            new YearlyNotificationSchedule(defaultDateTime);
        repository.save(defaultSchedule);
        System.out.println("Default yearly notification schedule created: " + defaultSchedule);
      } catch (IOException e) {
        System.err.println(
            "Failed to load default yearly notification schedule: " + e.getMessage());
      }
    } else {
      System.out.println("Yearly notification schedule already exists.");
    }
  }

  public YearlyNotificationSchedule getSchedule() {
    // For now, we're only using 1 entry
    return repository.findById(1).orElse(null);
  }

  public YearlyNotificationSchedule updateSchedule(LocalDateTime newDateTime) {
    YearlyNotificationSchedule schedule =
        repository.findById(1).orElse(new YearlyNotificationSchedule());
    schedule.setNotificationDateTime(newDateTime);
    return repository.save(schedule);
  }
}
