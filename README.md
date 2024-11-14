# OUR SEARCH

## About

The Office of Undergraduate Research (OUR) at USD launched the Student Engagement and Access Research Community Hub (SEARCH) to connect students with faculty conducting research. This is an app that streamlines the current manual data management process, making it easier for students and faculty to collaborate and receive real-time updates on matching research interests.

## Prerequisites

* be a valid USD student or faculty member (@sandiego.edu)

## Installation - DEVELOPMENT MODE

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Set Up MySQL Connection**
   - (a) Start a MySQL server locally or run a Docker container on port 3306:
     ```bash
     docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:latest
     ```
   - (b) Create a database called `forum`:
     ```sql
     CREATE DATABASE forum;
     ```

3. **Install Node.js** (if not already installed)
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

4. **Configure Backend Database Connection**
   - In the backend, open `src/main/resources/application.properties` and configure the MySQL settings:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/forum
     spring.datasource.username=root
     spring.datasource.password=root
     ```

5. **Build and Run the Backend Application**
   - Go to the backend directory:
     ```bash
     cd ../backend
     ```
   - Build the project with Gradle:
     ```bash
     ./gradlew build
     ```
   - Run the Spring Boot application:
     ```bash
     ./gradlew bootRun
     ```

6. **Run the Frontend Application**
   - Go back to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

## Contact 
[COMP-49X-24-25-our-search](https://github.com/orgs/usd-cs/teams/comp-49x-24-25-our-search) team on GitHub