import { ObjectID } from "mongodb"
import { PostArgs } from "resolvers/app/share/models"
export interface Post extends PostArgs {
    _id: ObjectID
}


export const Post = {
    postId: (parent: Post) => parent._id
}