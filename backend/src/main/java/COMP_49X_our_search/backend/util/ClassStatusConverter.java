package COMP_49X_our_search.backend.util;

public class ClassStatusConverter {

  public static int toUndergradYear(String classStatus) {
    switch (classStatus) {
      case "Freshman":
        return 1;
      case "Sophomore":
        return 2;
      case "Junior":
        return 3;
      case "Senior":
        return 4;
      case "Graduate":
        return 5;
      default:
        throw new IllegalArgumentException("Class status not supported: " + classStatus);
    }
  }

  public static String toClassStatus(int undergradYear) {
    switch (undergradYear) {
      case 1:
        return "Freshman";
      case 2:
        return "Sophomore";
      case 3:
        return "Junior";
      case 4:
        return "Senior";
      case 5:
        return "Graduate";
      default:
        throw new IllegalArgumentException("Undergrad year not supported: " + undergradYear);
    }
  }
}
