import { Db } from "mongodb"

export const getMyPosts = async (
    parent: void,
    args: void, {
        db,
        uName
    }: {
        db: Db,
        uName: string
    }
) => db.collection("post").find({ uName }).sort({ _id: - 1 }).toArray()