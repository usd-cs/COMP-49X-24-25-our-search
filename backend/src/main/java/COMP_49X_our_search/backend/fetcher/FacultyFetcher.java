package COMP_49X_our_search.backend.fetcher;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.util.ProtoConverter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.fetcher.DataTypes.DepartmentHierarchy;
import proto.fetcher.DataTypes.DepartmentWithFaculty;
import proto.fetcher.DataTypes.FacultyWithProjects;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredType;

@Service
public class FacultyFetcher implements Fetcher {

  private final DepartmentService departmentService;
  private final FacultyService facultyService;
  private final ProjectService projectService;

  @Autowired
  public FacultyFetcher(
      DepartmentService departmentService,
      FacultyService facultyService,
      ProjectService projectService) {
    this.departmentService = departmentService;
    this.facultyService = facultyService;
    this.projectService = projectService;
  }

  @Override
  public FetcherResponse fetch(FetcherRequest request) {
    validateRequest(request);
    List<Department> departments = departmentService.getAllDepartments();

    List<DepartmentWithFaculty> departmentsWithFacultyProto =
        departments.stream().map(this::buildDepartmentWithFaculty).toList();

    return FetcherResponse.newBuilder()
        .setDepartmentHierarchy(
            DepartmentHierarchy.newBuilder().addAllDepartments(departmentsWithFacultyProto).build())
        .build();
  }

  private DepartmentWithFaculty buildDepartmentWithFaculty(Department department) {
    List<Faculty> facultyMembers = facultyService.getFacultyByDepartmentId(department.getId());

    DepartmentWithFaculty.Builder departmentBuilder =
        DepartmentWithFaculty.newBuilder()
            .setDepartment(ProtoConverter.toDepartmentProto(department));

    facultyMembers.forEach(
        faculty -> {
          List<Project> projects = projectService.getProjectsByFacultyId(faculty.getId());

          FacultyWithProjects facultyWithProjects =
              FacultyWithProjects.newBuilder()
                  .setFaculty(ProtoConverter.toFacultyProto(faculty))
                  .addAllProjects(projects.stream().map(ProtoConverter::toProjectProto).toList())
                  .build();

          departmentBuilder.addFacultyWithProjects(facultyWithProjects);
        });

    return departmentBuilder.build();
  }

  private void validateRequest(FetcherRequest request) {
    if (request.getFetcherTypeCase() == FetcherTypeCase.FETCHERTYPE_NOT_SET) {
      throw new IllegalArgumentException(
          "Expected fetcher_type to be set, but no fetcher type was provided. Valid types: filtered_fetcher");
    }
    if (request.getFetcherTypeCase() != FetcherTypeCase.FILTERED_FETCHER) {
      throw new IllegalArgumentException(
          String.format(
              "Expected fetcher_type 'filtered_fetcher', but got '%s'",
              request.getFetcherTypeCase().toString().toLowerCase()));
    }
    if (request.getFilteredFetcher().getFilteredType() != FilteredType.FILTERED_TYPE_FACULTY) {
      throw new IllegalArgumentException(
          String.format(
              "Expected filtered_type '%s', but got '%s'",
              FilteredType.FILTERED_TYPE_FACULTY,
              request.getFilteredFetcher().getFilteredType().toString()));
    }
  }
}
