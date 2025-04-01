package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.repositories.UmbrellaTopicRepository;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import java.util.Optional;
import java.util.Set;
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
    UmbrellaTopic topic = new UmbrellaTopic(topicId, "Test Topic");

    topic.setProjects(Set.of());

    when(umbrellaTopicRepository.findById(topicId)).thenReturn(Optional.of(topic));

    service.deleteUmbrellaTopicById(topicId);

    verify(umbrellaTopicRepository, times(1)).deleteById(topicId);
  }

  @Test
  void testDeleteUmbrellaTopicById_notFound_throwsException() {
    int topicId = 99;

    when(umbrellaTopicRepository.findById(topicId)).thenReturn(Optional.empty());

    RuntimeException thrown = assertThrows(RuntimeException.class, () ->
        service.deleteUmbrellaTopicById(topicId)
    );

    assertEquals("Cannot delete umbrella topic with id '99'. Umbrella topic not found.", thrown.getMessage());
    verify(umbrellaTopicRepository, never()).deleteById(anyInt());
  }

  @Test
  void testDeleteUmbrellaTopicById_hasProjects_throwsException() {
    int topicId = 2;
    UmbrellaTopic topic = new UmbrellaTopic(topicId, "Linked Topic");

    topic.setProjects(Set.of(new Project()));

    when(umbrellaTopicRepository.findById(topicId)).thenReturn(Optional.of(topic));

    IllegalStateException thrown = assertThrows(IllegalStateException.class, () ->
        service.deleteUmbrellaTopicById(topicId)
    );

    assertEquals("Umbrella topic has projects associated with it, cannot delete", thrown.getMessage());
    verify(umbrellaTopicRepository, never()).deleteById(anyInt());
  }
}
