import fetch from "node-fetch"
import qs from "qs"
import env from "config/env"
import * as redis from "config/connectRedis"
export const requestKakaoToken = (code: string) => fetch(
    `https://kauth.kakao.com/oauth/token`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: qs.stringify({
        grant_type: "authorization_code",
        client_id: process.env.REST_KEY,
        redirect_uri: env.REDIRECT_URI,
        code: code,
        client_secret: process.env.CLIENT_SECRET
    })
}).then(async (res) => {
    const result = await res.json()
    const user = await getKakaoTokenByUserInfo(result.access_token)
    if (user.id) {
        await redis.setex(result.access_token, 43199, user.id)
    }
    return result
})

const getKakaoTokenByUserInfo = (token: string) => fetch("https://kapi.kakao.com/v1/user/access_token_info", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': "application/x-www-form-urlencoded;charset=utf-8"
    }
}).then(async (res) => await res.json())

export const kakaoTokenRefresh = (refresh_token: string) => fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: qs.stringify({
        grant_type: "refresh_token",
        client_id: process.env.REST_KEY,
        refresh_token,
        client_secret: process.env.CLIENT_SECRET
    })
}).then(async (res) => {
    const user = await res.json()
    if (user.id) {
        redis.setex(user.access_token, 43199, user.id)
    }
    return user
})