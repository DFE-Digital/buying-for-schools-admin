import { getCookie, setCookie } from './utils'
import { cookieName } from '../config'

const ioConf = {}

const cookieToken = getCookie(cookieName)
if (cookieToken) {
  ioConf.token = cookieToken
}

const IoError = function (err) {
  this.error = err
  this.msg = 'io error'
}

export const setToken = token => {
  setCookie(cookieName, token)
  ioConf.token = token
}

export const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  }
  if (ioConf.token) {
    headers['Authorization-token'] = ioConf.token
  }
  return headers
}

export const get = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, { 
      headers: getHeaders(),
      credentials: 'same-origin'
    }).then(response => {
      if (!response.ok) {
        return reject(response.status)
      }
      return resolve(response.json())
    })
  })
}

export const put = (url, data) => {
  const opts = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: getHeaders(),
    credentials: 'same-origin'
  }
  let theresponse = null

  return fetch(url, opts).then(response => {
    theresponse = response
    return response.json()
  }).then(data => {
    const status = theresponse.status
    const ok = theresponse.ok
    if (!ok) {
      throw new IoError({
        data,
        status,
        ok
      })
    }
    return {
      data,
      status,
      ok
    }
  })
}

export const post = (url, data) => {
  const opts = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: getHeaders(),
    credentials: 'same-origin'
  }

  let theresponse = null

  return fetch(url, opts).then(response => {
    theresponse = response
    return response.json()
  }).then(data => {
    const status = theresponse.status
    const ok = theresponse.ok
    if (!ok) {
      throw new IoError({
        data,
        status,
        ok
      })
    }
    return {
      data,
      status,
      ok
    }
  })
}

export const remove = (url) => {
  const opts = {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'same-origin'
  }

  let theresponse = null

  return fetch(url, opts).then(response => {
    theresponse = response
    return response.json()
  }).then(data => {
    const status = theresponse.status
    const ok = theresponse.ok
    return {
      data,
      status,
      ok
    }
  })
}
