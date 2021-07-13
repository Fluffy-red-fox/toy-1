const config = {
    DB_HOST: process.env.DB_HOST || "mongodb://localhost:27017/test",
    PORT: process.env.PORT || 3000,
    REDIS_HOST: process.env.REDIS_HOST || "redis://127.0.0.1",
    REDIRECT_URI: process.env.REDIRECT_URI || "http://localhost/auth",
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.NODE_ENV === "test" ? process.env.AWS_BUCKET_TEST : process.env.AWS_BUCKET,
    SECRET_KEY: process.env.SECRET_KEY as string,
    ACCESS_KEY: process.env.ACCESS_KEY as string,
    REGION: process.env.REGION as string,
    END_POINT: process.env.END_POINT
}

export default config