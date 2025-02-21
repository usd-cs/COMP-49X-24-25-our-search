package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.repositories.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {

  private final FacultyRepository facultyRepository;

  @Autowired
  public FacultyService(FacultyRepository facultyRepository) {
    this.facultyRepository = facultyRepository;
  }

  public boolean existsByEmail(String email) {
    return facultyRepository.existsByEmail(email);
  }

  public Faculty saveFaculty(Faculty faculty) {
    return facultyRepository.save(faculty);
  }
}
