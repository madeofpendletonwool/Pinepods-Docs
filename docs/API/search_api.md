# Search documentation

# Search API

## Overview

This API comes built into it's own container and is used to find new podcasts by returning results from either the podcast index or itunes depending on your selection. 

## Setup your own searching API

Head over to the podcast index API website and sign up to get your very own api and key. It's free and makes everything extra secure.
[Podcast Index API Website](https://api.podcastindex.org/)

Once you have it. Use this docker compose file

```
version: '3'
services:
    pypods-backend:
       image: madeofpendletonwool/pinepods_backend:latest
       container_name: pypods-be
       env_file: env_file
       ports:
            - 5000:5000
       restart: unless-stopped
```
You also need to create the env file. It should contain your api key and secret NOTE: You MUST use the env file. Docker compose will not interpret certain characters if not in an env file. Don't smash your face against that issue for hours like I did

PS The Itunes podcast API does not require an API key. It just tracks everything from everyone instead. I'd recommend using the podcast index unless your podcast isn't available there.

env_file
```
API_KEY=your_api_key
API_SECRET=your_api_secret
```

Now go ahead and ```sudo docker-compose up``` your file. Then, in the pinepods compose file update the api_url.

```
API_URL: 'http://<YOUR_IP>/api/search'
```

Or, even better, stick this behind a reverse proxy with your own domain as well.

```
API_URL: 'https://<YOUR_DOMAIN>/api/search'
```
## How it works

The Search API is a Flask application that provides an endpoint /api/search to search for podcasts on either the PodcastIndex or iTunes based on a provided search query.

API Endpoints:
```
GET /api/search

This endpoint performs a search for podcasts based on a provided search term.

Request Parameters:

query : string (the term to search)
index : string (the search index to use. 'itunes' or 'podcastindex'. If not provided, defaults to 'podcastindex')
```
Example usage with curl:
```
curl -X GET 'http://localhost:5000/api/search?query=mypodcast&index=itunes'
```
This command sends a GET request to the /api/search endpoint of the application with the query parameter set as 'mypodcast' and the index parameter set as 'itunes'.

Response:

The server responds with a JSON object containing the search results. If the request was not successful, the server responds with the error status code it received.

For instance, a successful response may look like:
```
{
    "results": [
        {
            "wrapperType": "track",
            "kind": "podcast",
            "collectionId": 123456,
            "trackId": 123456,
            "artistName": "Python Bytes",
            "collectionName": "Python Bytes",
            "trackName": "Python Bytes",
            "collectionCensoredName": "Python Bytes",
            "trackCensoredName": "Python Bytes",
            ...
        },
        ...
    ],
    "resultCount": 50
}
```
The results array contains the search results, and resultCount is the number of results. Each object in the results array represents a podcast and includes details about the podcast.

If the request was not successful, you might get a response like:
```
<< Received 404 >>
```
This means the server responded with a status code of 404, indicating that the requested resource was not found.