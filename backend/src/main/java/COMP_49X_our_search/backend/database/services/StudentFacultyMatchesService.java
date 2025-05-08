package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.StudentFacultyMatches;
import COMP_49X_our_search.backend.database.repositories.StudentFacultyMatchesRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentFacultyMatchesService {

  private StudentFacultyMatchesRepository studentFacultyMatchesRepository;

  @Autowired
  public StudentFacultyMatchesService(StudentFacultyMatchesRepository studentFacultyMatchesRepository) {
    this.studentFacultyMatchesRepository = studentFacultyMatchesRepository;
  }

  public void createMatch(Integer studentId, Integer facultyId) {
    StudentFacultyMatches match = new StudentFacultyMatches(studentId, facultyId);
    studentFacultyMatchesRepository.save(match);
  }

  public List<StudentFacultyMatches> getMatchesForStudent(Integer studentId) {
    return studentFacultyMatchesRepository.findByStudentId(studentId);
  }

  public List<StudentFacultyMatches> getMatchesForFaculty(Integer facultyId) {
    return studentFacultyMatchesRepository.findByFacultyId(facultyId);
  }
}
