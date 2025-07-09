# Assessment Results Integration with PostgreSQL

## What is PostgreSQL?
PostgreSQL (Postgres) is a powerful, open-source relational database system. It is widely used in the industry for its reliability, scalability, and advanced features. We use Postgres to efficiently store and retrieve user assessment results for analytics and personalized feedback.

## Table Schema
Create a table to store each user's answer to each assessment question:

```sql
CREATE TABLE assessment_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    assessment_id INTEGER NOT NULL REFERENCES assessments(id),
    question_number INTEGER NOT NULL,
    selected_option INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_assessment ON assessment_results(assessment_id);
```

## Setting Up the Database
1. Install PostgreSQL locally or use a managed service (e.g., Supabase, Neon).
2. Create a database:
   ```sh
   createdb letsrise
   ```
3. Connect and run the schema above (e.g., with `psql letsrise`).

## Connecting from Next.js
1. Install the pg client:
   ```sh
   npm install pg
   ```
2. Add your connection string to `.env.local`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/letsrise
   ```
3. Create a database utility in `lib/db.js`:
   ```js
   import { Pool } from 'pg';
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   export default pool;
   ```

## API Endpoints

### Store Assessment Results
- **POST** `/api/assessment-result`
- Body: `{ user_id, assessment_id, question_number, selected_option }`
- Stores a single answer. Call this for each question answered.

### Retrieve Assessment Results
- **GET** `/api/assessment-result?user_id=123&assessment_id=1`
- Returns all answers for a user and assessment. Use this to calculate scores and show results on the dashboard.

## Example API Usage from Frontend
```js
// Store a result
await fetch('/api/assessment-result', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 123,
    assessment_id: 1,
    question_number: 1,
    selected_option: 2,
  }),
});

// Retrieve results
const res = await fetch('/api/assessment-result?user_id=123&assessment_id=1');
const data = await res.json();
```

## Security & Best Practices
- Never expose database credentials to the frontend.
- Validate and sanitize all input on the backend.
- Use environment variables for secrets.
- Use indexes for efficient queries.

## Calculating Identity Score & Dashboard Integration
- Use the GET endpoint to fetch all answers for a user/assessment.
- Calculate the identity score in your backend or dashboard page using the retrieved data.
- Display the score and feedback to the user on the dashboard. 