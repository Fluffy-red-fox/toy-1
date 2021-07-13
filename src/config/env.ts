const config = {
    DB_HOST: process.env.DB_HOST || "mongodb://localhost:27017/test",
    PORT: process.env.PORT || 3000,
    REDIS_HOST: process.env.REDIS_HOST || "redis://127.0.0.1",
    REDIRECT_URI: process.env.REDIRECT_URI || "http://localhost/auth"
}

export default config