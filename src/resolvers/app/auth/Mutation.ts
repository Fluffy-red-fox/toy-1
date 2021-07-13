import { Db } from "mongodb"
import { requestKakaoToken, kakaoTokenRefresh } from "lib"
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