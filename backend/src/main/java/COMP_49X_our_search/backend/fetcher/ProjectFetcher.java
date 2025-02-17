package COMP_49X_our_search.backend.fetcher;

import static COMP_49X_our_search.backend.util.ProtoConverter.toDisciplineProto;
import static COMP_49X_our_search.backend.util.ProtoConverter.toMajorProto;

import COMP_49X_our_search.backend.database.entities.Discipline;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.services.DisciplineService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.util.ProtoConverter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;

@Service
public class ProjectFetcher implements Fetcher {

  private final DisciplineService disciplineService;
  private final MajorService majorService;
  private final ProjectService projectService;

  @Autowired
  public ProjectFetcher(
      DisciplineService disciplineService,
      MajorService majorService,
      ProjectService projectService) {
    this.disciplineService = disciplineService;
    this.majorService = majorService;
    this.projectService = projectService;
  }

  @Override
  public FetcherResponse fetch(FetcherRequest request) {
    validateRequest(request);
    List<Discipline> disciplines = disciplineService.getAllDisciplines();

    List<DisciplineWithMajors> disciplineWithMajors =
        disciplines.stream().map(this::buildDisciplineWithMajors).toList();

    return FetcherResponse.newBuilder()
        .setProjectHierarchy(
            ProjectHierarchy.newBuilder().addAllDisciplines(disciplineWithMajors).build())
        .build();
  }

  private DisciplineWithMajors buildDisciplineWithMajors(Discipline discipline) {
    List<Major> majors = majorService.getMajorsByDisciplineId(discipline.getId());
    return DisciplineWithMajors.newBuilder()
        .setDiscipline(toDisciplineProto(discipline))
        .addAllMajors(
            majors.stream()
                .map(major -> buildMajorWithProjects(major, discipline.getId()))
                .toList())
        .build();
  }

  private MajorWithEntityCollection buildMajorWithProjects(Major major, Integer departmentId) {
    List<Project> projects = projectService.getProjectsByMajorId(major.getId());

    return MajorWithEntityCollection.newBuilder()
        .setMajor(toMajorProto(major))
        .setProjectCollection(
            ProjectCollection.newBuilder()
                .addAllProjects(projects.stream().map(ProtoConverter::toProjectProto).toList()))
        .build();
  }

  private void validateRequest(FetcherRequest request) {
    if (request.getFetcherTypeCase() == FetcherTypeCase.FETCHERTYPE_NOT_SET) {
      throw new IllegalArgumentException(
          String.format(
              "Expected fetcher_type to be set, but no fetcher type was provided. Valid types: %s",
              "filtered_fetcher"));
    }
    if (request.getFetcherTypeCase() != FetcherTypeCase.FILTERED_FETCHER) {
      throw new IllegalArgumentException(
          String.format(
              "Expected fetcher_type 'filtered_fetcher', but got '%s'",
              request.getFetcherTypeCase().toString().toLowerCase()));
    }
  }
}
