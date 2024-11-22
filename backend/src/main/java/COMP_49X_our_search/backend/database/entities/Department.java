package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "departments")
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String name;

  @ManyToMany(mappedBy = "departments")
  private Set<Faculty> faculties = new HashSet<>();

  @ManyToMany(mappedBy = "departments")
  private Set<Project> projects = new HashSet<>();

  @OneToMany(mappedBy = "department")
  private Set<Major> majors = new HashSet<>();

  public Department() {}

  public Department(String name) {
    this.name = name;
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

  public Set<Faculty> getFaculties() {
    return faculties;
  }

  public void setFaculties(Set<Faculty> faculties) {
    this.faculties = faculties;
  }

  public Set<Project> getProjects() {
    return projects;
  }

  public void setProjects(Set<Project> projects) {
    this.projects = projects;
  }

  public Set<Major> getMajors() {
    return majors;
  }

  public void setMajors(Set<Major> majors) {
    this.majors = majors;
  }
}
