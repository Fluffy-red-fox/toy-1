import { Db } from "mongodb"
import { requestKakaoToken, kakaoTokenRefresh } from "lib"
import { Redis } from "config/types"
export const kakaoAuth = async (
    parent: void, {
        code
    }: {
        code: string
    }
) => requestKakaoToken(code)

export const refreshAuth = async (
    parent: void, {
        refreshToken
    }: {
        refreshToken: string
    }
) => kakaoTokenRefresh(refreshToken)

export const logout = async (
    parent: void, {
        token
    }: {
        token: string
    }, {
        redis
    }: {
        redis: Redis
    }
) => {
    const userResult = await redis.get(token)
    if (userResult === null) {
        return false
    }
    await redis.del(token)
    return true
}