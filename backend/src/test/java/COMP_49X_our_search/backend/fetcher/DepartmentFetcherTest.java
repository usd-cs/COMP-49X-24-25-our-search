package COMP_49X_our_search.backend.fetcher;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.fetcher.FetcherModule.DirectFetcher;
import proto.fetcher.FetcherModule.DirectType;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherResponse;

public class DepartmentFetcherTest {
  private DepartmentFetcher departmentFetcher;
  private DepartmentService departmentService;

  @BeforeEach
  void setUp() {
    departmentService = mock(DepartmentService.class);
    departmentFetcher = new DepartmentFetcher(departmentService);
  }

  @Test
  public void testFetch_validRequest_returnsExpectedResponse() {
    Department engineering = new Department("Engineering");
    engineering.setId(0);
    Department lifeSciences = new Department("Life Sciences");
    lifeSciences.setId(1);
    List<Department> departments = Arrays.asList(engineering, lifeSciences);
    when(departmentService.getAllDepartments()).thenReturn(departments);

    FetcherRequest request = FetcherRequest.newBuilder()
        .setDirectFetcher(
            DirectFetcher.newBuilder().setDirectType(DirectType.DEPARTMENTS))
        .build();
    FetcherResponse response = departmentFetcher.fetch(request);

    assertNotNull(response);
    assertEquals(2, response.getDepartmentCollection().getDepartmentsCount());
    assertEquals("Engineering", response.getDepartmentCollection()
        .getDepartments(0).getDepartmentName());
    assertEquals("Life Sciences", response.getDepartmentCollection()
        .getDepartments(1).getDepartmentName());
  }

  @Test
  public void testFetch_missingFetcherType_throwsException() {
    FetcherRequest invalidRequest = FetcherRequest.getDefaultInstance();

    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
      departmentFetcher.fetch(invalidRequest);
    });

    assertTrue(exception.getMessage().contains(
        "Expected fetcher_type to be set, but no fetcher type was provided"));
  }
}
