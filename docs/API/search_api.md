# Setup your own searching API

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