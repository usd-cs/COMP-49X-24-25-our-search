/**
 * Service class for managing Major entities. This class provides business logic for retrieving
 * major data from the database through the MajorRepository.
 *
 * <p>This service is annotated with @Service to indicate that it's managed by Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.repositories.MajorRepository;

import COMP_49X_our_search.backend.util.Constants;
import COMP_49X_our_search.backend.util.exceptions.ForbiddenMajorActionException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MajorService {

  private final MajorRepository majorRepository;
  private final DisciplineService disciplineService;

  @Value("${PREPOPULATE_MAJORS:false}")
  private boolean prepopulateMajors;

  @Value("classpath:default-majors.json")
  private Resource defaultMajorsResource;

  @Autowired
  public MajorService(MajorRepository majorRepository, DisciplineService disciplineService) {
    this.majorRepository = majorRepository;
    this.disciplineService = disciplineService;
  }

  @PostConstruct
  public void initializeSpecialMajors() {
    if (majorRepository.findMajorByName(Constants.MAJOR_UNDECLARED).isEmpty()) {
      Major undeclaredMajor = new Major(Constants.MAJOR_UNDECLARED);

      Discipline otherDiscipline = disciplineService.getOtherDiscipline();
      Set<Discipline> disciplines = new HashSet<>();
      disciplines.add(otherDiscipline);
      undeclaredMajor.setDisciplines(disciplines);

      majorRepository.save(undeclaredMajor);
    }
  }

  @PostConstruct
  public void prepopulateMajorsIfRequired() {
    if (!prepopulateMajors) {
      System.out.println("PREPOPULATE_MAJORS is set to false. Skipping prepopulation.");
      return;
    }
    try (InputStream inputStream = defaultMajorsResource.getInputStream()) {
      ObjectMapper objectMapper = new ObjectMapper();
      List<String> majorsFromConfig =
          objectMapper.readValue(inputStream, new TypeReference<List<String>>() {});

      Discipline otherDiscipline = disciplineService.getOtherDiscipline();

      Set<String> existingMajors =
          majorRepository.findAll().stream().map(Major::getName).collect(Collectors.toSet());

      List<Major> missingMajors =
          majorsFromConfig.stream()
              .filter(majorName -> !existingMajors.contains(majorName))
              .map(majorName -> {
                Major major = new Major();
                major.setName(majorName);
                major.setDisciplines(Set.of(otherDiscipline));
                return major;
              }).toList();

      if (!missingMajors.isEmpty()) {
        majorRepository.saveAll(missingMajors);
        System.out.println("Added missing majors: " + missingMajors);
      } else {
        System.out.println("All majors already exist. No new majors added on startup.");
      }
    } catch (IOException e) {
      System.err.println("Failed to load default majors configuration: " + e.getMessage());
    }
  }

  public Major getUndeclaredMajor() {
    return majorRepository
        .findMajorByName(Constants.MAJOR_UNDECLARED)
        .orElseGet(
            () -> {
              Major undeclaredMajor = new Major(Constants.MAJOR_UNDECLARED);

              Discipline otherDiscipline = disciplineService.getOtherDiscipline();
              Set<Discipline> disciplines = new HashSet<>();
              disciplines.add(otherDiscipline);
              undeclaredMajor.setDisciplines(disciplines);

              return majorRepository.save(undeclaredMajor);
            });
  }

  public List<Major> getAllMajors() {
    return majorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
  }

  public List<Major> getMajorsByDisciplineId(int disciplineId) {
    return majorRepository.findAllByDisciplines_Id(disciplineId);
  }

  public Optional<Major> getMajorByName(String name) {
    return majorRepository.findMajorByName(name);
  }

  public Major getMajorById(int id) {
    return majorRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Major not found with id: " + id));
  }

  public Major saveMajor(Major major) {
    // If id != null it means we're trying to edit an existing major
    if (major.getId() != null) {
      throw new IllegalArgumentException(
          "Major id provided. For existing majors, use editMajor instead.");
    }

    // If id is null, it means we're trying to create a new major.
    if (major.getName().equals(Constants.MAJOR_UNDECLARED)) {
      throw new ForbiddenMajorActionException(
          "Creating a major with name 'Undeclared' is not allowed.");
    }

    Set<Discipline> disciplines = major.getDisciplines();
    Discipline otherDiscipline = disciplineService.getOtherDiscipline();

    // If the list of disciplines is empty, the major is associated with the
    // "Other" discipline by default.
    if (disciplines.isEmpty()) {
      disciplines = new HashSet<>();
      disciplines.add(otherDiscipline);
    }
    // If the list of disciplines is not empty AND it contains the "Other"
    // discipline, it should ignore the "Other" discipline, since it will only
    // be used for the "Undeclared" major and majors that don't currently belong
    // to any discipline.
    else if (disciplines.size() > 1) {
      disciplines.remove(otherDiscipline);
    }

    major.setDisciplines(disciplines);

    return majorRepository.save(major);
  }

  @Transactional
  public Major editMajor(int id, String newName, Set<Discipline> disciplines) {
    Major major = getMajorById(id);
    if (major.getName().equals(Constants.MAJOR_UNDECLARED)) {
      throw new ForbiddenMajorActionException("Editing major 'Undeclared' is not allowed.");
    }

    major.setName(newName);

    Discipline otherDiscipline = disciplineService.getOtherDiscipline();

    // If no disciplines are provided, add major to "Other" by default.
    if (disciplines.isEmpty()) {
      disciplines = new HashSet<>();
      disciplines.add(otherDiscipline);
    }
    // If disciplines are provided as well as "Other", remove "Other"
    else if (disciplines.size() > 1) {
      disciplines.remove(otherDiscipline);
    }

    major.setDisciplines(disciplines);
    return majorRepository.save(major);
  }

  @Transactional
  public void deleteMajorById(int id) {
    Major major =
        majorRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new RuntimeException(
                        String.format("Cannot delete major with id '%s'. Major not found.", id)));

    if (major.getName().equals(Constants.MAJOR_UNDECLARED)) {
      throw new ForbiddenMajorActionException("Deleting major 'Undeclared' is not allowed.");
    }

    if (!major.getStudents().isEmpty()) {
      throw new IllegalStateException("Major has students associated with it, cannot delete");
    }

    if (!major.getProjects().isEmpty()) {
      throw new IllegalStateException("Major has projects associated with it, cannot delete");
    }

    majorRepository.delete(major);
  }

  public List<Major> getMajorsWithoutDisciplines() {
    return majorRepository.findAllMajorsWithoutDisciplines();
  }
}
