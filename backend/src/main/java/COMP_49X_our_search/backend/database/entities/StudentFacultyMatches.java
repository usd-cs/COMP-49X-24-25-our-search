package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_faculty_mathces")
public class StudentFacultyMatches {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "student_id", nullable = false)
  private Integer studentId;

  @Column(name = "faculty_id", nullable = false)
  private Integer facultyId;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  public StudentFacultyMatches() {}

  public StudentFacultyMatches(Integer studentId, Integer facultyId) {
    this.studentId = studentId;
    this.facultyId = facultyId;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Integer getStudentId() {
    return studentId;
  }

  public void setStudentId(Integer studentId) {
    this.studentId = studentId;
  }

  public Integer getFacultyId() {
    return facultyId;
  }

  public void setFacultyId(Integer facultyId) {
    this.facultyId = facultyId;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
