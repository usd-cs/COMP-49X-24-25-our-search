package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_student_matches")
public class ProjectStudentMatches {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "project_id", nullable = false)
  private Integer projectId;

  @Column(name = "student_id", nullable = false)
  private Integer studentId;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  public ProjectStudentMatches() {}

  public ProjectStudentMatches(Integer projectId, Integer studentId) {
    this.projectId = projectId;
    this.studentId = studentId;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Integer getProjectId() {
    return projectId;
  }

  public void setProjectId(Integer projectId) {
    this.projectId = projectId;
  }

  public Integer getStudentId() {
    return studentId;
  }

  public void setStudentId(Integer studentId) {
    this.studentId = studentId;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
