/**
 * Service class for managing Project entities. This class provides business logic for retrieving
 * project data from the database through the ProjectRepository.
 *
 * <p>This service is annotated with @Service to indicate that it's managed by Spring.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.repositories.ProjectRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;

  @Autowired
  public ProjectService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  // TODO(@acescudero): Rename this to getAllProjects for consistency.
  public List<Project> getAllResearchOpportunities() {
    return projectRepository.findAll();
  }

  public List<Project> getProjectsByMajorId(int majorId) {
    return projectRepository.findAllByMajors_Id(majorId);
  }

  public List<Project> getProjectsByFacultyId(int facultyId) {
    return projectRepository.findAllByFaculty_Id(facultyId);
  }

  @Transactional
  public void deleteByFacultyId(int facultyId) {
    projectRepository.deleteByFaculty_Id(facultyId);
  }

  public Project saveProject(Project project) {
    return projectRepository.save(project);
  }

  @Transactional
  public void deleteById(int id) {
    if (!projectRepository.existsById(id)) {
      throw new RuntimeException("Project not found with id: " + id);
    }
    projectRepository.deleteById(id);
  }
}
