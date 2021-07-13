import app from "test"
import request from "supertest"
import fetch from "node-fetch"
import { deepStrictEqual as equal } from "assert"
import * as redis from "config/connectRedis"
import DB from "config/connectDB"
const fileUpload = (query: string, variables: { [x: string]: string }) => {
    const map = Object.assign({}, Object.keys(variables).map(key => [`variables.${key}`]))
    const response = request(app)
        .post("/api")
        .set("Content-Type", "multipart/form-data")
        .field("operations", JSON.stringify({ query }))
        .field("map", JSON.stringify(map))

    Object.values(variables).forEach((value, i) => {
        response.attach(`${i}`, value)
    })
    return response
}

const uri: string[] = []

describe("Share service", () => {
    before(async () => {
        await redis.setex("test-authrization-token", 180, "erolf0123")
    })
    after(async () => {
        const db = await DB.get()
        await db.collection("post").deleteMany({})
    })
    describe("Uplaod", () => {
        describe("Success", () => {
            it("If you uploaded files normally .jpeg", async () => {
                const query = `
                    mutation($file: Upload!){
                        uploadImage(
                            image: $file
                        )
                    }`
                const { body } = await fileUpload(query, {
                    file: "src/test/test.jpeg"
                })
                const result = await fetch(body.data.uploadImage, {
                    method: "GET"
                })
                uri.push(body.data.uploadImage)
                equal(result.status, 200)
            }).timeout(5000)
            it("If you uploaded files normally .jpg", async () => {
                const query = `
                    mutation($file: Upload!){
                        uploadImage(
                            image: $file
                        )
                    }`
                const { body } = await fileUpload(query, {
                    file: "src/test/test.jpg"
                })
                const result = await fetch(body.data.uploadImage, {
                    method: "GET"
                })
                uri.push(body.data.uploadImage)
                equal(result.status, 200)
            }).timeout(5000)
            it("If you uploaded files normally .png", async () => {
                const query = `
                    mutation($file: Upload!){
                        uploadImage(
                            image: $file
                        )
                    }`
                const { body } = await fileUpload(query, {
                    file: "src/test/test.png"
                })
                const result = await fetch(body.data.uploadImage, {
                    method: "GET"
                })
                uri.push(body.data.uploadImage)
                equal(result.status, 200)
            }).timeout(5000)
        })
        describe("Failure", () => {
            it("If you uploaded a file that wasn't a picture", async () => {
                const query = `
                    mutation($file: Upload!){
                        uploadImage(
                            image: $file
                        )
                    }`
                const { body } = await fileUpload(query, {
                    file: "src/test/test.zip"
                })
                equal(body.errors[0].message, "파일이 올바르지 않습니다")
            })
        })
    })

    describe("Create Post", () => {
        describe("Failure", () => {
            it("Authorization error - 1", async () => {
                const query = `
                    mutation{
                        createPost(
                            comment:"test-comment",
                            imageURI:"${uri[0]}"
                        ){
                            postId
                        }
                    }
                `
                const { body } = await request(app)
                    .post("/api")
                    .set({
                        "Content-Type": "application/json",
                        // "Authorization": "test-authrization-token"
                    })
                    .send(JSON.stringify({ query }))
                    .expect(200)
                equal(body.errors[0].message, "check authorization token")
            })
            it("Authorization error - 2", async () => {
                const query = `
                    mutation{
                        createPost(
                            comment:"test-comment",
                            imageURI:"${uri[0]}"
                        ){
                            postId
                        }
                    }
                `
                const { body } = await request(app)
                    .post("/api")
                    .set({
                        "Content-Type": "application/json",
                        "Authorization": "test-authrization-WoW"
                    })
                    .send(JSON.stringify({ query }))
                    .expect(200)
                equal(body.errors[0].message, "check authorization token")
            })
        })
        describe("Success", () => {
            it("If you successfully create a post normally", async () => {
                const query = `
                    mutation{
                        createPost(
                            comment:"test-comment",
                            imageURI:"${uri[0]}"
                        ){
                            comment
                            postId
                        }
                    }
                `
                const { body } = await request(app)
                    .post("/api")
                    .set({
                        "Content-Type": "application/json",
                        "Authorization": "test-authrization-token"
                    })
                    .send(JSON.stringify({ query }))
                    .expect(200)
                equal(body.data.createPost.comment, "test-comment")
            })
        })
    })

    describe("Read Post", () => {
        describe("Failure", () => {
            it("Authorzation error", async () => {
                const query = `
                    query{
                        getMyPosts{
                            postId
                            comment
                            imageURI
                        }
                    }
                `
                const { body } = await request(app)
                    .get(`/api?query=${query}`)
                    .set({ "Authorization": "test-test-test" })
                    .expect(200)
                equal(body.errors[0].message, "check authorization token")
            })
        })
        describe("Success", () => {
            it("If you normally bring in a post", async () => {
                const query = `
                    query{
                        getMyPosts{
                            postId
                            comment
                            imageURI
                        }
                    }
                `
                const { body } = await request(app)
                    .get(`/api?query=${query}`)
                    .set({ "Authorization": "test-authrization-token" })
                    .expect(200)
                equal(body.data.getMyPosts[0].imageURI, uri[0])
            })
        })
    })
})