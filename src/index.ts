import dotenv from "dotenv"
dotenv.config()
import env from "config/env"

import { express as voyagerMiddleware } from "graphql-voyager/middleware"
import { ApolloServer, ApolloError, GraphQLUpload } from "apollo-server-express"
import { readFileSync } from "fs"
import { createServer } from "http"
import depthLimit from "graphql-depth-limit"
import DB from "config/connectDB"
import * as redis from "config/connectRedis"
import { permissions } from "lib"

import { makeExecutableSchema } from "@graphql-tools/schema"
import { applyMiddleware } from "graphql-middleware"
import * as graphqlScalars from 'graphql-scalars'

import express from "express"
import expressPlayground from "graphql-playground-middleware-express"
import { bodyParserGraphQL } from "body-parser-graphql"
import resolvers from "resolvers"
const typeDefsGraphQL = readFileSync("src/typeDefs.graphql", "utf-8")

const app = express()
app.use(bodyParserGraphQL())
app.use("/voyager", voyagerMiddleware({ endpointUrl: "/api" }))
app.use("/graphql", expressPlayground({ endpoint: "/api" }))
app.use("/api-docs", express.static("docs"))

app.get("/kakao-login", (req, res) => {
    res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REST_KEY}&redirect_uri=${env.REDIRECT_URI}&response_type=code`)
})

const schema = makeExecutableSchema({
    typeDefs: `
        ${graphqlScalars.typeDefs.join('\n')}
        ${typeDefsGraphQL}
    `,
    resolvers: {
        ...resolvers,
        Upload: GraphQLUpload as import("graphql").GraphQLScalarType,
        ...graphqlScalars.resolvers
    }
})

const start = async () => {
    const db = await DB.get()
    const server = new ApolloServer({
        schema: applyMiddleware(schema, permissions),
        context: async ({ req }) => {
            const uId = req.headers.authorization || ''
            const uName = await redis.get(uId)
            return { db, uId, redis, uName }
        },
        validationRules: [
            depthLimit(8)
        ]
    })

    server.applyMiddleware({
        app,
        path: "/api"
    })

    const httpServer = createServer(app)
    httpServer.timeout = 5000
    httpServer.listen({ port: env.PORT || 3000 }, () => {
        console.log(`GraphQL API Running at http://localhost:${env.PORT || 3000}/api`)
        console.log(`GraphQL Docs Running at http://localhost:${env.PORT || 3000}/api-docs`)
    })
}

start()