
export const getCookie = name => {
  const b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)')
  return b ? b.pop() : ''
}

export const setCookie = (name, value) => {
  if (value === null) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  } else {
    document.cookie = `${name}=${value}`  
  }
  return getCookie(name)
}