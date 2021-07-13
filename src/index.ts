import dotenv from "dotenv"
dotenv.config()
import env from "config/env"

import { express as voyagerMiddleware } from "graphql-voyager/middleware"
import { ApolloServer, ApolloError } from "apollo-server-express"
import { readFileSync } from "fs"
import { createServer } from "http"
import depthLimit from "graphql-depth-limit"
import DB from "config/connectDB"

import express from "express"
import expressPlayground from "graphql-playground-middleware-express"
import { bodyParserGraphQL } from "body-parser-graphql"
import resolvers from "resolvers"
const typeDefs = readFileSync("src/typeDefs.graphql", "utf-8")

const app = express()
app.use(bodyParserGraphQL())
app.use("/voyager", voyagerMiddleware({ endpointUrl: "/api" }))
app.use("/graphql", expressPlayground({ endpoint: "/api" }))
app.use("/api-docs", express.static("docs"))

const start = async () => {
    const db = await DB.get()
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => {
            return { db }
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