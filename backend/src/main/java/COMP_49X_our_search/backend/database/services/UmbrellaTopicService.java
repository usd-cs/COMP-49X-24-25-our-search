/**
 * Service class for managing UmbrellaTopic entities. This class provides business
 * logic for retrieving department data from the database through the
 * UmbrellaTopicRepository.
 *
 * This service is annotated with @Service to indicate that it's managed by
 * Spring.
 *
 * @author Natalie Jungquist
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.repositories.UmbrellaTopicRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UmbrellaTopicService {

    private final UmbrellaTopicRepository umbrellaTopicRepository;

    @Autowired
    public UmbrellaTopicService(UmbrellaTopicRepository repository) {
        this.umbrellaTopicRepository = repository;
    }

    public List<UmbrellaTopic> getAllUmbrellaTopics() {
        return umbrellaTopicRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public Optional<UmbrellaTopic> getUmbrellaTopicByName(String name) {
        return umbrellaTopicRepository.findUmbrellaTopicByName(name);
    }

    public UmbrellaTopic getUmbrellaTopicById(int id) {
        return umbrellaTopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Umbrella topic not found with id: " + id));
    }

    public UmbrellaTopic saveUmbrellaTopic(UmbrellaTopic umbrellaTopic) {
        return umbrellaTopicRepository.save(umbrellaTopic);
    }
}
