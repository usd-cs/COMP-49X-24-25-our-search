package COMP_49X_our_search.backend.fetcher;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.StudentService;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.DisciplineProto;
import proto.data.Entities.MajorProto;
import proto.data.Entities.StudentProto;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.DataTypes.StudentCollection;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;

public class StudentFetcherTest {
  private StudentFetcher studentFetcher;
  private DisciplineService disciplineService;
  private MajorService majorService;
  private StudentService studentService;

  @BeforeEach
  void setUp() {
    disciplineService = mock(DisciplineService.class);
    majorService = mock(MajorService.class);
    studentService = mock(StudentService.class);
    studentFetcher = new StudentFetcher(disciplineService, majorService, studentService);
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

    ResearchPeriod fall25 = new ResearchPeriod();
    fall25.setName("Fall 2025");

    Student student = new Student();
    student.setId(1);
    student.setFirstName("First");
    student.setLastName("Last");
    student.setEmail("flast@test.com");
    student.setUndergradYear(1);
    student.setGraduationYear(2028);
    student.setInterestReason("Test reason");
    student.setHasPriorExperience(false);
    student.setIsActive(true);
    // student.setDisciplines(Set.of(engineering));
    student.setResearchPeriods(Set.of(fall25));
    student.setMajors(Set.of(computerScience));
    student.setResearchFieldInterests(Set.of(computerScience));

    List<Student> students = List.of(student);
    when(studentService.getStudentsByMajorId(0)).thenReturn(students);

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_STUDENTS))
            .build();
    FetcherResponse response = studentFetcher.fetch(request);

    assertNotNull(response);
  }

  @Test
  public void testFetch_studentWithMultipleMajors_returnsCorrectHierarchy() {
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

    ResearchPeriod spring25 = new ResearchPeriod();
    spring25.setName("Spring 2025");

    Student student = new Student();
    student.setId(1);
    student.setFirstName("First");
    student.setLastName("Last");
    student.setEmail("flast@test.com");
    student.setUndergradYear(1);
    student.setGraduationYear(2028);
    student.setInterestReason("Test reason");
    student.setHasPriorExperience(false);
    student.setIsActive(true);
    // student.setDisciplines(Set.of(engineering));
    student.setResearchPeriods(Set.of(spring25));
    student.setMajors(Set.of(computerScience, mathematics));
    student.setResearchFieldInterests(Set.of(computerScience, mathematics));

    when(studentService.getStudentsByMajorId(1)).thenReturn(List.of(student));
    when(studentService.getStudentsByMajorId(2)).thenReturn(List.of(student));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_STUDENTS))
            .build();
    FetcherResponse response = studentFetcher.fetch(request);

    StudentProto multiMajorStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Freshman")
            .setGraduationYear(2028)
            .setHasPriorExperience(false)
            .setIsActive(true)
            .setInterestReason("Test reason")
            .addResearchPeriodsInterests("Spring 2025")
            .addAllMajors(List.of("Computer Science", "Mathematics"))
            .addAllResearchFieldInterests(List.of("Computer Science", "Mathematics"))
            .build();

    ProjectHierarchy expectedHierarchy =
        ProjectHierarchy.newBuilder()
            .addDisciplines(
                DisciplineWithMajors.newBuilder()
                    .setDiscipline(
                        DisciplineProto.newBuilder()
                            .setDisciplineName("Engineering")
                            .setDisciplineId(1))
                    .addMajors(
                        MajorWithEntityCollection.newBuilder()
                            .setMajor(
                                MajorProto.newBuilder()
                                    .setMajorName("Computer Science")
                                    .setMajorId(1))
                            .setStudentCollection(
                                StudentCollection.newBuilder().addStudents(multiMajorStudent)))
                    .addMajors(
                        MajorWithEntityCollection.newBuilder()
                            .setMajor(
                                MajorProto.newBuilder().setMajorName("Mathematics").setMajorId(2))
                            .setStudentCollection(
                                StudentCollection.newBuilder().addStudents(multiMajorStudent))))
            .build();

    assertThat(expectedHierarchy).isEqualTo(response.getProjectHierarchy());
  }

  @Test
  public void testFetch_studentInMultipleDisciplines_returnsCorrectHierarchy() {
    Discipline humanities = new Discipline("Humanities");
    humanities.setId(1);
    Discipline socialSciences = new Discipline("Social Sciences");
    socialSciences.setId(2);
    List<Discipline> disciplines = List.of(humanities, socialSciences);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    Major communication = new Major();
    communication.setName("Communication");
    communication.setId(1);
    communication.setDisciplines(Set.of(humanities, socialSciences));

    ResearchPeriod spring25 = new ResearchPeriod();
    spring25.setName("Spring 2025");

    Student student = new Student();
    student.setId(1);
    student.setFirstName("First");
    student.setLastName("Last");
    student.setEmail("flast@test.com");
    student.setUndergradYear(1);
    student.setGraduationYear(2028);
    student.setInterestReason("Test reason");
    student.setHasPriorExperience(false);
    student.setIsActive(true);
    // student.setDisciplines(Set.of(engineering));
    student.setResearchPeriods(Set.of(spring25));
    student.setMajors(Set.of(communication));
    student.setResearchFieldInterests(Set.of(communication));

    when(majorService.getMajorsByDisciplineId(1)).thenReturn(List.of(communication));
    when(majorService.getMajorsByDisciplineId(2)).thenReturn(List.of(communication));

    when(studentService.getStudentsByMajorId(1)).thenReturn(List.of(student));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_STUDENTS))
            .build();
    FetcherResponse response = studentFetcher.fetch(request);

    StudentProto multiMajorStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Freshman")
            .setGraduationYear(2028)
            .setHasPriorExperience(false)
            .setIsActive(true)
            .setInterestReason("Test reason")
            .addResearchPeriodsInterests("Spring 2025")
            .addAllMajors(List.of("Communication"))
            .addAllResearchFieldInterests(List.of("Communication"))
            .build();

    ProjectHierarchy expectedHierarchy =
        ProjectHierarchy.newBuilder()
            .addDisciplines(
                DisciplineWithMajors.newBuilder()
                    .setDiscipline(
                        DisciplineProto.newBuilder()
                            .setDisciplineName("Humanities")
                            .setDisciplineId(1))
                    .addMajors(
                        MajorWithEntityCollection.newBuilder()
                            .setMajor(
                                MajorProto.newBuilder().setMajorName("Communication").setMajorId(1))
                            .setStudentCollection(
                                StudentCollection.newBuilder().addStudents(multiMajorStudent))))
            .addDisciplines(
                DisciplineWithMajors.newBuilder()
                    .setDiscipline(
                        DisciplineProto.newBuilder()
                            .setDisciplineName("Social Sciences")
                            .setDisciplineId(2))
                    .addMajors(
                        MajorWithEntityCollection.newBuilder()
                            .setMajor(
                                MajorProto.newBuilder().setMajorName("Communication").setMajorId(1))
                            .setStudentCollection(
                                StudentCollection.newBuilder().addStudents(multiMajorStudent))))
            .build();

    assertThat(expectedHierarchy).isEqualTo(response.getProjectHierarchy());
  }

  @Test
  public void testFetch_studentNotMajoringInResearchFieldInterest_returnsCorrectHierarchy() {
    Discipline engineering = new Discipline("Engineering");
    engineering.setId(1);
    Discipline lifeSciences = new Discipline("Life Sciences");
    lifeSciences.setId(2);
    List<Discipline> disciplines = List.of(engineering, lifeSciences);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    Major computerScience = new Major();
    computerScience.setName("Computer Science");
    computerScience.setId(1);
    computerScience.setDisciplines(Set.of(engineering));

    Major physics = new Major();
    physics.setName("Physics");
    physics.setId(2);
    physics.setDisciplines(Set.of(lifeSciences));

    ResearchPeriod spring25 = new ResearchPeriod();
    spring25.setName("Spring 2025");

    Student student = new Student();
    student.setId(1);
    student.setFirstName("First");
    student.setLastName("Last");
    student.setEmail("flast@test.com");
    student.setUndergradYear(1);
    student.setGraduationYear(2028);
    student.setInterestReason("Test reason");
    student.setHasPriorExperience(false);
    student.setIsActive(true);
    // student.setDisciplines(Set.of(engineering));
    student.setResearchPeriods(Set.of(spring25));
    student.setMajors(Set.of(computerScience));
    // Interested in physics but not majoring in physics
    student.setResearchFieldInterests(Set.of(physics));

    when(majorService.getMajorsByDisciplineId(1)).thenReturn(List.of(computerScience));
    when(majorService.getMajorsByDisciplineId(2)).thenReturn(List.of(physics));

    when(studentService.getStudentsByMajorId(1)).thenReturn(List.of(student));
    when(studentService.getStudentsByResearchFieldInterestId(2)).thenReturn((List.of(student)));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_STUDENTS))
            .build();
    FetcherResponse response = studentFetcher.fetch(request);

    StudentProto differentInterestStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Freshman")
            .setGraduationYear(2028)
            .setHasPriorExperience(false)
            .setIsActive(true)
            .setInterestReason("Test reason")
            .addResearchPeriodsInterests("Spring 2025")
            .addAllMajors(List.of("Computer Science"))
            .addAllResearchFieldInterests(List.of("Physics"))
            .build();

    ProjectHierarchy expectedHierarchy =
        ProjectHierarchy.newBuilder()
            .addDisciplines(
                DisciplineWithMajors.newBuilder()
                    .setDiscipline(
                        DisciplineProto.newBuilder()
                            .setDisciplineName("Engineering")
                            .setDisciplineId(1))
                    .addMajors(
                        MajorWithEntityCollection.newBuilder()
                            .setMajor(
                                MajorProto.newBuilder().setMajorName("Computer Science").setMajorId(1))
                            .setStudentCollection(
                                StudentCollection.newBuilder().addStudents(differentInterestStudent))))
            .addDisciplines(
                DisciplineWithMajors.newBuilder()
                    .setDiscipline(
                        DisciplineProto.newBuilder()
                            .setDisciplineName("Life Sciences")
                            .setDisciplineId(2))
                    .addMajors(
                        MajorWithEntityCollection.newBuilder()
                            .setMajor(
                                MajorProto.newBuilder().setMajorName("Physics").setMajorId(2))
                            .setStudentCollection(
                                StudentCollection.newBuilder().addStudents(differentInterestStudent))))
            .build();

    assertThat(expectedHierarchy).isEqualTo(response.getProjectHierarchy());
  }

  @Test
  public void testFetch_inactiveStudent_returnsExpectedResult() {
    Discipline engineering = new Discipline("Engineering");
    engineering.setId(1);
    List<Discipline> disciplines = List.of(engineering);
    when(disciplineService.getAllDisciplines()).thenReturn(disciplines);

    // Set up majors
    Major computerScience = new Major();
    computerScience.setName("Computer Science");
    computerScience.setId(1);

    List<Major> engineeringMajors = List.of(computerScience);
    when(majorService.getMajorsByDisciplineId(1)).thenReturn(engineeringMajors);

    ResearchPeriod spring25 = new ResearchPeriod();
    spring25.setName("Spring 2025");

    Student student = new Student();
    student.setId(1);
    student.setFirstName("First");
    student.setLastName("Last");
    student.setEmail("flast@test.com");
    student.setUndergradYear(1);
    student.setGraduationYear(2028);
    student.setInterestReason("Test reason");
    student.setHasPriorExperience(false);
    student.setIsActive(false);
    // student.setDisciplines(Set.of(engineering));
    student.setResearchPeriods(Set.of(spring25));
    student.setMajors(Set.of(computerScience));
    student.setResearchFieldInterests(Set.of(computerScience));

    when(studentService.getStudentsByMajorId(1)).thenReturn(List.of(student));
    when(studentService.getStudentsByMajorId(2)).thenReturn(List.of(student));

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_STUDENTS))
            .build();
    FetcherResponse response = studentFetcher.fetch(request);

    StudentProto inactiveStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Freshman")
            .setGraduationYear(2028)
            .setHasPriorExperience(false)
            .setIsActive(true)
            .setInterestReason("Test reason")
            .addResearchPeriodsInterests("Spring 2025")
            .addAllMajors(List.of("Computer Science"))
            .addAllResearchFieldInterests(List.of("Computer Science"))
            .build();

    ProjectHierarchy expectedHierarchy =
        ProjectHierarchy.newBuilder()
            .addDisciplines(
                DisciplineWithMajors.newBuilder()
                    .setDiscipline(
                        DisciplineProto.newBuilder()
                            .setDisciplineName("Engineering")
                            .setDisciplineId(1))
                    .addMajors(
                        MajorWithEntityCollection.newBuilder()
                            .setMajor(
                                MajorProto.newBuilder()
                                    .setMajorName("Computer Science")
                                    .setMajorId(1))
                            .setStudentCollection(
                                StudentCollection.getDefaultInstance())))
            .build();

    assertThat(expectedHierarchy).isEqualTo(response.getProjectHierarchy());
  }

  @Test
  public void testFetch_missingFetcherType_throwsException() {
    FetcherRequest invalidRequest = FetcherRequest.getDefaultInstance();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              studentFetcher.fetch(invalidRequest);
            });

    assertTrue(
        exception
            .getMessage()
            .contains("Expected fetcher_type to be set, but no fetcher type was provided"));
  }

  @Test
  public void testFetch_invalidFetcherType_throwsException() {
    FetcherRequest request =
        FetcherRequest.newBuilder().setDirectFetcher(DirectFetcher.getDefaultInstance()).build();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              studentFetcher.fetch(request);
            });

    assertTrue(
        exception
            .getMessage()
            .contains("Expected fetcher_type 'filtered_fetcher', but got 'direct_fetcher'"));
  }

  @Test
  public void testFetch_invalidFilteredType_throwsException() {
    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder().setFilteredType(FilteredType.FILTERED_TYPE_PROJECTS))
            .build();
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              studentFetcher.fetch(request);
            });

    assertTrue(exception.getMessage().contains("Expected filtered_type 'FILTERED_TYPE_STUDENTS', but got 'FILTERED_TYPE_PROJECTS'"));
  }
}
