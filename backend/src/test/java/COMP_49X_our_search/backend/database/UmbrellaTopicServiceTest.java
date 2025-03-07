package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.repositories.UmbrellaTopicRepository;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

@SpringBootTest(classes = {UmbrellaTopicService.class})
@ActiveProfiles("test")
public class UmbrellaTopicServiceTest {

  @Autowired private UmbrellaTopicService service;

  @MockBean private UmbrellaTopicRepository umbrellaTopicRepository;

  @Test
  void testGetAllUmbrellaTopics() {
    UmbrellaTopic topic1 = new UmbrellaTopic(1, "race");
    UmbrellaTopic topic2 = new UmbrellaTopic(2, "intersectionality");

    when(umbrellaTopicRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
        .thenReturn(List.of(topic1, topic2));

    List<UmbrellaTopic> topics = service.getAllUmbrellaTopics();

    assertEquals(2, topics.size());
    assertTrue(topics.containsAll(List.of(topic1, topic2)));
  }

  @Test
  void testGetUmbrellaTopicByName_existingTopic_returnsTopic() {
    UmbrellaTopic sampleTopic = new UmbrellaTopic(1, "AI");
    when(umbrellaTopicRepository.findUmbrellaTopicByName("AI"))
        .thenReturn(Optional.of(sampleTopic));

    Optional<UmbrellaTopic> result = service.getUmbrellaTopicByName("AI");

    assertTrue(result.isPresent());
    assertEquals(sampleTopic, result.get());
  }

  @Test
  void testGetUmbrellaTopicByName_nonExistingTopic_returnsEmpty() {
    when(umbrellaTopicRepository.findUmbrellaTopicByName("nonexistent"))
        .thenReturn(Optional.empty());

    Optional<UmbrellaTopic> result = service.getUmbrellaTopicByName("nonexistent");

    assertTrue(result.isEmpty());
  }
}
