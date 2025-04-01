package COMP_49X_our_search.backend.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ClassStatusConverterTest {

  @Test
  public void testToUndergradYear_validYear_returnsExpectedResponse() {
    assertEquals(1, ClassStatusConverter.toUndergradYear("Freshman"));
    assertEquals(2, ClassStatusConverter.toUndergradYear("Sophomore"));
    assertEquals(3, ClassStatusConverter.toUndergradYear("Junior"));
    assertEquals(4, ClassStatusConverter.toUndergradYear("Senior"));
    assertEquals(5, ClassStatusConverter.toUndergradYear("Graduate"));
  }

  @Test
  public void testToUndergradYear_invalidYear_throwsException() {
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              ClassStatusConverter.toUndergradYear("PhD");
            });
    assertEquals("Class status not supported: PhD", exception.getMessage());
  }

  @Test
  public void testToClassStatus_validStatus_returnsExpectedResponse() {
    assertEquals("Freshman", ClassStatusConverter.toClassStatus(1));
    assertEquals("Sophomore", ClassStatusConverter.toClassStatus(2));
    assertEquals("Junior", ClassStatusConverter.toClassStatus(3));
    assertEquals("Senior", ClassStatusConverter.toClassStatus(4));
    assertEquals("Graduate", ClassStatusConverter.toClassStatus(5));
  }

  @Test
  public void testToClassStatus_invalidStatus_throwsException() {
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              ClassStatusConverter.toClassStatus(6);
            });
    assertEquals("Undergrad year not supported: 6", exception.getMessage());
  }
}
