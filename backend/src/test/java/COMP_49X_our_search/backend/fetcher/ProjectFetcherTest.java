package COMP_49X_our_search.backend.fetcher;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.ProjectProto;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;

public class ProjectFetcherTest {
  private ProjectFetcher projectFetcher;
  private DisciplineService disciplineService;
  private MajorService majorService;
  private ProjectService projectService;

  @BeforeEach
  void setUp() {
    disciplineService = mock(DisciplineService.class);
    majorService = mock(MajorService.class);
    projectService = mock(ProjectService.class);
    projectFetcher =
        new ProjectFetcher(disciplineService, majorService, projectService);
  }

  @Test
  public void testFetch_validRequest_returnsExpectedResponse() {
    Discipline engineering = new Discipline("Engineering");
    engineering.setId(0);
    List<Discipline> disciplines = List.of(engineering);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    Major computerScience = new Major();
    computerScience.setName("Computer Science");
    computerScience.setId(0);
    List<Major> majors = List.of(computerScience);
    when(majorService.getMajorsByDisciplineId(0)).thenReturn(majors);

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

    FetcherRequest request = FetcherRequest.newBuilder()
        .setFilteredFetcher(
            FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS))
        .build();
    FetcherResponse response = projectFetcher.fetch(request);

    assertNotNull(response);
  }

  @Test
  public void testFetch_projectWithMultipleMajors_returnsCorrectHierarchy() {
    // Set up disciplines
    Discipline engineering = new Discipline("Engineering");
    engineering.setId(1);
    List<Discipline> disciplines = List.of(engineering);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    // Set up majors
    Major computerScience = new Major();
    computerScience.setName("Computer Science");
    computerScience.setId(1);

    Major mathematics = new Major();
    mathematics.setName("Mathematics");
    mathematics.setId(2);

    List<Major> engineeringMajors = List.of(computerScience, mathematics);
    when(majorService.getMajorsByDisciplineId(1)).thenReturn(engineeringMajors);

    // Set up faculty
    Faculty mathFaculty = new Faculty();
    mathFaculty.setFirstName("Dr.");
    mathFaculty.setLastName("Math");
    mathFaculty.setEmail("math@test.com");

    // Set up topics and periods
    UmbrellaTopic ml = new UmbrellaTopic();
    ml.setName("Machine Learning");

    ResearchPeriod spring25 = new ResearchPeriod();
    spring25.setName("Spring 2025");

    // Set up shared project
    Project mlProject = new Project();
    mlProject.setId(2);
    mlProject.setName("ML Algorithms Project");
    mlProject.setDescription(
        "Research in mathematical foundations of machine learning");
    mlProject.setDesiredQualifications(
        "Strong background in calculus and linear algebra");
    mlProject.setIsActive(true);
    mlProject.setMajors(Set.of(computerScience, mathematics));
    mlProject.setUmbrellaTopics(Set.of(ml));
    mlProject.setResearchPeriods(Set.of(spring25));
    mlProject.setFaculty(mathFaculty);

    // Mock service responses
    when(projectService.getProjectsByMajorId(1)).thenReturn(List.of(mlProject));
    when(projectService.getProjectsByMajorId(2)).thenReturn(List.of(mlProject));

    // Execute test
    FetcherRequest request = FetcherRequest.newBuilder()
        .setFilteredFetcher(
            FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS))
        .build();
    FetcherResponse response = projectFetcher.fetch(request);

    // Verify response structure
    assertNotNull(response);
    assertEquals(FetcherResponse.FetchedDataCase.PROJECT_HIERARCHY,
        response.getFetchedDataCase());
    var projectHierarchy = response.getProjectHierarchy();
    assertNotNull(projectHierarchy);

    // Verify Engineering discipline
    assertEquals(1, projectHierarchy.getDisciplinesCount());
    var engineeringDept = projectHierarchy.getDisciplines(0);
    assertEquals(1, engineeringDept.getDiscipline().getDisciplineId());
    assertEquals("Engineering",
        engineeringDept.getDiscipline().getDisciplineName());

    // Verify majors
    assertEquals(2, engineeringDept.getMajorsCount());

    // Verify CS major and its project
    var csMajor = engineeringDept.getMajors(0);
    assertEquals(1, csMajor.getMajor().getMajorId());
    assertEquals("Computer Science", csMajor.getMajor().getMajorName());
    assertEquals(1, csMajor.getProjectsCount());

    var csProject = csMajor.getProjects(0);
    assertProject(csProject, mlProject);

    // Verify Math major and its project
    var mathMajor = engineeringDept.getMajors(1);
    assertEquals(2, mathMajor.getMajor().getMajorId());
    assertEquals("Mathematics", mathMajor.getMajor().getMajorName());
    assertEquals(1, mathMajor.getProjectsCount());

    var mathProject = mathMajor.getProjects(0);
    assertProject(mathProject, mlProject);
  }

  @Test
  public void testFetch_projectInMultipleDisciplines_returnsCorrectHierarchy() {
    // Set up disciplines
    Discipline humanities = new Discipline("Humanities");
    humanities.setId(2);
    Discipline socialSciences = new Discipline("Social Sciences");
    socialSciences.setId(3);
    List<Discipline> disciplines = List.of(humanities, socialSciences);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    // Set up major
    Major communication = new Major();
    communication.setName("Communication");
    communication.setId(3);
    communication.setDisciplines(Set.of(humanities, socialSciences));

    // Mock major service to return the same major for both disciplines
    when(majorService.getMajorsByDisciplineId(2))
        .thenReturn(List.of(communication));
    when(majorService.getMajorsByDisciplineId(3))
        .thenReturn(List.of(communication));

    // Set up faculty
    Faculty commFaculty = new Faculty();
    commFaculty.setFirstName("Dr.");
    commFaculty.setLastName("Comm");
    commFaculty.setEmail("comm@test.com");

    // Set up topics and periods
    UmbrellaTopic socialMedia = new UmbrellaTopic();
    socialMedia.setName("Social Media");

    ResearchPeriod summer25 = new ResearchPeriod();
    summer25.setName("Summer 2025");

    // Set up project
    Project socialMediaProject = new Project();
    socialMediaProject.setId(3);
    socialMediaProject.setName("Social Media Research");
    socialMediaProject.setDescription(
        "Analysis of social media impact on community engagement");
    socialMediaProject
        .setDesiredQualifications("Experience with social media analytics");
    socialMediaProject.setIsActive(true);
    socialMediaProject.setMajors(Set.of(communication));
    socialMediaProject.setUmbrellaTopics(Set.of(socialMedia));
    socialMediaProject.setResearchPeriods(Set.of(summer25));
    socialMediaProject.setFaculty(commFaculty);

    // Mock project service
    when(projectService.getProjectsByMajorId(3))
        .thenReturn(List.of(socialMediaProject));

    // Execute test
    FetcherRequest request = FetcherRequest.newBuilder()
        .setFilteredFetcher(
            FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS))
        .build();
    FetcherResponse response = projectFetcher.fetch(request);

    // Verify response structure
    assertNotNull(response);
    assertEquals(FetcherResponse.FetchedDataCase.PROJECT_HIERARCHY,
        response.getFetchedDataCase());
    var projectHierarchy = response.getProjectHierarchy();
    assertNotNull(projectHierarchy);

    assertEquals(2, projectHierarchy.getDisciplinesCount());

    var humanitiesDept = projectHierarchy.getDisciplines(0);
    assertEquals(2, humanitiesDept.getDiscipline().getDisciplineId());
    assertEquals("Humanities",
        humanitiesDept.getDiscipline().getDisciplineName());
    assertEquals(1, humanitiesDept.getMajorsCount());

    var humanitiesCommMajor = humanitiesDept.getMajors(0);
    assertEquals(3, humanitiesCommMajor.getMajor().getMajorId());
    assertEquals("Communication",
        humanitiesCommMajor.getMajor().getMajorName());
    assertEquals(1, humanitiesCommMajor.getProjectsCount());

    var humanitiesProject = humanitiesCommMajor.getProjects(0);
    assertProject(humanitiesProject, socialMediaProject);

    var socialSciencesDept = projectHierarchy.getDisciplines(1);
    assertEquals(3, socialSciencesDept.getDiscipline().getDisciplineId());
    assertEquals("Social Sciences",
        socialSciencesDept.getDiscipline().getDisciplineName());
    assertEquals(1, socialSciencesDept.getMajorsCount());

    var socialSciencesCommMajor = socialSciencesDept.getMajors(0);
    assertEquals(3, socialSciencesCommMajor.getMajor().getMajorId());
    assertEquals("Communication",
        socialSciencesCommMajor.getMajor().getMajorName());
    assertEquals(1, socialSciencesCommMajor.getProjectsCount());

    var socialSciencesProject = socialSciencesCommMajor.getProjects(0);
    assertProject(socialSciencesProject, socialMediaProject);
  }

  // Helper method to verify project fields
  private void assertProject(ProjectProto projectProto, Project projectEntity) {
    assertEquals(projectEntity.getId(), projectProto.getProjectId());
    assertEquals(projectEntity.getName(), projectProto.getProjectName());
    assertEquals(projectEntity.getDescription(), projectProto.getDescription());
    assertEquals(projectEntity.getDesiredQualifications(),
        projectProto.getDesiredQualifications());
    assertEquals(projectEntity.getIsActive(), projectProto.getIsActive());

    // Verify collections
    assertTrue(projectProto.getMajorsList().containsAll(
        projectEntity.getMajors().stream().map(Major::getName).toList()));
    assertTrue(projectProto.getUmbrellaTopicsList().containsAll(projectEntity
        .getUmbrellaTopics().stream().map(UmbrellaTopic::getName).toList()));
    assertTrue(projectProto.getResearchPeriodsList().containsAll(projectEntity
        .getResearchPeriods().stream().map(ResearchPeriod::getName).toList()));

    // Verify faculty
    var faculty = projectProto.getFaculty();
    assertEquals(projectEntity.getFaculty().getFirstName(),
        faculty.getFirstName());
    assertEquals(projectEntity.getFaculty().getLastName(),
        faculty.getLastName());
    assertEquals(projectEntity.getFaculty().getEmail(), faculty.getEmail());
  }

  @Test
  public void testFetch_missingFetcherType_throwsException() {
    FetcherRequest invalidRequest = FetcherRequest.getDefaultInstance();

    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
      projectFetcher.fetch(invalidRequest);
    });

    assertTrue(exception.getMessage().contains(
        "Expected fetcher_type to be set, but no fetcher type was provided"));
  }
}
