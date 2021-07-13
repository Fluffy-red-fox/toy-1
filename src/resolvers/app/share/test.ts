import app from "test"
import request from "supertest"
import fetch from "node-fetch"
import { deepStrictEqual as equal } from "assert"

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
})