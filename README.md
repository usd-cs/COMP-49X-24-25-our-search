# OUR SEARCH

## About

The Office of Undergraduate Research (OUR) at USD launched the Student Engagement and Access Research Community Hub (SEARCH) to connect students with faculty conducting research. This is an app that streamlines the current manual data management process, making it easier for students and faculty to collaborate and receive real-time updates on matching research interests.

## Prerequisites

1. For users: be a valid USD student or faculty member (@[sandiego.edu](http://sandiego.edu))  
2. For developers (production): a domain name to run the app with SSL certificates from Let's Encrypt. For example [https://oursearch.dedyn.io](https://oursearch.dedyn.io) 

## Software Dependency Overview

1. Google OAuth2.0 client. See Step 2 below.  
2. SendGrid API client. See Step 3 below.

## Step 1\. Clone the Repository

|  git clone https://github.com/usd-cs/COMP-49X-24-25-our-search.git cd COMP-49X-24-25-our-search |
| :---- |

## Step 2\. Set up Google Authorization Provider

1. **Login or create an account with Google Cloud Console**

   1. [https://console.cloud.google.com/welcome](https://console.cloud.google.com/welcome) 

2. **Create a new Google Cloud project.**

   1. Click "Select Project" on the top of the screen. Click "New Project".

   2. Name the project "OUR SEARCH". Click "Create".

   3. Refresh the page.

3. **Configure OAuth2.**

   1. Navigate to APIs & Services \> OAuth2 Consent Screen. Select "OUR SEARCH" as the project. Follow these configurations (exclude the "):

      1. User Type: External.  
      2. App name: "OUR SEARCH".  
      3. Application privacy policy page: "\<your\_frontend\_url\>[/privacy-policy](https://oursearch.dedyn.io/privacy-policy)".  
      4. Authorized domain 1: Your frontend domain name. For example, "oursearch.dedyn.io".  
      5. App logo: optional, upload a PNG or JPEG of the USD logo.  
      6. Everything else can be left blank.  
      7. Click "Save".  
         1. Do not add any scopes. Total: zero.   
         2. Do not add any test users. Total: zero.

4. **Create Credentials.**

   1. Navigate to APIs & Services \> Credentials. Click "Create Credentials" and choose option "OAuth Client ID". Follow these configurations:

      1. Application type: Web application.  
      2. Authorized Javascript Origins: [http://\<your\_frontend\_url\>:8080](http://oursearch.dedyn.io:8080)   
      3. Authorized redirect URIs: [http://\<your\_frontend\_url\>/login/oauth2/code/google](http://oursearch.dedyn.io/login/oauth2/code/google)   
      4. Click "Save".

5. **Save Credentials.**

   1. After OAuth credentials have been created, a popup should appear displaying the Client ID and Client secret.

   2. Save both somewhere **safe**. Do **not** forget them. **Never** put these anywhere they can be publicly accessed.

   3. In case you need to find them again you can access them at APIs & Services \> Credentials \> OAuth 2.0 Client IDs.

## Step 3\. Set up SendGrid API

1. Create an account.  
2. TBD

## Step 4\. If changes are made to the codebase, push the code to Docker image repositories.

### Notes

* You must build and push each frontend and backend image separately.

* \***VERY IMPORTANT:** Make sure to go to Docker Hub and delete any old images. Otherwise docker will try to use those cached images instead of using your new code.

* The below example uses the below public image repositories. The :amd64-latest tag assumes the operating system of the machine running the app is Linux (amd64): 

  * natjungquist/oursearch-frontend:amd64-latest

  * natjungquist/oursearch-backend:amd64-latest

### Steps

1. Navigate to the root directory.

| cd COMP-49X-24-25-our-search |
| :---- |

2. Enable buildx to make sure the built image is good for both aarch64/arm64 (Mac) and x86\_64/amd64 (DO server)

| docker buildx create \-use |
| :---- |

Depending on the architecture of the machine you are running the app on, you will have to specify what the build type is:

**Option 1**. Build and push in two separate commands: the multi platform builds cannot be stored locally in a single format, so build them separately, then push them separately.

1) For amd64 architectures:

| cd frontend docker buildx build \--platform linux/amd64 \-t natjungquist/oursearch-frontend:amd64-latest \--output=type\=docker . docker push natjungquist/oursearch-frontend:amd64-latest cd backend docker buildx build \--platform linux/amd64 \-t natjungquist/oursearch-backend:amd64-latest \--output=type\=docker . docker push natjungquist/oursearch-backend:amd64-latest |
| :---- |

2) For arm64 architectures:

| cd frontenddocker buildx build \--platform linux/arm64 \-t natjungquist/oursearch-frontend:arm64-latest \--output=type\=docker .docker push natjungquist/oursearch-frontend:arm64-latestcd backenddocker buildx build \--platform linux/arm64 \-t natjungquist/oursearch-backend:arm64-latest \--output=type\=docker .docker push natjungquist/oursearch-backend:arm64-latest |
| :---- |

**Option 2**. Build and push in one single command:

| cd frontenddocker buildx build \--platform linux/amd64 \-t natjungquist/oursearch-frontend:amd64-latest \--push . docker buildx build \--platform linux/arm64 \-t natjungquist/oursearch-frontend:arm64-latest \---push . cd backenddocker buildx build \--platform linux/amd64 \-t natjungquist/oursearch-backend:amd64-latest \--push . docker buildx build \--platform linux/arm64 \-t natjungquist/oursearch-backend:arm64-latest \--push . |
| :---- |

## Step 5\. Start the Application

1. Open Terminal. Navigate to the project directory.

|  cd COMP-49X-24-25-our-search |
| :---- |

 

2. Make sure nothing is currently running.

| docker ps |
| :---- |

There should be **no** containers listed with the names of "our-frontend", "our-backend", "our-db", or "our-proxy". If there are, and you want to stop them, run **docker compose down.**

3. Make sure the code is up to date.

|  docker compose pull |
| :---- |

4. To start the app, run the following command:

|    ./start.sh \--new\_admin=your\_email@sandiego.edu \--google\_id=your\_id \--google\_secret=your\_secret \--domain=\<your\_domain\> |
| :---- |

*  For \--new\_admin, use the primary account you will use to log in as the administrator of the app. **Must be @sandiego.edu**. The admin **cannot** be a student or faculty member.  
*  For \--google\_id, use the Google Client ID created in step 2d.  
*  For \--google\_secret, use the Google Client secret created in step 2d.

   
  	Example:

|    ./start.sh \--new\_admin=usdoursearch@sandiego.edu \--google\_id=1234567890-glkdnmfjf778gua5.apps.googleusercontent.com \--google\_secret=tKSHFLJKBEBCdjfbv-dhfsSFJDFNM \--frontend\_url=https:// \--backend\_url=your\_backend\_url |
| :---- |

5. Wait for the app to start. It will take a few moments. Run docker ps to verify that there are 4 containers running called "our-frontend", "our-backend", "our-db", and "our-proxy".

6. The app is now running at [https:/](https://oursearch.dedyn.io)/\<your\_frontend\_url\>

# How to stop OUR SEARCH

**What will this do?**

* This will make the app completely shut down, so anyone who tries to go to the URL [https://](https://oursearch.dedyn.io)\<your\_frontend\_url\> will not work. 

**What about the data?**

* Shutting down the app will NOT delete any existing database data. (So if you shut it down, then start it up again, the previous data will still show up on the app.) 

 **It is unlikely that you will need to do this, but here are potential reasons:**

* The app is not responding or acting strangely  
* You notice incorrect or unexpected behavior in the app  
* You need to stop the app before making updates or changes  
* You believe the app might be compromised or at risk  
* The server or system it's running on is under high stress  
* You’re instructed to shut it down by a developer or support person  
* You need to conserve resources temporarily  
* You are shutting down or restarting the server hosting the app

**How to stop the app:**

1. Open Terminal. Navigate to the project directory.

|  cd COMP-49X-24-25-our-search |
| :---- |

2. Run this command:

| docker compose down |
| :---- |

* Text will come up saying that the 4 containers ("our-frontend", "our-backend", "our-db", and "our-proxy") have stopped.

**What if I want to delete all the app data?**

* Deleting all app data should only be done in rare or emergency situations. Here are some possible reasons:  
  * The database is broken and no longer works properly (for example, data won’t load, save, or shows up incorrectly)  
  * The app was filled with bad or test data and needs a clean reset.  
  * Sensitive or incorrect data was accidentally entered and must be fully removed.  
  * A full wipe is required due to a security breach.

* If you want to remove all of the app data, you have two options:  
  * 1\. Not broken, no security breach: While the app is still running, log in as an admin and go to Manage App Variables to delete everything. Go to the posts page to delete all students, faculty, and projects.  
  * 2\. Broken or security breach occurred: Contact a developer. 

