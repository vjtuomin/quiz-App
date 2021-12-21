How to run the application locally:

1.Download and unzip the zip file

2. Change the database configurations in config.js

config.database = { hostname: database: user: password: port: };

}, CONCURRENT_CONNECTIONS);

3. Go to the directory of the app and run the application from command line:
   deno run --allow-net --allow-read --unstable run-locally.js

   4. Open browser and go to http://localhost:7777/

Running the tests:

deno test --allow-net --allow-read --unstable

Address: https://quiz-appvt.herokuapp.com/
