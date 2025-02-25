/**
 * Represents a faculty member entity in the database mapped to the "faculty"
 * table and has a many-to-many relationship with the Department entity through
 * the "faculty_departments" join table.
 *
 * A faculty member has a unique ID, first name, last name, and email.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "faculty")
public class Faculty {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String email;

  @ManyToMany
  @JoinTable(name = "faculty_departments",
      joinColumns = @JoinColumn(name = "faculty_id"),
      inverseJoinColumns = @JoinColumn(name = "department_id"))
  private Set<Department> departments = new HashSet<>();

  public Faculty() {}

  public Faculty(String firstName, String lastName, String email,
      Set<Department> departments) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.departments = departments != null ? departments : new HashSet<>();
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Set<Department> getDepartments() {
    return departments;
  }

  public void setDepartments(Set<Department> departments) {
    this.departments = departments;
  }
}
