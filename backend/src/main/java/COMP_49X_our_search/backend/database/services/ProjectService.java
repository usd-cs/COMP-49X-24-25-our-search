package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.repositories.ProjectRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;

  @Autowired
  public ProjectService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public List<Project> getAllResearchOpportunities() {
    return projectRepository.findAll();
  }
}
