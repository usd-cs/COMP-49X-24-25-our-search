/**
 * Filtered fetcher for retrieving project data. This fetcher interacts with the DisciplineService,
 * MajorService, and ProjectService to fetch projects grouped by disciplines and majors. (In the
 * future, will support filtering).
 *
 * <p>It ensures that requests are valid and only processes requests of type FILTERED_TYPE_PROJECTS.
 *
 * <p>Implements the Fetcher interface.
 *
 * @author Augusto Escudero
 */
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
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.fetcher.DataTypes.DisciplineWithMajors;
import proto.fetcher.DataTypes.MajorWithEntityCollection;
import proto.fetcher.DataTypes.ProjectCollection;
import proto.fetcher.DataTypes.ProjectHierarchy;
import proto.fetcher.FetcherModule.FetcherRequest;
import proto.fetcher.FetcherModule.FetcherRequest.FetcherTypeCase;
import proto.fetcher.FetcherModule.FetcherResponse;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.fetcher.FetcherModule.FilteredType;

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
        disciplines.stream()
            .map(discipline -> buildDisciplineWithMajors(discipline, request.getFilteredFetcher()))
            .toList();

    return FetcherResponse.newBuilder()
        .setProjectHierarchy(
            ProjectHierarchy.newBuilder().addAllDisciplines(disciplineWithMajors).build())
        .build();
  }

  private DisciplineWithMajors buildDisciplineWithMajors(
      Discipline discipline, FilteredFetcher filters) {
    List<Major> majors = majorService.getMajorsByDisciplineId(discipline.getId());
    return DisciplineWithMajors.newBuilder()
        .setDiscipline(toDisciplineProto(discipline))
        .addAllMajors(
            majors.stream()
                .map(major -> buildMajorWithProjects(major, discipline.getId(), filters))
                .toList())
        .build();
  }

  private MajorWithEntityCollection buildMajorWithProjects(
      Major major, Integer disciplineId, FilteredFetcher filters) {
    List<Project> projects = projectService.getProjectsByMajorId(major.getId());

    List<Project> filteredProjects = projects;

    if (!filters.getMajorIdsList().isEmpty()
        && !filters.getMajorIdsList().contains(major.getId())) {
      // Only filter if: 1) Major filters exist AND 2) Current major is not in filter list
      filteredProjects =
          filteredProjects.stream()
              .filter(
                  project ->
                      project.getMajors().stream()
                          .anyMatch(
                              projectMajor ->
                                  filters.getMajorIdsList().contains(projectMajor.getId())))
              .toList();
    }

    if (!filters.getResearchPeriodIdsList().isEmpty()) {
      filteredProjects =
          filteredProjects.stream()
              .filter(
                  project ->
                      project.getResearchPeriods().stream()
                          .anyMatch(
                              period ->
                                  filters.getResearchPeriodIdsList().contains(period.getId())))
              .toList();
    }

    if (!filters.getUmbrellaTopicIdsList().isEmpty()) {
      filteredProjects =
          filteredProjects.stream()
              .filter(
                  project ->
                      project.getUmbrellaTopics().stream()
                          .anyMatch(
                              topic -> filters.getUmbrellaTopicIdsList().contains(topic.getId())))
              .toList();
    }

    if (!filters.getKeywords().isEmpty()) {
      filteredProjects =
          filteredProjects.stream()
              .filter(
                  project ->
                      containsKeyword(project.getDescription(), filters.getKeywords())
                          || containsKeyword(
                              project.getDesiredQualifications(), filters.getKeywords())
                          || containsKeyword(project.getName(), filters.getKeywords())
                          || containsKeyword(
                              project.getFaculty().getFirstName()
                                  + " "
                                  + project.getFaculty().getLastName(),
                              filters.getKeywords()))
              .toList();
    }

    return MajorWithEntityCollection.newBuilder()
        .setMajor(toMajorProto(major))
        .setProjectCollection(
            ProjectCollection.newBuilder()
                .addAllProjects(
                    filteredProjects.stream().map(ProtoConverter::toProjectProto).toList()))
        .build();
  }

  private boolean containsKeyword(String text, String keywords) {
    if (text == null || keywords == null || keywords.trim().isEmpty()) {
      return false;
    }

    String lowercaseText = text.toLowerCase();
    Set<String> keywordSet =
        Arrays.stream(keywords.toLowerCase().split("[ ,]"))
            .filter(k -> !k.trim().isEmpty())
            .collect(Collectors.toSet());

    return keywordSet.isEmpty() || keywordSet.stream().anyMatch(lowercaseText::contains);
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
    if (request.getFilteredFetcher().getFilteredType() != FilteredType.FILTERED_TYPE_PROJECTS) {
      throw new IllegalArgumentException(
          String.format(
              "Expected filtered_type '%s', but got '%s'",
              FilteredType.FILTERED_TYPE_PROJECTS,
              request.getFilteredFetcher().getFilteredType().toString()));
    }
  }
}
