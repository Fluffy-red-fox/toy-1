import dotenv from "dotenv"
dotenv.config()
import env from "config/env"

import { ApolloServer, ApolloError } from "apollo-server-express"
import { readFileSync } from "fs"
import { createServer } from "http"
import DB from "config/connectDB"

import express from "express"
import { bodyParserGraphQL } from "body-parser-graphql"
import resolvers from "resolvers"
const typeDefs = readFileSync("src/typeDefs.graphql", "utf-8")

const app = express()
app.use(bodyParserGraphQL())

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
        const db = await DB.get()
        return { db }
    }
})

server.applyMiddleware({
    app,
    path: "/api"
})

const httpServer = createServer(app)
httpServer.timeout = 5000

export default httpServer
