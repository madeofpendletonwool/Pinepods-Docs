# PinePods Search API Documentation

## 🔍 Overview

The PinePods Search API is a high-performance Rust-based Actix Web application that provides comprehensive podcast and YouTube channel discovery capabilities. The API supports multiple search providers and offers detailed content information retrieval.

### ✨ Key Features

- **Multi-Provider Search**: PodcastIndex, iTunes, and YouTube (YouTube is powered by a bundled `yt-dlp` — **no Google/YouTube API key or quota required**)
- **Flexible Search Types**: Search by podcast title, person/host, or YouTube channels
- **Real-time Statistics**: Built-in usage tracking and analytics
- **High Performance**: Rust-based with async processing
- **CORS Enabled**: Ready for web application integration
- **Containerized**: Docker-ready deployment

---

## 🚀 Quick Start

### Getting Required API Keys

- **PodcastIndex API** (Recommended): [Get free API credentials](https://api.podcastindex.org/)
- **Docker**: For containerized deployment

YouTube search needs **no API key** — the container bundles `yt-dlp`, which queries
YouTube directly. iTunes search also requires no key.

### Environment Configuration

Create an environment file with your API credentials:

```bash
# Required for PodcastIndex searches (iTunes and YouTube need no keys)
API_KEY=your_podcastindex_api_key
API_SECRET=your_podcastindex_api_secret

# Optional: Logging level
RUST_LOG=info
```

:::info YouTube uses yt-dlp, not the Google API
Earlier versions of this API used the YouTube Data API v3 and a `YOUTUBE_API_KEY`. That
is **no longer the case** — YouTube search and channel lookups now shell out to `yt-dlp`,
which the Docker image installs automatically. There is no API key to manage and no daily
quota to hit. If you build a custom image, make sure `yt-dlp` is on the `PATH` or YouTube
features will return a `yt-dlp not available` error.
:::

### Docker Deployment

```yaml
version: '3.8'
services:
  pinepods-search-api:
    image: madeofpendletonwool/pinepods_backend:latest
    container_name: pinepods-search-api
    env_file: .env
    ports:
      - "5000:5000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/search"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### PinePods Integration

Update your PinePods configuration:

```yaml
# For local deployment
API_URL: 'http://localhost:5000/api/search'

# For production with domain
API_URL: 'https://your-domain.com/api/search'
```

---

## 📚 API Reference

### Base URL
```
http://localhost:5000
```

### Authentication

The API handles authentication automatically using configured environment variables. No additional authentication headers are required from clients.

---

## 🔗 Endpoints

### 1. Universal Search

**Endpoint:** `GET /api/search`

**Description:** Search for podcasts across multiple providers or YouTube channels

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes* | - | Search term or query |
| `index` | string | No | `podcastindex` | Search provider: `podcastindex`, `itunes`, or `youtube` |
| `search_type` | string | No | `term` | Search type: `term` or `person` (PodcastIndex only) |

*When both `query` and `index` are omitted, returns a health check response.

#### Provider-Specific Features

##### PodcastIndex (Recommended)
- **Term Search**: `/search/byterm` - General podcast search
- **Person Search**: `/search/byperson` - Search by host/person name
- **Advanced Metadata**: Rich podcast information
- **Privacy Focused**: No user tracking

##### iTunes
- **Term Search Only**: Basic podcast discovery
- **Limited Metadata**: Standard iTunes podcast data

##### YouTube
- **Channel Search**: Discover YouTube channels (results are deduplicated by channel, up to ~25)
- **Powered by yt-dlp**: No API key or quota required
- **Thumbnails & recent videos**: Channel details include the most recent videos (see the
  `/api/youtube/channel` endpoint)

#### Example Requests

```bash
# Health Check
curl -X GET 'http://localhost:5000/api/search'
# Returns: "Test connection successful"

# PodcastIndex Term Search
curl -X GET 'http://localhost:5000/api/search?query=python%20podcast&index=podcastindex'

# PodcastIndex Person Search
curl -X GET 'http://localhost:5000/api/search?query=joe%20rogan&index=podcastindex&search_type=person'

# iTunes Search
curl -X GET 'http://localhost:5000/api/search?query=tech%20news&index=itunes'

# YouTube Channel Search
curl -X GET 'http://localhost:5000/api/search?query=programming&index=youtube'
```

---

### 2. Podcast Details

**Endpoint:** `GET /api/podcast`

**Description:** Retrieve detailed information for a specific podcast using its feed ID

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | PodcastIndex feed ID |

#### Example Request

```bash
curl -X GET 'http://localhost:5000/api/podcast?id=920666'
```

---

### 3. YouTube Channel Details

**Endpoint:** `GET /api/youtube/channel`

**Description:** Get YouTube channel information and its most recent videos (up to 15),
fetched via `yt-dlp`.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | YouTube Channel ID |

:::note
`subscriberCount` and `videoCount` are part of the response shape but are **not currently
populated** by the `yt-dlp` flat fetch — they are returned as `null`. The
`recentVideos` array (id, title, description, url, thumbnail, `publishedAt`, and a
`PT#M#S` ISO-8601 `duration`) is the data PinePods actually uses.
:::

#### Example Request

```bash
curl -X GET 'http://localhost:5000/api/youtube/channel?id=UCXuqSBlHAE6Xw-yeJA0Tunw'
```

---

### 4. API Statistics

**Endpoint:** `GET /api/stats`

**Description:** Retrieve real-time API usage statistics and metrics

#### Example Request

```bash
curl -X GET 'http://localhost:5000/api/stats'
```

---

## 📄 Response Formats

### PodcastIndex Search Response

```json
{
  "status": "true",
  "feeds": [
    {
      "id": 920666,
      "title": "Python Bytes",
      "url": "https://pythonbytes.fm/episodes/rss",
      "originalUrl": "https://pythonbytes.fm/episodes/rss",
      "link": "https://pythonbytes.fm",
      "description": "Python Bytes is a weekly podcast...",
      "author": "Michael Kennedy and Brian Okken",
      "ownerName": "Michael Kennedy",
      "image": "https://pythonbytes.fm/static/img/podcast-logo.png",
      "artwork": "https://pythonbytes.fm/static/img/podcast-logo.png",
      "lastUpdateTime": 1640995200,
      "lastCrawlTime": 1640995800,
      "lastParseTime": 1640995850,
      "lastGoodHttpStatusTime": 1640995900,
      "lastHttpStatus": 200,
      "contentType": "application/rss+xml",
      "itunesId": 1173964558,
      "generator": "custom",
      "language": "en",
      "type": 0,
      "dead": 0,
      "crawlErrors": 0,
      "parseErrors": 0
    }
  ],
  "count": 25,
  "query": "python podcast",
  "description": "Found matching feeds."
}
```

### iTunes Search Response

```json
{
  "resultCount": 25,
  "results": [
    {
      "wrapperType": "track",
      "kind": "podcast",
      "collectionId": 1173964558,
      "trackId": 1173964558,
      "artistName": "Michael Kennedy and Brian Okken",
      "collectionName": "Python Bytes",
      "trackName": "Python Bytes",
      "collectionCensoredName": "Python Bytes",
      "trackCensoredName": "Python Bytes",
      "collectionViewUrl": "https://podcasts.apple.com/us/podcast/python-bytes/id1173964558",
      "feedUrl": "https://pythonbytes.fm/episodes/rss",
      "trackViewUrl": "https://podcasts.apple.com/us/podcast/python-bytes/id1173964558",
      "artworkUrl30": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts123/v4/f4/89/c4/f489c4e7-35cb-474d-bf4f-0ccf67e861b0/mza_2029009828340268613.jpg/30x30bb.jpg",
      "artworkUrl60": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts123/v4/f4/89/c4/f489c4e7-35cb-474d-bf4f-0ccf67e861b0/mza_2029009828340268613.jpg/60x60bb.jpg",
      "artworkUrl100": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts123/v4/f4/89/c4/f489c4e7-35cb-474d-bf4f-0ccf67e861b0/mza_2029009828340268613.jpg/100x100bb.jpg",
      "collectionPrice": 0.00,
      "trackPrice": 0.00,
      "releaseDate": "2024-01-15T08:00:00Z",
      "collectionExplicitness": "cleaned",
      "trackExplicitness": "cleaned",
      "trackCount": 350,
      "trackTimeMillis": 1800000,
      "country": "USA",
      "currency": "USD",
      "primaryGenreName": "Technology",
      "contentAdvisoryRating": "Clean",
      "genreIds": ["1318", "26", "1528"]
    }
  ]
}
```

### YouTube Channel Search Response

```json
{
  "results": [
    {
      "channelId": "UCXuqSBlHAE6Xw-yeJA0Tunw",
      "name": "Linus Tech Tips",
      "description": "We make videos and stuff, cool eh?",
      "thumbnailUrl": "https://yt3.ggpht.com/ytc/AKedOLQDwRAKGBtB4wWJKcAABhCRYrvhSGJr5yLO=s240-c-k-c0x00ffffff-no-rj",
      "url": "https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw"
    }
  ]
}
```

### YouTube Channel Details Response

```json
{
  "channelId": "UCXuqSBlHAE6Xw-yeJA0Tunw",
  "name": "Linus Tech Tips",
  "description": "We make entertaining videos about technology...",
  "thumbnailUrl": "https://yt3.ggpht.com/ytc/AKedOLQDwRAKGBtB4wWJKcAABhCRYrvhSGJr5yLO=s800-c-k-c0x00ffffff-no-rj",
  "url": "https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw",
  "subscriberCount": 15400000,
  "videoCount": 6000,
  "recentVideos": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Latest Tech Review",
      "description": "Today we're looking at...",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      "publishedAt": "2024-01-15T10:00:00Z",
      "duration": "PT10M30S"
    }
  ]
}
```

### API Statistics Response

```json
{
  "api_usage": {
    "itunes_hits": 1250,
    "podcast_index_hits": 3420,
    "youtube_hits": 890,
    "total_hits": 5560
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Invalid parameters or malformed request |
| `404` | Not Found | Resource not found (podcast ID, channel ID) |
| `500` | Internal Server Error | API credentials missing, external API failure |
| `503` | Service Unavailable | External API rate limiting or downtime |

### Error Response Format

Errors are returned as a **plain-text body** with the relevant HTTP status code (most
failures are `500`), not as a JSON envelope. For example:

```
API_KEY not set
```

### Common Error Messages

- `"API_KEY not set"` - PodcastIndex API key missing
- `"API_SECRET not set"` - PodcastIndex API secret missing
- `"yt-dlp not available"` - `yt-dlp` is not installed / not on the `PATH`
- `"yt-dlp search failed"` - YouTube channel search via `yt-dlp` failed
- `"yt-dlp channel fetch failed"` - Fetching a channel's videos via `yt-dlp` failed
- `"Channel not found or has no videos"` - YouTube channel ID invalid or empty
- `"Failed to parse response body"` - External API returned invalid data

---

## 🔧 Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_KEY` | Yes (for PodcastIndex) | - | PodcastIndex API Key |
| `API_SECRET` | Yes (for PodcastIndex) | - | PodcastIndex API Secret |
| `RUST_LOG` | No | `info` | Logging level (`error`, `warn`, `info`, `debug`, `trace`) |

iTunes and YouTube require no environment configuration — iTunes is keyless and YouTube
is served by the bundled `yt-dlp`.

### Network Configuration

- **Port**: `5000` (configurable in source)
- **Binding**: `0.0.0.0:5000` (all interfaces)
- **CORS**: Enabled for all origins (self-hosted friendly)
- **Timeout**: 30 seconds for external API calls
- **User-Agent**: `PodPeopleDB/1.0`

---

## 💡 Best Practices

### Search Provider Selection

1. **PodcastIndex** (Recommended)
   - ✅ Privacy-focused, no tracking
   - ✅ Rich metadata and advanced search
   - ✅ Person/host search capability
   - ✅ Open-source friendly
   - ✅ Fast and reliable

2. **iTunes**
   - ✅ No API key required
   - ❌ Limited search capabilities
   - ❌ Basic metadata only
   - ❌ Apple ecosystem focused

3. **YouTube**
   - ✅ Video content discovery
   - ✅ No API key required (uses bundled `yt-dlp`)
   - ✅ Rich media thumbnails and recent videos
   - ❌ Subject to YouTube's own rate limiting / anti-bot measures; keep `yt-dlp` updated

### Performance Optimization

- **Caching**: Implement client-side caching for frequently accessed content
- **Rate Limiting**: Respect external rate limits (PodcastIndex: no limit; YouTube: no API quota, but YouTube may throttle scraping — keep `yt-dlp` current)
- **Batch Requests**: Use appropriate search result limits (max 25-50 results)
- **Error Handling**: Implement retry logic with exponential backoff

### Security Considerations

- **API Keys**: Store in environment variables, never in code
- **CORS**: Configure appropriately for your domain in production
- **HTTPS**: Use HTTPS in production deployments
- **Input Validation**: Sanitize search queries on the client side

---

## 🔍 Troubleshooting

### Common Issues

#### "API_KEY not set" Error
```bash
# Check environment variables are loaded
docker exec -it pinepods-search-api env | grep API

# Verify .env file format (no spaces around =)
API_KEY=your_key_here
API_SECRET=your_secret_here
```

#### No Search Results
```bash
# Test API connectivity
curl -v http://localhost:5000/api/search

# Check specific provider
curl -v "http://localhost:5000/api/search?query=test&index=podcastindex"
```

#### YouTube Search Not Working
```bash
# Test a YouTube search
curl -v "http://localhost:5000/api/search?query=test&index=youtube"

# Confirm yt-dlp is installed and on PATH inside the container
docker exec -it pinepods-search-api yt-dlp --version

# A "yt-dlp not available" response means yt-dlp is missing from the image.
# Persistent failures usually mean yt-dlp is out of date — update it:
docker exec -it pinepods-search-api yt-dlp -U
```

### Logging and Monitoring

```bash
# View API logs
docker logs pinepods-search-api

# Follow logs in real-time
docker logs -f pinepods-search-api

# Set debug logging
# In .env file:
RUST_LOG=debug
```

### Health Checks

```bash
# Basic health check
curl http://localhost:5000/api/search
# Expected: "Test connection successful"

# API statistics
curl http://localhost:5000/api/stats
# Expected: JSON with usage statistics
```

---

## 📈 Monitoring and Analytics

The API provides built-in usage tracking accessible via the `/api/stats` endpoint:

- **Request Counting**: Tracks usage per provider
- **Real-time Statistics**: Live usage data
- **Timestamp Tracking**: When statistics were generated
- **Total Aggregation**: Combined usage across all providers

Integrate with your monitoring solution:

```bash
# Prometheus metrics endpoint (manual implementation)
curl http://localhost:5000/api/stats

# Example integration with monitoring script
#!/bin/bash
STATS=$(curl -s http://localhost:5000/api/stats)
echo "pinepods_api_total_requests $(echo $STATS | jq '.api_usage.total_hits')"
```

---

## 🚀 Production Deployment

### Docker Compose (Production)

```yaml
version: '3.8'
services:
  pinepods-search-api:
    image: madeofpendletonwool/pinepods_backend:latest
    container_name: pinepods-search-api
    env_file: .env.production
    ports:
      - "127.0.0.1:5000:5000"  # Bind to localhost only
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/search"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (if needed)
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        
        # Caching for static responses
        location /api/stats {
            expires 30s;
            add_header Cache-Control "public, no-transform";
        }
    }
}
```

---

*This documentation covers PinePods Search API v1.0. For the latest updates and additional information, visit the [PinePods GitHub repository](https://github.com/madeofpendletonwool/PinePods).*