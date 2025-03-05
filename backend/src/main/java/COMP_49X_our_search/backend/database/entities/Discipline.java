/**
 * Represents a discipline entity in the database mapped to the "disciplines"
 * table and has a many-to-many relationship with projects and majors.
 *
 * A discipline has a unique ID, and a name.
 *
 * @Author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "disciplines")
public class Discipline {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String name;

  @ManyToMany(mappedBy = "disciplines")
  private Set<Project> projects = new HashSet<>();

  @ManyToMany(mappedBy = "disciplines")
  private Set<Major> majors = new HashSet<>();

  public Discipline() {}

  public Discipline(String name) {
    this.name = name;
  }

  public Discipline(int id, String name) {
    this.id = id;
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
