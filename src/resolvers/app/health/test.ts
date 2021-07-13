import assert from "assert"
import request from "supertest"
import app from "test"

describe(`Server Init Test`, () => {

    it(`Server Running Test-1`, async () => {
        const query = `
            query{
                test
            }
        `
        await request(app)
            .get(`/api?query=${query}`)
            .expect(200)
    })
    it(`Server Running Test-2`, async () => {
        const query = `
            query{
                test1
            }
        `
        const { body } = await request(app)
            .get(`/api?query=${query}`)
            .expect(400)
        assert.strictEqual(body.errors[0].message, 'Cannot query field "test1" on type "Query". Did you mean "test"?')
    })
})