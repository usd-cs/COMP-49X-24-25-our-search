# === Build Stage ===
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY gradlew .
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle gradle
COPY src ./src

RUN chmod +x gradlew
RUN ./gradlew clean --no-daemon
RUN ./gradlew dependencies --no-daemon
RUN ./gradlew bootJar --no-daemon

# === Runtime Stage ===
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
