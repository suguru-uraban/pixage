/* eslint-disable camelcase */
import jwtDecode from 'jwt-decode'

interface IUser {
  aud: string
  auth_time: number
  email?: string
  email_verified?: boolean
  firebase: {
    sign_in_provider: string
  }
  name?: string
  picture?: string
  iss: string
  sub: string
  user_id: string
  iat: number
  exp: number
}

export interface MyToken extends IUser {
  iat: number
  exp: number
}

export const getUserFromCookie = (cookie: string): MyToken | undefined => {
  if (cookie) {
    const decodedToken: MyToken = jwtDecode(cookie)
    return decodedToken
  }
}
