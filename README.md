# Letsrise Webapp

## What is Letsrise?
Letsrise is a platform that helps accelerators post their openings and enables entrepreneurs to apply. It also offers identity assessments, courses, and team matching. Our goal is to make the application process for accelerators more fair, efficient, and successful for everyone involved.

## Who is this for?
- **Entrepreneurs:** Take assessments, join courses, and match with cofounders or teams.
- **Accelerators:** Post openings, filter applicants, and find the best startups (coming soon).
- **Investors:** Discover promising startups and track accelerator cohorts (coming soon).

## Design Considerations
- **Role-based Experience:** Users choose their role (Entrepreneur, Accelerator, Investor) right after login for a personalized experience.
- **Modern, Friendly UI:** The app uses a clean, modern design with clear navigation and helpful feedback.
- **Admin Dashboard:** A powerful admin area lets platform managers see users, applications, reports, and more.
- **Separation of Concerns:** The database and backend logic are separated so each team can work independently.
- **Security:** Sensitive information (like API keys) is never stored in the codebase.

## How to Get Started

### 1. Clone the Project
- **Windows:**
  1. Install [Git for Windows](https://git-scm.com/download/win) if you don't have it.
  2. Open Git Bash or Command Prompt.
  3. Run:
     ```sh
     git clone https://github.com/HailemariamMersha/letsrise-webapp.git
     cd letsrise-webapp
     ```
- **Mac:**
  1. Open Terminal.
  2. Run:
     ```sh
     git clone https://github.com/HailemariamMersha/letsrise-webapp.git
     cd letsrise-webapp
     ```

### 2. Install Dependencies
- **Windows:**
  - Open Command Prompt or PowerShell in the project folder and run:
    ```sh
    npm install
    ```
- **Mac:**
  - In Terminal, run:
    ```sh
    npm install
    ```

### 3. Set Up Environment Variables
- Copy `.env.example` to `.env.local`:
  ```sh
  cp .env.example .env.local
  ```
- Add your Firebase credentials and any other required variables to `.env.local`.
- **Note:** The database is handled separately. The next developer should connect their own database logic.

### 4. Run the App Locally
- **Windows:**
  ```sh
  npm run dev
  ```
- **Mac:**
  ```sh
  npm run dev
  ```
- Open your browser and go to [http://localhost:3000](http://localhost:3000)

## What Happens Next?
- After login, you’ll be asked to choose your role (Entrepreneur, Accelerator, Investor).
- Entrepreneurs can take assessments, join courses, and more.
- Admins can access `/admin` for the full dashboard.
- Accelerators and Investors will see a "Coming Soon" message (these features are being built).

## For Developers
- All backend/database logic is to be added by the next developer.
- The UI and frontend logic are ready for integration.
- Use feature branches and pull requests for changes.
- Keep all secrets out of the repo.
- Keep code modular and well-documented.

## License
MIT
