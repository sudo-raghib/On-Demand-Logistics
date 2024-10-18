## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time Communication:** Socket.io
- **Others:** [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) (to get current location at driver's end)

## Installation

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   yarn install
    ```

2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   yarn install
   ```

## Running the Application

1. Start MongoDB instance on `27017` port.
2. Start the backend server:

   ```bash
   yarn dev
   ```
4. Start the frontend server:

   ```bash
     yarn dev
   ```

Open [http://localhost:5173](http://localhost:5173) to view the application in the browser.
