package COMP_49X_our_search.backend.fetcher;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.DepartmentProto;
import proto.data.Entities.FacultyProto;
import proto.fetcher.DataTypes.DepartmentHierarchy;
import proto.fetcher.DataTypes.DepartmentWithFaculty;
import proto.fetcher.DataTypes.FacultyWithProjects;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;

public class FacultyFetcherTest {
  private FacultyFetcher facultyFetcher;
  private DepartmentService departmentService;
  private FacultyService facultyService;
  private ProjectService projectService;

  @BeforeEach
  void setUp() {
    departmentService = mock(DepartmentService.class);
    facultyService = mock(FacultyService.class);
    projectService = mock(ProjectService.class);
    facultyFetcher = new FacultyFetcher(departmentService, facultyService, projectService);
  }

  @Test
  public void testFetch_validRequest_returnsExpectedResponse() {
    Department engineering = new Department("Engineering");
    engineering.setId(1);
    Department lifeAndPhysicalSciences = new Department("Life and Physical Sciences");
    lifeAndPhysicalSciences.setId(2);

    List<Department> departments = List.of(engineering, lifeAndPhysicalSciences);
    when(departmentService.getAllDepartments()).thenReturn(departments);

    Faculty engineeringFaculty = new Faculty();
    engineeringFaculty.setId(1);
    engineeringFaculty.setFirstName("John");
    engineeringFaculty.setLastName("Smith");
    engineeringFaculty.setEmail("jsmith@test.com");
    engineeringFaculty.setDepartments(Set.of(engineering));

    Faculty sciencesFaculty = new Faculty();
    sciencesFaculty.setId(2);
    sciencesFaculty.setFirstName("Jane");
    sciencesFaculty.setLastName("Doe");
    sciencesFaculty.setEmail("jdoe@test.com");
    sciencesFaculty.setDepartments(Set.of(lifeAndPhysicalSciences));

    when(facultyService.getFacultyByDepartmentId(engineering.getId()))
        .thenReturn(List.of(engineeringFaculty));
    when(facultyService.getFacultyByDepartmentId(lifeAndPhysicalSciences.getId()))
        .thenReturn(List.of(sciencesFaculty));

    when(projectService.getProjectsByFacultyId(engineeringFaculty.getId())).thenReturn(List.of());
    when(projectService.getProjectsByFacultyId(sciencesFaculty.getId())).thenReturn(List.of());

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder()
                    .setFilteredType(FilteredType.FILTERED_TYPE_FACULTY)
                    .build())
            .build();

    FacultyProto engineeringFacultyProto =
        FacultyProto.newBuilder()
            .setFacultyId(1)
            .setFirstName("John")
            .setLastName("Smith")
            .setEmail("jsmith@test.com")
            .addAllDepartments(List.of("Engineering"))
            .build();

    FacultyProto sciencesFacultyProto =
        FacultyProto.newBuilder()
            .setFacultyId(2)
            .setFirstName("Jane")
            .setLastName("Doe")
            .setEmail("jdoe@test.com")
            .addAllDepartments(List.of("Life and Physical Sciences"))
            .build();

    DepartmentProto engineeringProto =
        DepartmentProto.newBuilder().setDepartmentId(1).setDepartmentName("Engineering").build();

    DepartmentProto sciencesProto =
        DepartmentProto.newBuilder()
            .setDepartmentId(2)
            .setDepartmentName("Life and Physical Sciences")
            .build();

    FacultyWithProjects engineeringFacultyWithProjects =
        FacultyWithProjects.newBuilder().setFaculty(engineeringFacultyProto).build();

    FacultyWithProjects sciencesFacultyWithProjects =
        FacultyWithProjects.newBuilder().setFaculty(sciencesFacultyProto).build();

    DepartmentWithFaculty engineeringWithFaculty =
        DepartmentWithFaculty.newBuilder()
            .setDepartment(engineeringProto)
            .addFacultyWithProjects(engineeringFacultyWithProjects)
            .build();

    DepartmentWithFaculty sciencesWithFaculty =
        DepartmentWithFaculty.newBuilder()
            .setDepartment(sciencesProto)
            .addFacultyWithProjects(sciencesFacultyWithProjects)
            .build();

    FetcherResponse expectedResponse =
        FetcherResponse.newBuilder()
            .setDepartmentHierarchy(
                DepartmentHierarchy.newBuilder()
                    .addDepartments(engineeringWithFaculty)
                    .addDepartments(sciencesWithFaculty)
                    .build())
            .build();

    FetcherResponse actualResponse = facultyFetcher.fetch(request);

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  public void testFetch_facultyInMultipleDepartments_returnsExpectedResponse() {
    Department engineering = new Department("Engineering");
    engineering.setId(1);
    Department lifeAndPhysicalSciences = new Department("Life and Physical Sciences");
    lifeAndPhysicalSciences.setId(2);

    List<Department> departments = List.of(engineering, lifeAndPhysicalSciences);
    when(departmentService.getAllDepartments()).thenReturn(departments);

    Faculty multiDepartmentFaculty = new Faculty();
    multiDepartmentFaculty.setId(1);
    multiDepartmentFaculty.setFirstName("First");
    multiDepartmentFaculty.setLastName("Last");
    multiDepartmentFaculty.setEmail("flast@test.com");
    multiDepartmentFaculty.setDepartments(Set.of(engineering, lifeAndPhysicalSciences));

    when(facultyService.getFacultyByDepartmentId(engineering.getId()))
        .thenReturn(List.of(multiDepartmentFaculty));
    when(facultyService.getFacultyByDepartmentId(lifeAndPhysicalSciences.getId()))
        .thenReturn(List.of(multiDepartmentFaculty));

    when(projectService.getProjectsByFacultyId(multiDepartmentFaculty.getId()))
        .thenReturn(List.of());

    FetcherRequest request =
        FetcherRequest.newBuilder()
            .setFilteredFetcher(
                FilteredFetcher.newBuilder()
                    .setFilteredType(FilteredType.FILTERED_TYPE_FACULTY)
                    .build())
            .build();

    FacultyProto expectedFacultyProto =
        FacultyProto.newBuilder()
            .setFacultyId(1)
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .addAllDepartments(List.of("Engineering", "Life and Physical Sciences"))
            .build();

    FacultyWithProjects facultyWithProjects =
        FacultyWithProjects.newBuilder().setFaculty(expectedFacultyProto).build();

    DepartmentProto engineeringProto =
        DepartmentProto.newBuilder().setDepartmentId(1).setDepartmentName("Engineering").build();

    DepartmentProto sciencesProto =
        DepartmentProto.newBuilder()
            .setDepartmentId(2)
            .setDepartmentName("Life and Physical Sciences")
            .build();

    DepartmentWithFaculty engineeringWithFaculty =
        DepartmentWithFaculty.newBuilder()
            .setDepartment(engineeringProto)
            .addFacultyWithProjects(facultyWithProjects)
            .build();

    DepartmentWithFaculty sciencesWithFaculty =
        DepartmentWithFaculty.newBuilder()
            .setDepartment(sciencesProto)
            .addFacultyWithProjects(facultyWithProjects)
            .build();

    FetcherResponse expectedResponse =
        FetcherResponse.newBuilder()
            .setDepartmentHierarchy(
                DepartmentHierarchy.newBuilder()
                    .addDepartments(engineeringWithFaculty)
                    .addDepartments(sciencesWithFaculty)
                    .build())
            .build();

    FetcherResponse actualResponse = facultyFetcher.fetch(request);

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  public void testFetch_missingFetcherType_throwsException() {
    FetcherRequest invalidRequest = FetcherRequest.getDefaultInstance();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              facultyFetcher.fetch(invalidRequest);
            });

    assertTrue(
        exception
            .getMessage()
            .contains("Expected fetcher_type to be set, but no fetcher type was provided"));
  }
}
