package COMP_49X_our_search.backend.fetcher;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;

public class ProjectFetcherTest {
  private ProjectFetcher projectFetcher;
  private DepartmentService departmentService;
  private MajorService majorService;
  private ProjectService projectService;

  @BeforeEach
  void setUp() {
    departmentService = mock(DepartmentService.class);
    majorService = mock(MajorService.class);
    projectService = mock(ProjectService.class);
    projectFetcher = new ProjectFetcher(departmentService, majorService, projectService);
  }

  @Test
  public void testFetch_validRequest_returnsExpectedResponse() {
    Department engineering = new Department("Engineering");
    engineering.setId(0);
    List<Department> departments = List.of(engineering);
    when(departmentService.getAllDepartments()).thenReturn(departments);

    Major computerScience = new Major();
    computerScience.setName("Computer Science");
    computerScience.setId(0);
    List<Major> majors = List.of(computerScience);
    when(majorService.getMajorsByDepartmentId(0)).thenReturn(majors);

    UmbrellaTopic ai = new UmbrellaTopic();
    ai.setName("AI");

    ResearchPeriod fall25 = new ResearchPeriod();
    fall25.setName("Fall 2025");

    Faculty faculty = new Faculty();
    faculty.setFirstName("Dr.");
    faculty.setLastName("Faculty");
    faculty.setEmail("faculty@test.com");

    Project project = new Project();
    project.setId(1);
    project.setName("Project Name");
    project.setDescription("Project Description");
    project.setDesiredQualifications("Project Qualifications");
    project.setIsActive(true);
    project.setMajors(Set.of(computerScience));
    project.setUmbrellaTopics(Set.of(ai));
    project.setResearchPeriods(Set.of(fall25));
    project.setFaculty(faculty);
    List<Project> projects = List.of(project);
    when(projectService.getProjectsByMajorId(0)).thenReturn(projects);

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(FilteredFetcher.newBuilder().setFilteredType(FilteredType.PROJECTS))
            .build();
    FetcherResponse response = projectFetcher.fetch(request);

    assertNotNull(response);
  }

  @Test
  public void testFetch_missingFetcherType_throwsException() {
    FetcherRequest invalidRequest = FetcherRequest.getDefaultInstance();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              projectFetcher.fetch(invalidRequest);
            });

    assertTrue(
        exception
            .getMessage()
            .contains("Expected fetcher_type to be set, but no fetcher type was provided"));
  }
}
