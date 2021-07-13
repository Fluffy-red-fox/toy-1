import { ReadStream, WriteStream } from "fs-capacitor"
import env from "config/env"
import AWS from "aws-sdk"

const region = env.AWS_REGION

const S3 = new AWS.S3({
    endpoint: new AWS.Endpoint(env.END_POINT as string),
    region,
    credentials: {
        accessKeyId: env.ACCESS_KEY,
        secretAccessKey: env.SECRET_KEY
    }
})
const Bucket = env.AWS_BUCKET as string
export const uploadS3 = async (fileStream: ReadStream, Key: string, ContentType: string) => {
    const params = {
        Bucket,
        Key,
        Body: fileStream,
        ACL: "public-read",
        ContentType
    }
    await S3.upload(params).promise()
}


const validImageExtensions = [".jpg", ".jpeg", ".png"]

export const isValidImage = (fileName: String) => {
    for (const extension of validImageExtensions) {
        if (fileName.endsWith(extension) === true) {
            return true
        }
    }
    return false
}