# Hermes-proxy

To run hermes proxy use `npm start -- [opts]` or use `node ./bin/hermes-proxy [opts]`

Try `npm start -- --help` to get started

### Quick Setup

First run `npm install` in this directory

## Options

| Argument | Description | Default |
|:--|:--|:--|
| **protocol** | protocol for the proxy manager, defaults to http | `http` |
| **port** | port for the proxy manager | - |
| **domain** | domain for the proxy manager | `localhost` |
| **no-retry** | do not retry if the connection fails | `false` |

## Proxy Socket Commands

The proxy server once connected accepts the following commands

| Command | Description |
|:--|:--|
| **startup** | start the proxy server with a *config object* see below |
| **enable** | the proxy will cache traffic and make requests when not cached |
| **disable** | the proxy will only return cached traffic |
| **close** | kill the proxy service |

## Proxy Config object

```javascript
{
  "httpPort": "",
  "httpsPort": ""
}
```
