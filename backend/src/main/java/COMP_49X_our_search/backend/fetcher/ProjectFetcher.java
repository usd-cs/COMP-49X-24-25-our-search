package COMP_49X_our_search.backend.fetcher;

import static COMP_49X_our_search.backend.util.ProtoConverter.toDepartmentProto;
import static COMP_49X_our_search.backend.util.ProtoConverter.toMajorProto;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.util.ProtoConverter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.fetcher.DataTypes.DepartmentWithMajors;
import proto.fetcher.DataTypes.MajorWithProjects;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;

@Service
public class ProjectFetcher implements Fetcher {

  private final DepartmentService departmentService;
  private final MajorService majorService;
  private final ProjectService projectService;

  @Autowired
  public ProjectFetcher(DepartmentService departmentService,
      MajorService majorService, ProjectService projectService) {
    this.departmentService = departmentService;
    this.majorService = majorService;
    this.projectService = projectService;
  }

  @Override
  public FetcherResponse fetch(FetcherRequest request) {
    validateRequest(request);
    List<Department> departments = departmentService.getAllDepartments();

    List<DepartmentWithMajors> departmentsWithMajors =
        departments.stream().map(this::buildDepartmentWithMajors).toList();

    return FetcherResponse.newBuilder().setProjectHierarchy(ProjectHierarchy
        .newBuilder().addAllDepartments(departmentsWithMajors).build()).build();
  }

  private DepartmentWithMajors buildDepartmentWithMajors(
      Department department) {
    List<Major> majors =
        majorService.getMajorsByDepartmentId(department.getId());
    return DepartmentWithMajors.newBuilder()
        .setDepartment(toDepartmentProto(department))
        .addAllMajors(majors.stream()
            .map(major -> buildMajorWithProjects(major, department.getId()))
            .toList())
        .build();
  }

  private MajorWithProjects buildMajorWithProjects(Major major,
      Integer departmentId) {
    List<Project> projects = projectService.getProjectsByMajorId(major.getId());

    return MajorWithProjects.newBuilder().setMajor(toMajorProto(major))
        .addAllProjects(
            projects.stream().map(ProtoConverter::toProjectProto).toList())
        .build();
  }

  private void validateRequest(FetcherRequest request) {
    if (request.getFetcherTypeCase() == FetcherTypeCase.FETCHERTYPE_NOT_SET) {
      throw new IllegalArgumentException(String.format(
          "Expected fetcher_type to be set, but no fetcher type was provided. Valid types: %s",
          "filtered_fetcher"));
    }
    if (request.getFetcherTypeCase() != FetcherTypeCase.FILTERED_FETCHER) {
      throw new IllegalArgumentException(String.format(
          "Expected fetcher_type 'filtered_fetcher', but got '%s'",
          request.getFetcherTypeCase().toString().toLowerCase()));
    }
  }
}
