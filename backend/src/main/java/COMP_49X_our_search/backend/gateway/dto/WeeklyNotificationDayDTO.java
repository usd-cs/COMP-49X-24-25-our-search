package COMP_49X_our_search.backend.gateway.dto;

public class WeeklyNotificationDayDTO {
    private String day;

    public WeeklyNotificationDayDTO() {}

    public WeeklyNotificationDayDTO(String day) {
      this.day = day;
    }

    public String getDay() {
      return this.day;
    }

    public void setDay(String day) {
      this.day = day;
    }
}
