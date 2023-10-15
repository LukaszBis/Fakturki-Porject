# Fakturki-Project

## Description
It's inovoice app that we crated as a team in university classes.<br>
If you want to run the application first you need to download [Docker Desktop](https://www.docker.com/get-started/).<br>
Then if you want to see what is going on in database you will need [MongoDBCompass](https://www.mongodb.com).

## Ho to start the application
The app start with command ```docker-compose up --build -d```

## How to acces to the application
- Access to application is via http://localhost:5173
- Access to backend is via http://localhost:8080
- Access to database is via **MongoDBCompass** application and connect to "http://localhost:27017"

## How to stop the application
To stop the application you need to type command ```docker-compose down```