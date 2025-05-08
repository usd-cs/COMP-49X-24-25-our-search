package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.ProjectStudentMatches;
import COMP_49X_our_search.backend.database.repositories.ProjectStudentMatchesRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectStudentMatchesService {

  private ProjectStudentMatchesRepository projectStudentMatchesRepository;

  @Autowired
  public ProjectStudentMatchesService(ProjectStudentMatchesRepository projectStudentMatchesRepository) {
    this.projectStudentMatchesRepository = projectStudentMatchesRepository;
  }

  public void createMatch(Integer projectId, Integer studentId) {
    ProjectStudentMatches match = new ProjectStudentMatches(projectId, studentId);
    projectStudentMatchesRepository.save(match);
  }

  public List<ProjectStudentMatches> getMatchesForStudent(Integer studentId) {
    return projectStudentMatchesRepository.findByStudentId(studentId);
  }

  public List<ProjectStudentMatches> getMatchesForProject(Integer projectId) {
    return projectStudentMatchesRepository.findByProjectId(projectId);
  }

}
