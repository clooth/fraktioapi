# fraktio api

## configuration

### environment variables

```
API_USERNAME = fraktio.fi/wp-json/ basic auth username
API_PASSWORD = fraktio.fi/wp-json/ basic auth password
API_PORT = node process port, default: 1337
```

### process.json

```
{
  apps: [{
    name: "fraktioapi",
    script: "./index.js",
    instances: 2,
    exec_mode: "cluster"
  }]
}
```
