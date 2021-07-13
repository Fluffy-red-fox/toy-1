import { Mutation as auth } from "resolvers/app/auth"
import { Mutation as share } from "resolvers/app/share"
export default {
    ...auth,
    ...share
}