# Reverse Proxy Configuration

## Nginx
To be added.

## Nginx Proxy Manager
To be added.

## Traefik

### Pinepods 
For Pinepods to be functioning behind a reverse proxy there are three services that will need to be allocated a subdomain each.
  1. Pinepods Webui - `https://pinepods.server.tld`
  2. Pinepods Proxy - `https://pinepods-proxy.server.tld`
  3. Pinepods Client API - `https://pinepods-api.server.tld`

The below labels will run the above format in Traefik with an entry point of `websecure`

```yaml
        labels:
            # Pinepods Webui
            - "traefik.http.routers.pinepods.entrypoints=websecure"
            - "traefik.http.routers.pinepods.service=pinepods"
            - "traefik.http.routers.pinepods.rule=Host(`pinepods.server.tld`)"
            - "traefik.http.services.pinepods.loadbalancer.server.port=8034"
            # PinePods Proxy
            - "traefik.http.routers.pinepods-proxy.entrypoints=websecure"
            - "traefik.http.routers.pinepods-proxy.service=pinepods-proxy"
            - "traefik.http.routers.pinepods-proxy.rule=Host(`pinepods-proxy.server.tld`)"
            - "traefik.http.services.pinepods-proxy.loadbalancer.server.port=8000"
            # Pinepods Client API
            - "traefik.http.routers.pinepods-api.entrypoints=websecure"
            - "traefik.http.routers.pinepods-api.service=pinepods-api"
            - "traefik.http.routers.pinepods-api.rule=Host(`pinepods-api.server.tld`)"
            - "traefik.http.services.pinepods-api.loadbalancer.server.port=8032"
```

### Pinepods Search API
There's no absolute need to put the [Search API container](https://www.pinepods.online/docs/API/search_api) behind a reverse proxy as it can be run locally for access only to your own Pinepods instance, however if you wish to make the API availeble on WAN then the below labels will run an instance on `https://pinepods-seach-api.server.tld`
```yaml
        labels:
            # Pinepods Search API
            - "traefik.http.routers.pinepods-search-api.entrypoints=websecure"
            - "traefik.http.routers.pinepods-search-api.service=pinepods-search-api"
            - "traefik.http.routers.pinepods-search-api.rule=Host(`pinepods-search-api.server.tld`)"
            - "traefik.http.services.pinepods-search-api.loadbalancer.server.port=5000"
```

Within your Pinepods docker compose file the variable `API_URL` should then be set as 
```
API_URL=https://pinepods-search-api.server.tld/api/search`
```
