# Search API Documentation

## Overview
The Search API is a Rust-based Actix application that provides endpoints to:
- Search for podcasts using either PodcastIndex or iTunes
- Search for podcasts by host/person
- Retrieve detailed podcast information by feed ID

The API is containerized and can be easily deployed using Docker.

## Setup Instructions

1. Get API Credentials
   - Visit [Podcast Index API Website](https://api.podcastindex.org/)
   - Sign up for free API credentials (recommended over iTunes)

2. Create Docker Configuration
   ```yaml
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

3. Create Environment File (env_file)
   ```
   API_KEY=your_api_key
   API_SECRET=your_api_secret
   ```
   Note: Using an env_file is required as Docker compose may not correctly interpret certain characters in environment variables.

4. Deploy the Container
   ```bash
   sudo docker-compose up
   ```

5. Configure Pinepods
   Update your Pinepods compose file with the API URL:
   ```yaml
   API_URL: 'http://<YOUR_IP>/api/search'
   ```
   Or with a domain:
   ```yaml
   API_URL: 'https://<YOUR_DOMAIN>/api/search'
   ```

## API Endpoints

### 1. Search Endpoint
```
GET /api/search
```

Parameters:
- `query` (string): The search term
- `index` (string): Search provider ('itunes' or 'podcastindex', defaults to 'podcastindex')
- `search_type` (string): Search type ('term' or 'person', defaults to 'term')

Example Requests:
```bash
# Standard podcast search
curl -X GET 'http://localhost:5000/api/search?query=mypodcast&index=podcastindex'

# Search by person/host
curl -X GET 'http://localhost:5000/api/search?query=joe%20rogan&search_type=person'

# iTunes search
curl -X GET 'http://localhost:5000/api/search?query=mypodcast&index=itunes'
```

### 2. Podcast Details Endpoint
```
GET /api/podcast
```

Parameters:
- `id` (string): The podcast feed ID

Example Request:
```bash
curl -X GET 'http://localhost:5000/api/podcast?id=12345'
```

## Response Format

### Standard Search Response
```json
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
      "trackCensoredName": "Python Bytes"
    }
  ],
  "resultCount": 50
}
```

### Person Search Response (PodcastIndex)
```json
{
  "status": "true",
  "feeds": [
    {
      "id": 12345,
      "title": "Podcast Title",
      "url": "https://example.com/feed.xml",
      "host": "John Doe",
      "description": "Podcast description"
    }
  ],
  "count": 10
}
```

### Error Response
For unsuccessful requests, you'll receive an appropriate HTTP status code and error message:
```
<< Received 404 >>
```

## Notes
- PodcastIndex is recommended over iTunes as it:
  - Provides more detailed metadata
  - Supports person/host searches
  - Respects user privacy
  - Offers better data accuracy
- The API includes CORS configuration allowing cross-origin requests
- Person search is only available when using PodcastIndex
- All endpoints support preflight caching for 1 hour
- Request rate limiting follows PodcastIndex API guidelines