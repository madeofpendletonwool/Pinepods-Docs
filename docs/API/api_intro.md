# API Documentation

There's actually 2 platforms that utilize APIs in Pinepods. I will make documents going over the details on both of them. 

## Search API

The search API is used for finding new podcasts. In order for Pinepods to search the podcast index or itunes it needs to be directed to a location where it can recieve information about indexed podcasts in a format it can understand. In addition, I needed a way to allow users to access data over these external APIs without a private API key. For those reasons, the Pinepods search container was born. You can request an API key from the podcast index and host this container yourself. Otherwise, you can just use api.pinepods.online

## Database API

The database portion of the API is the interaction that Pinepods client or web has with the database. Both version interact using the same FastAPI python file. The difference is that at application startup the web version generates and applies it's own api key while api keys for the app/client version must be input when you start the app. The FastAPI python file is ran from the main pinepods container. It uses a seperate port from the web version of the app that is setup within the docker container env variables. 

Continue on into the documentation pages for these APIs to get an understanding on how they work and how to access data over each of them.