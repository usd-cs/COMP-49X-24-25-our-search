# === Build Stage ===
FROM eclipse-temurin:23-jdk AS build
WORKDIR /app

COPY . .
RUN ./gradlew dependencies --no-daemon

COPY src ./src
RUN ./gradlew bootJar --no-daemon
# bootJar creates an executable JAR (Java Archive) file that contains the compiled code along with all the dependencies.
# It packages the application into a JAR file that can be run independently on any machine with a Java runtime environment.
# Used for creating a deployable package of the application.

# === Runtime Stage ===
FROM eclipse-temurin:23-jre
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
