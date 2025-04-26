package COMP_49X_our_search.backend.profile;

import static COMP_49X_our_search.backend.util.ProtoConverter.toFacultyProto;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.UserService;
import COMP_49X_our_search.backend.fetcher.ProjectFetcher;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proto.data.Entities.ProjectProto;
import proto.fetcher.FetcherModule.FilteredFetcher;
import proto.profile.ProfileModule.FacultyProfile;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

@Service
public class FacultyProfileRetriever implements ProfileRetriever {

  private final FacultyService facultyService;
  private final UserService userService;
  private final ProjectService projectService;

  @Autowired
  public FacultyProfileRetriever(
      FacultyService facultyService, UserService userService, ProjectService projectService) {
    this.facultyService = facultyService;
    this.userService = userService;
    this.projectService = projectService;
  }

  @Override
  public RetrieveProfileResponse retrieveProfile(RetrieveProfileRequest request) {
    validateRequest(request);
    validateUserRole(request.getUserEmail());

    Faculty dbFaculty = facultyService.getFacultyByEmail(request.getUserEmail());
    if (dbFaculty == null) {
      return RetrieveProfileResponse.newBuilder()
          .setSuccess(false)
          .setErrorMessage("Faculty profile not found for email: " + request.getUserEmail())
          .build();
    }

    // TODO(acescudero): This is duplicate logic, refactor this eventually.
    List<Project> facultyProjects = projectService.getProjectsByFacultyId(dbFaculty.getId());

    if (request.hasFilters()) {
      FilteredFetcher filters = request.getFilters();

      if (!filters.getMajorIdsList().isEmpty()) {
        facultyProjects = facultyProjects.stream()
            .filter(project -> project.getMajors().stream()
                .anyMatch(major -> filters.getMajorIdsList().contains(major.getId())))
            .toList();
      }

      if (!filters.getResearchPeriodIdsList().isEmpty()) {
        facultyProjects = facultyProjects.stream()
            .filter(project -> project.getResearchPeriods().stream()
                .anyMatch(period -> filters.getResearchPeriodIdsList().contains(period.getId())))
            .toList();
      }

      if (!filters.getUmbrellaTopicIdsList().isEmpty()) {
        facultyProjects = facultyProjects.stream()
            .filter(project -> project.getUmbrellaTopics().stream()
                .anyMatch(topic -> filters.getUmbrellaTopicIdsList().contains(topic.getId())))
            .toList();
      }

      if (!filters.getKeywords().isEmpty()) {
        facultyProjects = facultyProjects.stream()
            .filter(project -> containsKeyword(project.getDescription(), filters.getKeywords())
                || containsKeyword(project.getDesiredQualifications(), filters.getKeywords())
                || containsKeyword(project.getName(), filters.getKeywords()))
            .toList();
      }
    }

    return RetrieveProfileResponse.newBuilder()
        .setSuccess(true)
        .setProfileId(dbFaculty.getId())
        .setRetrievedFaculty(
            FacultyProfile.newBuilder()
                .setFaculty(toFacultyProto(dbFaculty))
                .addAllProjects(
                    facultyProjects.stream()
                        .map(this::buildProjectProto)
                        .toList()))
        .build();
  }

  private boolean containsKeyword(String text, String keywords) {
    if (text == null || keywords == null || keywords.trim().isEmpty()) {
      return false;
    }

    String lowercaseText = text.toLowerCase();
    Set<String> keywordSet = Arrays.stream(keywords.toLowerCase().split("[ ,]"))
        .filter(k -> !k.trim().isEmpty())
        .collect(Collectors.toSet());

    return keywordSet.isEmpty() || keywordSet.stream().anyMatch(lowercaseText::contains);
  }

  private ProjectProto buildProjectProto(Project dbProject) {
    // Construct a ProjectProto message without the faculty field populated
    return ProjectProto.newBuilder()
        .setProjectId(dbProject.getId())
        .setProjectName(dbProject.getName())
        .setDescription(dbProject.getDescription())
        .setDesiredQualifications(dbProject.getDesiredQualifications())
        .setIsActive(dbProject.getIsActive())
        .addAllMajors(dbProject.getMajors().stream().map(Major::getName).toList())
        .addAllUmbrellaTopics(
            dbProject.getUmbrellaTopics().stream().map(UmbrellaTopic::getName).toList())
        .addAllResearchPeriods(
            dbProject.getResearchPeriods().stream().map(ResearchPeriod::getName).toList())
        .setFaculty(toFacultyProto(dbProject.getFaculty()))
        .build();
  }

  private void validateUserRole(String email) {
    if (userService.getUserRoleByEmail(email) != UserRole.FACULTY) {
      throw new IllegalArgumentException("User must be a Faculty");
    }
  }

  private void validateRequest(RetrieveProfileRequest request) {
    if (request.getUserEmail().isEmpty()) {
      throw new IllegalArgumentException("RetrieveProfileRequest must contain 'user_email'");
    }
  }
}
