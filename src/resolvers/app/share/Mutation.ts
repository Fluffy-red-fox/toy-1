import { uploadS3, isValidImage } from "lib"
import { File } from "config/types"
import { Db } from "mongodb"
import { join } from "path"
import { ApolloError } from "apollo-server-express"
import env from "config/env"

export const uploadImage = async (
    parent: void, {
        image
    }: {
        image: File
    }, {
        db
    }: {
        db: Db
    }) => {
    const file = await image
    if (false === isValidImage(file.filename)) {
        return new ApolloError("파일이 올바르지 않습니다")
    }
    try {
        const stream = file.createReadStream()
        const fileName = `${Date.now()}-${file.filename}`
        await uploadS3(stream, fileName, file.mimetype)
        return `${env.END_POINT}/${env.AWS_BUCKET}/${fileName}`
    } catch {
        return false
    }
}