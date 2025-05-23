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
import proto.fetcher.DataTypes.ProjectCollection;
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
    projectFetcher = new ProjectFetcher(disciplineService, majorService, projectService);
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
    faculty.setId(1);
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
    mathFaculty.setId(1);
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
    mlProject.setDescription("Research in mathematical foundations of machine learning");
    mlProject.setDesiredQualifications("Strong background in calculus and linear algebra");
    mlProject.setIsActive(true);
    mlProject.setMajors(Set.of(computerScience, mathematics));
    mlProject.setUmbrellaTopics(Set.of(ml));
    mlProject.setResearchPeriods(Set.of(spring25));
    mlProject.setFaculty(mathFaculty);

    // Mock service responses
    when(projectService.getProjectsByMajorId(1)).thenReturn(List.of(mlProject));
    when(projectService.getProjectsByMajorId(2)).thenReturn(List.of(mlProject));

    // Execute test
    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS))
            .build();
    FetcherResponse response = projectFetcher.fetch(request);

    // Verify response structure
    assertNotNull(response);
    assertEquals(FetcherResponse.FetchedDataCase.PROJECT_HIERARCHY, response.getFetchedDataCase());
    var projectHierarchy = response.getProjectHierarchy();
    assertNotNull(projectHierarchy);

    // Verify Engineering discipline
    assertEquals(1, projectHierarchy.getDisciplinesCount());
    var engineeringDept = projectHierarchy.getDisciplines(0);
    assertEquals(1, engineeringDept.getDiscipline().getDisciplineId());
    assertEquals("Engineering", engineeringDept.getDiscipline().getDisciplineName());

    // Verify majors
    assertEquals(2, engineeringDept.getMajorsCount());

    // Verify CS major and its project
    var csMajor = engineeringDept.getMajors(0);
    assertEquals(1, csMajor.getMajor().getMajorId());
    assertEquals("Computer Science", csMajor.getMajor().getMajorName());
    assertEquals(1, csMajor.getProjectCollection().getProjectsCount());

    var csProject = csMajor.getProjectCollection().getProjects(0);
    assertProject(csProject, mlProject);

    // Verify Math major and its project
    var mathMajor = engineeringDept.getMajors(1);
    assertEquals(2, mathMajor.getMajor().getMajorId());
    assertEquals("Mathematics", mathMajor.getMajor().getMajorName());
    assertEquals(1, mathMajor.getProjectCollection().getProjectsCount());

    var mathProject = mathMajor.getProjectCollection().getProjects(0);
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
    when(majorService.getMajorsByDisciplineId(2)).thenReturn(List.of(communication));
    when(majorService.getMajorsByDisciplineId(3)).thenReturn(List.of(communication));

    // Set up faculty
    Faculty commFaculty = new Faculty();
    commFaculty.setId(1);
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
    socialMediaProject.setDescription("Analysis of social media impact on community engagement");
    socialMediaProject.setDesiredQualifications("Experience with social media analytics");
    socialMediaProject.setIsActive(true);
    socialMediaProject.setMajors(Set.of(communication));
    socialMediaProject.setUmbrellaTopics(Set.of(socialMedia));
    socialMediaProject.setResearchPeriods(Set.of(summer25));
    socialMediaProject.setFaculty(commFaculty);

    // Mock project service
    when(projectService.getProjectsByMajorId(3)).thenReturn(List.of(socialMediaProject));

    // Execute test
    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS))
            .build();
    FetcherResponse response = projectFetcher.fetch(request);

    // Verify response structure
    assertNotNull(response);
    assertEquals(FetcherResponse.FetchedDataCase.PROJECT_HIERARCHY, response.getFetchedDataCase());
    var projectHierarchy = response.getProjectHierarchy();
    assertNotNull(projectHierarchy);

    assertEquals(2, projectHierarchy.getDisciplinesCount());

    var humanitiesDept = projectHierarchy.getDisciplines(0);
    assertEquals(2, humanitiesDept.getDiscipline().getDisciplineId());
    assertEquals("Humanities", humanitiesDept.getDiscipline().getDisciplineName());
    assertEquals(1, humanitiesDept.getMajorsCount());

    var humanitiesCommMajor = humanitiesDept.getMajors(0);
    assertEquals(3, humanitiesCommMajor.getMajor().getMajorId());
    assertEquals("Communication", humanitiesCommMajor.getMajor().getMajorName());
    assertEquals(1, humanitiesCommMajor.getProjectCollection().getProjectsCount());

    var humanitiesProject = humanitiesCommMajor.getProjectCollection().getProjects(0);
    assertProject(humanitiesProject, socialMediaProject);

    var socialSciencesDept = projectHierarchy.getDisciplines(1);
    assertEquals(3, socialSciencesDept.getDiscipline().getDisciplineId());
    assertEquals("Social Sciences", socialSciencesDept.getDiscipline().getDisciplineName());
    assertEquals(1, socialSciencesDept.getMajorsCount());

    var socialSciencesCommMajor = socialSciencesDept.getMajors(0);
    assertEquals(3, socialSciencesCommMajor.getMajor().getMajorId());
    assertEquals("Communication", socialSciencesCommMajor.getMajor().getMajorName());
    assertEquals(1, socialSciencesCommMajor.getProjectCollection().getProjectsCount());

    var socialSciencesProject = socialSciencesCommMajor.getProjectCollection().getProjects(0);
    assertProject(socialSciencesProject, socialMediaProject);
  }

  // Helper method to verify project fields
  private void assertProject(ProjectProto projectProto, Project projectEntity) {
    assertEquals(projectEntity.getId(), projectProto.getProjectId());
    assertEquals(projectEntity.getName(), projectProto.getProjectName());
    assertEquals(projectEntity.getDescription(), projectProto.getDescription());
    assertEquals(projectEntity.getDesiredQualifications(), projectProto.getDesiredQualifications());
    assertEquals(projectEntity.getIsActive(), projectProto.getIsActive());

    // Verify collections
    assertTrue(
        projectProto
            .getMajorsList()
            .containsAll(projectEntity.getMajors().stream().map(Major::getName).toList()));
    assertTrue(
        projectProto
            .getUmbrellaTopicsList()
            .containsAll(
                projectEntity.getUmbrellaTopics().stream().map(UmbrellaTopic::getName).toList()));
    assertTrue(
        projectProto
            .getResearchPeriodsList()
            .containsAll(
                projectEntity.getResearchPeriods().stream().map(ResearchPeriod::getName).toList()));

    // Verify faculty
    var faculty = projectProto.getFaculty();
    assertEquals(projectEntity.getFaculty().getFirstName(), faculty.getFirstName());
    assertEquals(projectEntity.getFaculty().getLastName(), faculty.getLastName());
    assertEquals(projectEntity.getFaculty().getEmail(), faculty.getEmail());
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

  @Test
  public void testFetch_filtersByMajorId() {
    Discipline engineering = new Discipline("Engineering");
    engineering.setId(0);
    when(disciplineService.getAllDisciplines()).thenReturn(List.of(engineering));

    Major cs = new Major();
    cs.setId(101);
    cs.setName("CS");
    when(majorService.getMajorsByDisciplineId(0)).thenReturn(List.of(cs));

    Faculty f = new Faculty();
    f.setId(1);
    f.setFirstName("First");
    f.setLastName("Last");
    f.setEmail("flast@test.com");

    Project csProject = new Project();
    csProject.setId(1);
    csProject.setName("AI Research");
    csProject.setDescription("AI and ML");
    csProject.setDesiredQualifications("Python");
    csProject.setIsActive(true);
    csProject.setMajors(Set.of(cs));
    csProject.setFaculty(f);

    when(projectService.getProjectsByMajorId(101)).thenReturn(List.of(csProject));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder()
                    .setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS)
                    .addMajorIds(101))
            .build();

    FetcherResponse response = projectFetcher.fetch(request);
    var projects =
        response
            .getProjectHierarchy()
            .getDisciplines(0)
            .getMajors(0)
            .getProjectCollection()
            .getProjectsList();
    assertEquals(1, projects.size());
    assertEquals("AI Research", projects.get(0).getProjectName());
  }

  @Test
  public void testFetch_filtersByResearchPeriodId() {
    ResearchPeriod rp = new ResearchPeriod();
    rp.setId(202);
    rp.setName("Spring");

    Discipline d = new Discipline("Engineering");
    d.setId(0);
    Major m = new Major();
    m.setId(1);
    m.setName("EE");

    Faculty f = new Faculty();
    f.setId(1);
    f.setFirstName("First");
    f.setLastName("Last");
    f.setEmail("flast@test.com");

    Project p = new Project();
    p.setId(1);
    p.setName("Circuits");
    p.setDescription("Test description");
    p.setDesiredQualifications("Test qualifications");
    p.setResearchPeriods(Set.of(rp));
    p.setMajors(Set.of(m));
    p.setIsActive(true);
    p.setFaculty(f);

    when(disciplineService.getAllDisciplines()).thenReturn(List.of(d));
    when(majorService.getMajorsByDisciplineId(0)).thenReturn(List.of(m));
    when(projectService.getProjectsByMajorId(1)).thenReturn(List.of(p));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder()
                    .setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS)
                    .addResearchPeriodIds(202))
            .build();

    FetcherResponse response = projectFetcher.fetch(request);
    var projectList =
        response
            .getProjectHierarchy()
            .getDisciplines(0)
            .getMajors(0)
            .getProjectCollection()
            .getProjectsList();
    assertEquals(1, projectList.size());
    assertEquals("Circuits", projectList.get(0).getProjectName());
  }

  @Test
  public void testFetch_filtersByUmbrellaTopicId() {
    UmbrellaTopic topic = new UmbrellaTopic();
    topic.setId(301);
    topic.setName("Robotics");

    Discipline d = new Discipline("Engineering");
    d.setId(0);
    Major m = new Major();
    m.setId(1);
    m.setName("ME");

    Faculty f = new Faculty();
    f.setId(1);
    f.setFirstName("First");
    f.setLastName("Last");
    f.setEmail("flast@test.com");

    Project p = new Project();
    p.setId(1);
    p.setName("Autonomous Bots");
    p.setDescription("Test description");
    p.setDesiredQualifications("Test qualifications");
    p.setUmbrellaTopics(Set.of(topic));
    p.setMajors(Set.of(m));
    p.setIsActive(true);
    p.setFaculty(f);

    when(disciplineService.getAllDisciplines()).thenReturn(List.of(d));
    when(majorService.getMajorsByDisciplineId(0)).thenReturn(List.of(m));
    when(projectService.getProjectsByMajorId(1)).thenReturn(List.of(p));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder()
                    .setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS)
                    .addUmbrellaTopicIds(301))
            .build();

    FetcherResponse response = projectFetcher.fetch(request);
    var projectList =
        response
            .getProjectHierarchy()
            .getDisciplines(0)
            .getMajors(0)
            .getProjectCollection()
            .getProjectsList();
    assertEquals(1, projectList.size());
    assertEquals("Autonomous Bots", projectList.get(0).getProjectName());
  }

  @Test
  public void testFetch_filtersByKeywords() {
    Discipline d = new Discipline("Engineering");
    d.setId(0);
    Major m = new Major();
    m.setId(1);
    m.setName("CS");

    Faculty f = new Faculty();
    f.setId(1);
    f.setFirstName("First");
    f.setLastName("Last");
    f.setEmail("flast@test.com");

    Project p = new Project();
    p.setId(1);
    p.setName("Quantum AI");
    p.setDescription("Quantum computing and AI research");
    p.setDesiredQualifications("Quantum Mechanics, ML");
    p.setIsActive(true);
    p.setMajors(Set.of(m));
    p.setFaculty(f);

    when(disciplineService.getAllDisciplines()).thenReturn(List.of(d));
    when(majorService.getMajorsByDisciplineId(0)).thenReturn(List.of(m));
    when(projectService.getProjectsByMajorId(1)).thenReturn(List.of(p));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder()
                    .setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS)
                    .setKeywords("quantum AI"))
            .build();

    FetcherResponse response = projectFetcher.fetch(request);
    List<ProjectProto> projectList =
        response
            .getProjectHierarchy()
            .getDisciplines(0)
            .getMajors(0)
            .getProjectCollection()
            .getProjectsList();
    assertEquals(1, projectList.size());
    assertEquals("Quantum AI", projectList.get(0).getProjectName());
  }
}
