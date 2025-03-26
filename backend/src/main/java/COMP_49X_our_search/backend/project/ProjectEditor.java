package COMP_49X_our_search.backend.project;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.UmbrellaTopicService;
import COMP_49X_our_search.backend.util.ProtoConverter;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.project.ProjectModule.EditProjectRequest;
import proto.project.ProjectModule.EditProjectResponse;

@Service
public class ProjectEditor {

  private final ProjectService projectService;
  private final MajorService majorService;
  private final UmbrellaTopicService umbrellaTopicService;
  private final ResearchPeriodService researchPeriodService;

  @Autowired
  public ProjectEditor(
      ProjectService projectService,
      MajorService majorService,
      UmbrellaTopicService umbrellaTopicService,
      ResearchPeriodService researchPeriodService) {
    this.projectService = projectService;
    this.majorService = majorService;
    this.umbrellaTopicService = umbrellaTopicService;
    this.researchPeriodService = researchPeriodService;
  }

  public EditProjectResponse editProject(EditProjectRequest request) {
    validateRequest(request);
    validateProjectData(request.getProject());

    try {
      ProjectProto projectProto = request.getProject();
      Project dbProject = projectService.getProjectById(projectProto.getProjectId());
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

      Project editedProject = projectService.saveProject(dbProject);

      return EditProjectResponse.newBuilder()
          .setSuccess(true)
          .setProjectId(editedProject.getId())
          .setEditedProject(toProjectProtoWithoutFaculty(editedProject))
          .build();
    } catch (Exception e) {
      return EditProjectResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage(e.getMessage())
          .build();
    }
  }

  private ProjectProto toProjectProtoWithoutFaculty(Project project) {
    // For now, we don't need the faculty data to be returned with the
    // edited project data, so we're re-using the code from the ProtoConverter
    // class but excluding the Faculty part.
    return ProjectProto.newBuilder()
        .setProjectId(project.getId())
        .setProjectName(project.getName())
        .setDescription(project.getDescription())
        .setDesiredQualifications(project.getDesiredQualifications())
        .setIsActive(project.getIsActive())
        .addAllMajors(project.getMajors().stream().map(Major::getName).toList())
        .addAllUmbrellaTopics(
            project.getUmbrellaTopics().stream().map(UmbrellaTopic::getName).toList())
        .addAllResearchPeriods(
            project.getResearchPeriods().stream().map(ResearchPeriod::getName).toList())
        .build();
  }

  private void validateProjectData(ProjectProto projectProto) {
    if (!projectService.existsById(projectProto.getProjectId())) {
      throw new IllegalArgumentException(
          "Project with id: " + projectProto.getProjectId() + " not found.");
    }
    if (projectProto.getProjectName().isEmpty()
        | projectProto.getDescription().isEmpty()
        | projectProto.getDesiredQualifications().isEmpty()
        // We don't have to check for isActive because protobuf booleans default
        // to false if not set.
        | projectProto.getMajorsList().isEmpty()
        | projectProto.getMajorsList().stream().anyMatch(String::isEmpty)
        | projectProto.getUmbrellaTopicsList().stream().anyMatch(String::isEmpty)
        | projectProto.getResearchPeriodsList().stream().anyMatch(String::isEmpty)) {
      throw new IllegalArgumentException(
          "ProjectProto must have valid following fields: "
              + "project_name, description, desired_qualifications, majors, "
              + "umbrella_topics, research_periods");
    }
  }

  private void validateRequest(EditProjectRequest request) {
    if (!request.hasProject()) {
      throw new IllegalArgumentException("EditProjectRequest must contain 'project'");
    }
  }
}
