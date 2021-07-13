import { rule, shield } from "graphql-shield"
import { ApolloError } from "apollo-server-express"

const isValid = rule()((parent: void, args: void, { uName }: { uName: string | null }) => {
    if (uName === null) {
        return new ApolloError("check authorization token")
    }
    return true
})

export const permissions = shield({
    Query: {

    },
    Mutation: {

    }
})