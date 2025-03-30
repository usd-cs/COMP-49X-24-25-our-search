package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.repositories.ProjectRepository;
import COMP_49X_our_search.backend.database.services.ProjectService;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {ProjectService.class})
@ActiveProfiles("test")
public class ProjectServiceTest {

  @Autowired private ProjectService projectService;

  @MockBean private ProjectRepository projectRepository;

  @Test
  void testGetAllProjects() {
    Department engineeringDepartment = new Department("Engineering");
    Discipline engineeringDiscipline = new Discipline("Engineering");
    Major csMajor = new Major("Computer Science", Set.of(engineeringDiscipline), null, null);
    Faculty faculty = new Faculty("Test", "Test", "test@test.com", Set.of(engineeringDepartment));

    Project project =
        new Project(
            "Example Title",
            faculty,
            "Example description",
            "Example desired qualifications",
            true,
            Set.of(engineeringDiscipline),
            Set.of(csMajor),
            Set.of(new ResearchPeriod("Fall 2024", null, null)),
            Set.of(new UmbrellaTopic("Test Umbrella Topic", null)));

    when(projectRepository.findAll()).thenReturn(List.of(project));

    List<Project> projects = projectService.getAllResearchOpportunities();

    assertEquals(1, projects.size());
    assertTrue(projects.contains(project));
  }

  @Test
  void testGetProjectsByMajorId() {
    int majorId = 1;
    Discipline engineeringDiscipline = new Discipline("Engineering");
    Major csMajor = new Major("Computer Science", Set.of(engineeringDiscipline), null, null);
    Faculty faculty =
        new Faculty("Test", "Test", "test@test.com", Set.of(new Department("Engineering")));

    Project project =
        new Project(
            "Example Project",
            faculty,
            "Example description",
            "Example qualifications",
            true,
            Set.of(engineeringDiscipline),
            Set.of(csMajor),
            Set.of(new ResearchPeriod("Spring 2025", null, null)),
            Set.of(new UmbrellaTopic("AI Research", null)));

    when(projectRepository.findAllByMajors_Id(majorId)).thenReturn(List.of(project));

    List<Project> projects = projectService.getProjectsByMajorId(majorId);

    assertEquals(1, projects.size());
    assertTrue(projects.contains(project));
  }

  @Test
  void testSaveProject() {
    Department engineeringDepartment = new Department("Engineering");
    Discipline engineeringDiscipline = new Discipline("Engineering");
    Major csMajor = new Major("Computer Science", Set.of(engineeringDiscipline), null, null);
    Faculty faculty = new Faculty("John", "Doe", "johndoe@test.com", Set.of(engineeringDepartment));

    Project sampleProject =
        new Project(
            "Test name",
            faculty,
            "Test description",
            "Test qualifications",
            true,
            Set.of(engineeringDiscipline),
            Set.of(csMajor),
            Set.of(new ResearchPeriod("Fall 2025", null, null)),
            Set.of(new UmbrellaTopic("Artificial Intelligence", null)));

    when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

    Project savedProject = projectService.saveProject(sampleProject);

    verify(projectRepository, times(1)).save(sampleProject);

    assertEquals(sampleProject.getName(), savedProject.getName());
    assertEquals(sampleProject.getDescription(), savedProject.getDescription());
    assertEquals(sampleProject.getFaculty().getEmail(), savedProject.getFaculty().getEmail());
  }

  @Test
  void testDeleteById_existingProject_deletesSuccessfully() {
    int projectId = 1;

    when(projectRepository.existsById(projectId)).thenReturn(true);

    projectService.deleteById(projectId);

    verify(projectRepository, times(1)).deleteById(projectId);
  }

  @Test
  void testDeleteById_nonExistingProject_throwsException() {
    int nonExistingId = 999;

    when(projectRepository.existsById(nonExistingId)).thenReturn(false);

    RuntimeException exception = assertThrows(
        RuntimeException.class,
        () -> projectService.deleteById(nonExistingId)
    );

    assertEquals("Project not found with id: " + nonExistingId, exception.getMessage());

    verify(projectRepository, never()).deleteById(nonExistingId);
  }
}
