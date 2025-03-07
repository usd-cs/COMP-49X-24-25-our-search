/**
 * Project creator class. It handles the creation of projects for faculty and
 * storing them in the database.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.project;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.project.ProjectModule.CreateProjectRequest;
import proto.project.ProjectModule.CreateProjectResponse;

@Service
public class ProjectCreator {
  private final ProjectService projectService;
  private final FacultyService facultyService;
  private final MajorService majorService;
  private final UmbrellaTopicService umbrellaTopicService;
  private final ResearchPeriodService researchPeriodService;

  @Autowired
  public ProjectCreator(
      ProjectService projectService,
      FacultyService facultyService,
      MajorService majorService,
      UmbrellaTopicService umbrellaTopicService,
      ResearchPeriodService researchPeriodService
  ) {
    this.projectService = projectService;
    this.facultyService = facultyService;
    this.majorService = majorService;
    this.umbrellaTopicService = umbrellaTopicService;
    this.researchPeriodService = researchPeriodService;
  }

  public CreateProjectResponse createProject(CreateProjectRequest request) {
    validateRequest(request);
    validateProjectData(request.getProject());
    try {
      ProjectProto projectProto = request.getProject();
      FacultyProto facultyProto = projectProto.getFaculty();

      if (!facultyService.existsByEmail(facultyProto.getEmail())) {
        throw new IllegalArgumentException(
            "Faculty member with email '"
                + facultyProto.getEmail()
                + "' does not exist. A project cannot be created without an associated faculty member.");
      }

      Project dbProject = new Project();
      dbProject.setName(projectProto.getProjectName());
      dbProject.setDescription(projectProto.getDescription());
      dbProject.setDesiredQualifications(projectProto.getDesiredQualifications());
      dbProject.setIsActive(projectProto.getIsActive());
      Set<Major> majorEntities =
          projectProto.getMajorsList().stream()
              .map(
                  majorName ->
                      majorService
                          .getMajorByName(majorName)
                          .orElseThrow(
                              () -> new IllegalArgumentException("Major not found: " + majorName)))
              .collect(Collectors.toSet());
      Set<UmbrellaTopic> umbrellaTopicEntities =
          projectProto.getUmbrellaTopicsList().stream()
              .map(
                  umbrellaTopicName ->
                      umbrellaTopicService
                          .getUmbrellaTopicByName(umbrellaTopicName)
                          .orElseThrow(
                              () ->
                                  new IllegalArgumentException(
                                      "Umbrella topic not found: " + umbrellaTopicName)))
              .collect(Collectors.toSet());
      Set<ResearchPeriod> researchPeriodEntities =
          projectProto.getResearchPeriodsList().stream()
              .map(
                  researchPeriodName ->
                      researchPeriodService
                          .getResearchPeriodByName(researchPeriodName)
                          .orElseThrow(
                              () ->
                                  new IllegalArgumentException(
                                      "Umbrella topic not found: " + researchPeriodName)))
              .collect(Collectors.toSet());

      dbProject.setMajors(majorEntities);
      dbProject.setUmbrellaTopics(umbrellaTopicEntities);
      dbProject.setResearchPeriods(researchPeriodEntities);

      Faculty dbFaculty = facultyService.getFacultyByEmail(facultyProto.getEmail());
      dbProject.setFaculty(dbFaculty);

      Project createdProject = projectService.saveProject(dbProject);

      return CreateProjectResponse.newBuilder()
          .setSuccess(true)
          .setProjectId(createdProject.getId())
          .setCreatedProject(projectProto)
          .build();
    } catch (Exception e) {
      return CreateProjectResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage(e.getMessage())
          .build();
    }
  }

  private void validateProjectData(ProjectProto projectProto) {
    if (projectProto.getProjectName().isEmpty()
        | projectProto.getDescription().isEmpty()
        | projectProto.getDesiredQualifications().isEmpty()
        // We don't have to check for isActive because protobuf booleans default
        // to false if not set.
        | projectProto.getMajorsList().stream().anyMatch(String::isEmpty)
        | projectProto.getUmbrellaTopicsList().stream().anyMatch(String::isEmpty)
        | projectProto.getResearchPeriodsList().stream().anyMatch(String::isEmpty)) {
      throw new IllegalArgumentException(
          "ProjectProto must have valid following fields: "
              + "project_name, description, desired_qualifications, majors, "
              + "umbrella_topics, research_periods");
    }
    if (projectProto.getFaculty().getEmail().isEmpty()) {
      throw new IllegalArgumentException(
          "ProjectProto must have 'FacultyProto' with 'email' field set");
    }
  }

  private void validateRequest(CreateProjectRequest request) {
    if (!request.hasProject()) {
      throw new IllegalArgumentException("CreateProjectRequest must contain 'project'");
    }
  }
}
