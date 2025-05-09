package COMP_49X_our_search.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@ActiveProfiles("test")
@SpringBootTest
@TestPropertySource(properties = {
		"DOMAIN=http://localhost"
})
class BackendApplicationTests {

	@Test
	void contextLoads() {}

}
