# Internship Catalog — Take-Home Assignment

Hi! This is a small full-stack application that you will improve as part of the take-home assignment. Please read **ASSIGNMENT.md** for what you are expected to do. This file only covers setup.

---

## Tech stack

- **Frontend:** Next.js 14 (App Router, JavaScript) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)

---

## Prerequisites

- Node.js 18 or later
- npm
- One of the following for MongoDB:
  - **Docker + Docker Compose** (easiest — included `docker-compose.yml` does the work)
  - **Local MongoDB** running on `mongodb://localhost:27017`
  - **MongoDB Atlas** free tier (just paste your connection string into `backend/.env`)

---

## Setup

### 1. Start MongoDB

If you have Docker:

```bash
docker compose up -d
```

This starts MongoDB on `localhost:27017` and persists data in a Docker volume.

If you prefer your own MongoDB or Atlas, skip this step — just make sure `MONGODB_URI` in `backend/.env` points to it.

### 2. Backend

```bash
cd backend
cp .env.example .env        # adjust MONGODB_URI if needed
npm install
npm run seed                # inserts 20 sample internships
npm run dev                 # starts API at http://localhost:4000
```

You can sanity check with:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/internships
```

### 3. Frontend

In a new terminal:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                 # starts app at http://localhost:3000
```

Open http://localhost:3000.

---

## Project structure

```
.
├── ASSIGNMENT.md           ← read this for the task
├── docker-compose.yml      ← MongoDB for local dev
├── backend/                ← Express + Mongoose API
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   ├── data/internships.json
│   ├── models/
│   └── routes/
└── frontend/               ← Next.js App Router
    ├── app/
    │   ├── layout.js
    │   ├── page.js                  ← listing page
    │   ├── internships/[id]/page.js ← detail page
    │   ├── saved/page.js            ← placeholder, build this
    │   ├── find/page.js             ← placeholder, build this
    │   └── components/
    └── lib/api.js
```

---

## Submission

See ASSIGNMENT.md for what to submit.

Good luck — have fun with it!



## Submission Notes

# Internship Catalog — Full Stack Engineer Take-Home Assignment

## Overview

This project is an internship catalog application built using Next.js, Node.js, Express.js, MongoDB, and Groq API.

The application allows users to:

* Browse available internships
* View internship details
* Apply for internships
* Save internships for later
* Get AI-powered internship recommendations based on their profile

---

# Tech Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* JavaScript

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Groq API

---

# Project Structure

```
internship-catalog-assignment

├── frontend
│   ├── app
│   ├── lib
│   ├── public
│   └── package.json
│
├── backend
│   ├── models
│   ├── routes
│   ├── prompts
│   ├── lib
│   ├── data
│   ├── db.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# Bugs Found and Fixed


## Bug 1: Internship Detail Page Error (`params.id` Issue)

### Problem

Clicking an internship from the catalog caused an error on the internship detail page.

### Root Cause

The issue was related to incorrect handling of dynamic route parameters in the Next.js App Router. The `params.id` value was not being accessed correctly.

### Fix

Updated the dynamic route parameter handling to correctly read the internship ID and fetch the required internship details.

---

## Bug 2: Incorrect Pagination Count

### Problem

The pagination displayed an incorrect number of internships per page.

The expected behavior was to display 20 internships as:

* Page 1: 9 internships
* Page 2: 9 internships
* Page 3: 2 internships

### Root Cause

The pagination logic was calculating the page data incorrectly, causing an inconsistent number of internship records to be displayed.

### Fix

Updated the pagination calculation to correctly slice the internship list and display the expected number of records on each page.

---

## Bug 3: Docker Compose Does Not Containerize Frontend and Backend

### Problem

Docker Compose only started the MongoDB container. The frontend and backend applications were not containerized.

### Root Cause

The existing Docker configuration only included the database service and did not define Docker services for the application layers.

### Fix

Reviewed the existing Docker setup and documented the current limitation. With more time, separate Docker services would be added for the frontend and backend applications.

---

## Bug 4: Apply Button State Not Updated After Successful Application

### Problem

After successfully applying for an internship, the button continued showing **"Apply Now"** instead of updating to **"Applied"**.

### Root Cause

The frontend state was not updated after receiving a successful application response from the backend.

### Fix

Updated the application state after successful submission so the button reflects the current application status.

---

## Bug 5: Applications Page Not Showing Applied Internships

### Problem

The `/applications` page did not display internships that the current user had already applied for.

### Root Cause

The page was not correctly fetching and mapping the user's application data with the corresponding internship information.

### Fix

Updated the application fetching logic to retrieve the user's applications and display the related internship details correctly.



## Bug 6 Duplicate Internship Records Appearing
### Problem

The internship catalog was displaying the same internship record multiple times. For example, the Content Design Intern entry was appearing twice in the internship listing.

### Root Cause

The issue was caused by duplicate records being present in the MongoDB collection after seeding the database. The seed process was inserting internship data without ensuring old records were cleared first.

### Fix

Updated the database seeding logic to clear existing internship records before inserting fresh seed data.

This ensures that every seed operation creates a clean dataset without duplicate internship entries.
---

# Feature 1: Save For Later

## Implementation

Implemented a bookmark system where users can save internships and view them later.

Since authentication was not required, the existing `CURRENT_USER_ID` constant from the frontend API utility is used.

---

## Backend Changes

Created:

* Bookmark Mongoose model
* Bookmark routes

Bookmarks are stored in MongoDB instead of browser storage.

Data stored:

```
{
 userId,
 internshipId,
 createdAt
}
```

---

## API Flow

### Save Internship

```
POST /api/bookmarks
```

Creates a bookmark.

---

### Remove Bookmark

```
DELETE /api/bookmarks/:id
```

Removes a saved internship.

---

### Get Saved Internships

```
GET /api/bookmarks/
```

Returns all bookmarked internships for the user.

---

## Frontend Changes

Added:

* Bookmark button on internship cards
* Bookmark button on internship details page
* `/saved` page

The saved page displays all internships bookmarked by the current user.

---

# Feature 2: Find Your Internship (AI Matcher)

## Overview

Implemented an AI-powered internship matching system.

Users provide:

* Field of study
* Year of study
* Skills
* Interests

The system returns the top 3 matching internships with a recommendation reason.

---

## User Flow

1. User enters profile information.

2. Frontend sends data to backend.

3. Backend collects internship catalog data.

4. Backend sends user profile + available internships to Groq API.

5. AI returns suitable internships.

6. Frontend displays recommendations with reasons.

---

## AI Provider

Used:

Groq API

Model:

```
llama-3.1-8b-instant
```

---

## AI Safety / Guardrails

To prevent the AI from creating fake internships:

* Only internship data from MongoDB catalog is provided to the model.
* AI is instructed to select only from available internship IDs.
* Backend validates returned internship IDs before sending response.

---

## AI Response Format

The backend expects structured output:

```json
[
  {
    "internshipId": "123",
    "reason": "Matches your React and frontend development skills"
  }
]
```

---

# Error Handling

Handled cases:

* AI API failure
* Invalid AI response
* Empty recommendations
* Backend API errors
* Loading state during recommendation generation

---

# Environment Variables

## Backend

Create `.env`

```
MONGODB_URI=
GROQ_API_KEY=
PORT=4000
```

---

## Frontend

Create `.env.local`

```
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

---


### Database Setup Using Docker

MongoDB was configured and run locally using Docker.

Start MongoDB Container
docker run -d \
  --name internship-mongodb \
  -p 27017:27017 \
  mongo

This starts a MongoDB container and exposes it on the local machine.

MongoDB Connection

The backend connects to MongoDB using the environment variable:

MONGODB_URI=mongodb://localhost:27017/internship-catalog
Check Running Containers
docker ps
Stop MongoDB Container
docker stop internship-mongodb
Start Existing MongoDB Container
docker start internship-mongodb

Using Docker makes the database setup consistent and avoids requiring a local MongoDB installation.


# Running Locally

## Backend

```
cd backend

npm install

npm run seed

npm run dev
```

Backend:

```
http://localhost:4000
```

---

## Frontend

```
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:3000
```

---

# Scaling Considerations

For production scale:

* Add caching for repeated AI recommendation requests.
* Implement rate limiting for AI endpoints.
* Queue AI requests using background workers.
* Monitor token usage and optimize prompts.
* Use cheaper models for simple matching tasks.

---

# What I Would Improve With More Time

* Add authentication and user profiles.
* Add application tracking.
* Improve recommendation ranking using embeddings/vector search.
* Add automated tests.
* Add pagination for internships.
* Add better monitoring and logging.
* Improve AI evaluation with feedback loops.

---

# Submission Notes

Implemented the requested bug fixes, Save for Later functionality, and AI-powered internship matching feature.

The focus was on minimal changes, clean API design, defensive AI integration, and maintaining the existing project structure.
