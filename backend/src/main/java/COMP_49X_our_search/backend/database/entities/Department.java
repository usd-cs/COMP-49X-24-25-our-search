/**
 * Represents a department entity in the database mapped to the "departments"
 * table and has a many-to-many relationship with the Faculty entity.
 *
 * A department has a unique ID, and a name.
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
@Table(name = "departments")
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String name;

  @ManyToMany(mappedBy = "departments")
  private Set<Faculty> faculties = new HashSet<>();

  public Department() {}

  public Department(String name) {
    this.name = name;
  }

  public Department(Integer id, String name) {
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

  public Set<Faculty> getFaculties() {
    return faculties;
  }

  public void setFaculties(Set<Faculty> faculties) {
    this.faculties = faculties;
  }
}
