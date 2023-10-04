import { OutgoingMessage } from 'http'
import { serialize } from 'cookie'
import { Plugin } from '@nuxt/types'
import Cookies, { CookieChangeOptions } from 'universal-cookie'

declare module 'vue/types/vue' {
  interface Vue {
    $cookie: Cookies
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $cookie: Cookies
  }
}

const plugin: Plugin = ({ req, res }, inject) => {
  let cookie: Cookies

  if (process.server) {
    cookie = createServerCookie(req.headers.cookie || '', res)
  } else {
    cookie = new Cookies()
  }

  inject('cookie', cookie)
}

export function createServerCookie(cookie: string, res: OutgoingMessage): Cookies {
  const universalCookie = new Cookies(cookie)
  universalCookie.addChangeListener((change: CookieChangeOptions) => {
    if (res.headersSent) {
      return
    }
    let cookieHeader = res.getHeader('Set-Cookie')
    if (typeof cookieHeader === 'string') {
      cookieHeader = [cookieHeader]
    } else if (typeof cookieHeader === 'number') {
      cookieHeader = [cookieHeader.toString()]
    }
    cookieHeader = (cookieHeader as string[]) || []

    if (change.value === undefined) {
      cookieHeader.push(serialize(change.name, '', change.options))
    } else {
      cookieHeader.push(serialize(change.name, change.value, change.options))
    }

    res.setHeader('Set-Cookie', cookieHeader)
  })

  return universalCookie
}

export default plugin

// option
export const $cookiesOpt = {
  path: '/',
}

export const $cookiesOptEternal = {
  path: '/',
  maxAge: 60 * 60 * 24 * 36500, // 100年（ほぼ永続）
}

// 今のところ利用なし
// export const $cookiesOptDay = {
//  path: '/',
//  maxAge: 60 * 60 * 24, // 一日
// }
//
// export const $cookiesOptMonth = {
//   path: '/',
//   maxAge: 60 * 60 * 24 * 30, // 30日
// }

// secure option
export const $cookiesOptSecure = {
  path: '/',
  secure: true,
}

export const $cookiesOptMonthSecure = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30日
  secure: true,
}

// delete option
export const $cookiesOptDelete = {
  path: '/',
  maxAge: 0, // 削除
}
