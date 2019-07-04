export const ioCache = {
  get: {}
}

const IoError = function (err) {
   this.error = err
   this.msg = 'io error'
}


export const get = (url, fromCache) => {

  return new Promise((resolve, reject) => {
    if (fromCache) {
      const cached = ioCache.get[url]
      if (cached) {
        return resolve(cached)
      }
    }

    fetch(url).then(response => {
      if (!response.ok) {
        return reject(response.status)
      }
      return response.json()
    }).then(data => {
      ioCache.get[url] = data
      return resolve(data)
    })
  })
}

export const put = (url, data) => { 
  const opts = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
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
    headers: {
      'Content-Type': 'application/json'
    }
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
    headers: {
      'Content-Type': 'application/json'
    }
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