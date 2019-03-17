const PROXY_CONFIG = {
    "/api/*": {
        "target": "http://localhost:3000",
        "secure": true,
        "changeOrigin": true,
        "logLevel": "debug"
    }
}

module.exports = PROXY_CONFIG;
