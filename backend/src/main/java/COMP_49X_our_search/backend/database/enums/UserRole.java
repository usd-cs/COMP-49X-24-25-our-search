/**
 * Defines the user roles in the system, used to specify the role of a student
 * in the app (STUDENT, FACULTY, ADMIN).
 *
 * The UserRole is stored in the "users" table as an enum.
 *
 * @author Augusto Escudero
 */
package COMP_49X_our_search.backend.database.enums;

public enum UserRole {
  STUDENT,
  FACULTY,
  ADMIN
}