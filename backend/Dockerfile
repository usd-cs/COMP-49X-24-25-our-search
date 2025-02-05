# Using multistage build: https://docs.docker.com/build/building/multi-stage/ 
# Why? Separate concerns by having two environments (stages), one for building and one for running. 
# The build stage includes all the tools needed to compile and package the application, 
# which are not needed in the runtime stage. This way, the final image is cleaner and smaller.
# The runtime stage uses the Java Runtime Environment (JRE) base image, which is smaller than the Java Development Kit (JDK).
# Excluding build tools and unnecessary dependencies from the runtime image reduces the attack surface and potential 
# vulnerabilities of the application in production.

# Using eclipse-temurin https://projects.eclipse.org/projects/adoptium.temurin
# because it's a free and open-source implementation of the Java Platform, Standard Edition (Java SE) with LTS.
# Temurin builds are based directly on the OpenJDK source code without modifications, making it a reliable, standard-compliant choice. 

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
# The --no-daemon flag ensures that each Gradle build in the Docker container runs in a fresh environment without reusing any previous Gradle Daemon processes.

# === Runtime Stage ===
FROM eclipse-temurin:23-jre
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
