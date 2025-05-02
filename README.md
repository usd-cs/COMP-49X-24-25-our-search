# OUR SEARCH

## About

The Office of Undergraduate Research (OUR) at USD launched the Student Engagement and Access Research Community Hub (SEARCH) to connect students with faculty conducting research. This is an app that streamlines the current manual data management process, making it easier for students and faculty to collaborate and receive real-time updates on matching research interests.

## Prerequisites

* be a valid USD student or faculty member (@sandiego.edu)

## Installation

1. **Clone the Repository**
  ```bash
  git clone https://github.com/usd-cs/COMP-49X-24-25-our-search.git
  cd COMP-49X-24-25-our-search
  ```

## Setup

2. **Set up Google Authorization Provider**

* 2a. Login or create an account with Google Cloud Console at [console.cloud.google.com](https://console.cloud.google.com/welcome). 
* 2b. Create a new Google Cloud project.
  * Click "Select Project" on the top of the screen. Click "New Project".
  * Name the project "OUR SEARCH". Click "Create". 
  * Refresh the page.
* 2c. Configure OAuth2.
  * i. Navigate to APIs & Services > OAuth2 Consent Screen. Select "OUR SEARCH" as the project. Follow these configurations (exclude the "):
    * User Type: External.
    * App name: "OUR SEARCH".
    * Application privacy policy page: "https://oursearch.dedyn.io/privacy-policy".
    * Authorized domain 1: "oursearch.dedyn.io".
    * App logo: optional, upload a PNG or JPEG of the USD logo.
    * Everything else can be left blank.
    * Click "Save".
  * ii. Do not add any scopes. Total: zero.  
  * iii. Do not add any test users. Total: zero.
  * iv. Navigate to APIs & Services > Credentials. Click "Create Credentials" and choose option "OAuth Client ID". Follow these configurations:
    * Application type: Web application.
    * Authorized Javascript Origins:
      * 1. http://localhost:8080
      * 2. http://oursearch.dedyn.io:8080
    * Authorized redirect URIs:
      * 1. http://localhost/login/oauth2/code/google
      * 2. http://oursearch.dedyn.io/login/oauth2/code/google
    * Click "Save".
* 2d. After OAuth credentials have been created, a popup should appear displaying the Client ID and Client secret.
  * Save both somewhere **safe**. Do not forget them. 
  * **Never** put these anywhere they can be publicly accessed. 
  * In case you need to find them again you can access them at APIs & Services > Credentials > OAuth 2.0 Client IDs.

## Build and Run the Application

  * Run the following command:
   ```bash
    ./start.sh --new_admin=your_email@sandiego.edu --google_id=your_id --google_secret=your_secret
   ```
  * For `--new_admin`, use the primary account you will use to log in as the administrator of the app. **Must be `@sandiego.edu`**. The admin **cannot** be a student or faculty member.
  * For `--google_id`, use the Google Client ID created in step 2d. 
  * For `--google_secret`, use the Google Client secret created in step 2d.
  ---
   Example:
   ```bash
    ./start.sh --new_admin=usdoursearch@sandiego.edu --google_id=1234567890-glkdnsdknvmfjf778gua5.apps.googleusercontent.com --google_secret=tKSHFLJKBEBCdjfbv-dhfsSFJDFNM
   ```
  ---
  
- Wait for the app to start. It will take a few moments. Run `docker ps` to verify that there are 4 containers running called "our-frontend", "our-backend", "our-db", and "our-proxy".


## Use OUR SEARCH once it's running

* Development: go to https://localhost
* Login and create an account :)

---
*There is currently a production ready version up at https://oursearch.dedyn.io

## Contact 
[COMP-49X-24-25-our-search](https://github.com/orgs/usd-cs/teams/comp-49x-24-25-our-search) team on GitHub

---
Last updated: *May 2, 2025*