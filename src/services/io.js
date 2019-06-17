export const ioCache = {
  get: {}
}

export const get = (url, fromCache) => {

  return new Promise((resolve, reject) => {
    if (fromCache) {
      const cached = ioCache.get[url]
      if (cached) {
        // console.log('from cache', url, cached)
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
      // console.log('added to cache', url, data)
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