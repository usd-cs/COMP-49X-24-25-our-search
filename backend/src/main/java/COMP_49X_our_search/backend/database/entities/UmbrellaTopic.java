/**
 * Represents an umbrella topic entity in the database mapped to the
 * "umbrella_topics" table and has a many-to-many relationship with the Project
 * entity.
 *
 * An umbrella topic has a unique ID and a name.
 *
 * @author Augusto Escudero
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
@Table(name = "umbrella_topics")
public class UmbrellaTopic {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String name;

  @ManyToMany(mappedBy = "umbrellaTopics")
  private Set<Project> projects = new HashSet<>();

  public UmbrellaTopic() {}

  public UmbrellaTopic(String name, Set<Project> projects) {
    this.name = name;
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

  public Set<Project> getProjects() {
    return projects;
  }

  public void setProjects(Set<Project> projects) {
    this.projects = projects;
  }
}
