package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

  @Test
  void testGetUmbrellaTopicById_existingTopic_returnsTopic() {
    UmbrellaTopic sampleTopic = new UmbrellaTopic(1, "AI");
    when(umbrellaTopicRepository.findById(1)).thenReturn(Optional.of(sampleTopic));

    UmbrellaTopic result = service.getUmbrellaTopicById(1);

    assertEquals(sampleTopic, result);
  }

  @Test
  void testGetUmbrellaTopicById_nonExistingTopic_throwsException() {
    when(umbrellaTopicRepository.findById(2)).thenReturn(Optional.empty());

    RuntimeException thrown =
            assertThrows(RuntimeException.class, () -> service.getUmbrellaTopicById(2));

    assertEquals("Umbrella topic not found with id: 2", thrown.getMessage());
  }

  @Test
  void testSaveUmbrellaTopic() {
    UmbrellaTopic newTopic = new UmbrellaTopic(0, "New Topic");
    UmbrellaTopic savedTopic = new UmbrellaTopic(1, "New Topic");

    when(umbrellaTopicRepository.save(newTopic)).thenReturn(savedTopic);

    UmbrellaTopic result = service.saveUmbrellaTopic(newTopic);

    assertEquals(savedTopic, result);
  }

  @Test
  void testDeleteUmbrellaTopicById_success() {
    int topicId = 1;

    service.deleteUmbrellaTopicById(topicId);

    verify(umbrellaTopicRepository, times(1)).deleteById(topicId);
  }

  @Test
  void testDeleteUmbrellaTopicById_failure() {
    int topicId = 1;

    doThrow(new RuntimeException("Failed to delete umbrella topic"))
            .when(umbrellaTopicRepository).deleteById(topicId);

    RuntimeException thrown = assertThrows(
            RuntimeException.class,
            () -> service.deleteUmbrellaTopicById(topicId)
    );

    assertEquals("Failed to delete umbrella topic", thrown.getMessage());
    verify(umbrellaTopicRepository, times(1)).deleteById(topicId);
  }
}
