# Arcade Hoops Challenge 🏀

A web-based basketball arcade game with real-time leaderboards, achievements, and **hardware integration**: the web app sends commands to an ESP32/Arduino through Firebase to control the physical arcade machine.

> School project (STI College Las Piñas, 2025) – BS Information Technology

## Features
- Player registration and login
- 3 timed rounds, each with its own duration and target score
- Real-time leaderboard and player achievements
- Admin panel: password-reset requests, user management, system logs
- ESP32/Arduino integration via Firebase Realtime Database (`arduino/command`):
  `START_GAME`, `ROUND:<n>`, `ROUND_END`, `END_GAME`

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (ES modules) |
| Backend | ASP.NET Core 8 (C#), Swagger |
| Database | Firebase Realtime Database |
| Hardware | ESP32 / Arduino (reads game commands from Firebase) |

## Project Structure
```
arcade-hoops-challenge/
├── ArcadeHoopers/                      # Web frontend, served by ASP.NET Core (wwwroot/)
│                                       # plus an in-memory demo API (/api/firebase)
└── ArcadeHoopsBackend_FirebaseReady/   # REST API (/api/game) that saves scores to Firebase
```

## How to Run
1. Install the [.NET 8 SDK](https://dotnet.microsoft.com/download).
2. Frontend:
   ```bash
   cd ArcadeHoopers
   dotnet run
   ```
   Then open the URL shown in the console.
3. Backend API (optional):
   ```bash
   cd ArcadeHoopsBackend_FirebaseReady
   dotnet run
   ```
   Swagger UI opens at `/swagger`.
4. To use your own Firebase project, replace the `firebaseConfig` in `ArcadeHoopers/wwwroot/index.html` and the `Firebase:BaseUrl` in `ArcadeHoopsBackend_FirebaseReady/appsettings.json`.

## Screenshots
_Add screenshots of the login screen, game screen, leaderboard, and the physical arcade here._

## Known Limitations / Future Improvements
This was built as a school project, so some parts are simplified:
- Player passwords are stored as plain text in Firebase. A production version should use Firebase Authentication or hashed passwords.
- Firebase Security Rules should be restricted before any public deployment.
- The ESP32/Arduino firmware is not included in this repository.

## Author
Princess Mae N. Mahusay – BSIT, STI College Las Piñas
