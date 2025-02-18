/**
 * Tests for the email validator. Checks that the email validation method return true or false correctly.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailValidatorTest {

    private static final String ALLOWED_DOMAIN = "@sandiego.edu";
    private EmailValidator emailValidator;

    @BeforeEach
    public void setUp() {
        emailValidator = new EmailValidator();
    }

    @Test
    void testHandlesValidEmail() {
        String valid = "test@sandiego.edu";
        assertTrue(emailValidator.isValidEmail(valid, ALLOWED_DOMAIN));
    }
    @Test
    void testHandlesInValidEmail() {
        String invalid = "test@invalid.com";
        assertFalse(emailValidator.isValidEmail(invalid, ALLOWED_DOMAIN));
    }
    @Test
    void testHandlesNulls() {
        assertFalse(emailValidator.isValidEmail(null, ALLOWED_DOMAIN));
        assertFalse(emailValidator.isValidEmail("test@sandiego.edu", null));
        assertFalse(emailValidator.isValidEmail("test@invalid.com", null));
    }
}
