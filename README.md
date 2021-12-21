# Application

Quiz app course project, where users can create questions and answer other users
questions. Questions created can only have one correct answer for app to work at
the moment

# Running the application

Application can used here https://quiz-appvt.herokuapp.com/

How to run the application locally if you want to:

1. Download and unzip the zip file

2. You need to make a PostgreSQL database with the following tables:

   CREATE TABLE users ( id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE,
   password CHAR(60) );

CREATE TABLE questions ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES
users(id), title VARCHAR(256) NOT NULL, question_text TEXT NOT NULL );

CREATE TABLE question_answer_options ( id SERIAL PRIMARY KEY, question_id
INTEGER REFERENCES questions(id), option_text TEXT NOT NULL, is_correct BOOLEAN
DEFAULT false );

CREATE TABLE question_answers ( id SERIAL PRIMARY KEY, user_id INTEGER
REFERENCES users(id), question_id INTEGER REFERENCES questions(id),
question_answer_option_id INTEGER REFERENCES question_answer_options(id),
correct BOOLEAN DEFAULT false );

CREATE UNIQUE INDEX ON users((lower(email)));

3. Change the database configurations in config.js

config.database = { hostname: database: user: password: port: };

}, CONCURRENT_CONNECTIONS);

4. Go to the root directory of the app and run the application from command
   line: deno run --allow-net --allow-read --unstable run-locally.js

   5. Open browser and go to http://localhost:7777/

## Running the tests: Change id:s in the tests in to match existing id:s in your

own database

Run the tests: deno test --allow-net --allow-read --unstable
