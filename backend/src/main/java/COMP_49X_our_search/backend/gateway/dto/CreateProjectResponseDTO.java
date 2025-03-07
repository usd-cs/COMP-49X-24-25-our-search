package COMP_49X_our_search.backend.gateway.dto;

public class CreateProjectResponseDTO {

  private int projectId;
  private String facultyEmail;
  private CreatedProjectDTO createdProject;

  public CreateProjectResponseDTO() {}

  public CreateProjectResponseDTO(
      int projectId, String facultyEmail, CreatedProjectDTO createdProject) {
    this.projectId = projectId;
    this.facultyEmail = facultyEmail;
    this.createdProject = createdProject;
  }

  public int getProjectId() {
    return projectId;
  }

  public void setProjectId(int projectId) {
    this.projectId = projectId;
  }

  public String getFacultyEmail() {
    return facultyEmail;
  }

  public void setFacultyEmail(String facultyEmail) {
    this.facultyEmail = facultyEmail;
  }

  public CreatedProjectDTO getCreatedProject() {
    return createdProject;
  }

  public void setCreatedProject(CreatedProjectDTO createdProject) {
    this.createdProject = createdProject;
  }
}
