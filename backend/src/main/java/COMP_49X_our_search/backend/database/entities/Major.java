package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "majors")
public class Major {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String name;

  @ManyToMany
  @JoinTable(name = "majors_disciplines",
      joinColumns = @JoinColumn(name = "major_id"),
      inverseJoinColumns = @JoinColumn(name = "discipline_id"),
      uniqueConstraints = @UniqueConstraint(
          columnNames = {"major_id", "discipline_id"}))
  private Set<Discipline> disciplines = new HashSet<>();

  @ManyToMany(mappedBy = "majors")
  private Set<Student> students = new HashSet<>();

  @ManyToMany(mappedBy = "majors")
  private Set<Project> projects = new HashSet<>();

  public Major() {}

  public Major(String name, Set<Discipline> disciplines, Set<Student> students,
      Set<Project> projects) {
    this.name = name;
    this.disciplines = disciplines;
    this.students = students != null ? students : new HashSet<>();
    this.projects = projects != null ? projects : new HashSet<>();
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<Discipline> getDisciplines() {
    return disciplines;
  }

  public void setDisciplines(Set<Discipline> disciplines) {
    this.disciplines = disciplines;
  }

  public Set<Student> getStudents() {
    return students;
  }

  public void setStudents(Set<Student> students) {
    this.students = students;
  }

  public Set<Project> getProjects() {
    return projects;
  }

  public void setProjects(Set<Project> projects) {
    this.projects = projects;
  }
}
