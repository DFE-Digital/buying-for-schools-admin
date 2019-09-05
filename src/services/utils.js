import moment from 'moment'

export const getCookie = name => {
  const b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)')
  return b ? b.pop() : ''
}

export const setCookie = (name, value) => {
  if (value === null) {
    document.cookie = `${name}=;path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  } else {
    const expiry = moment().add(2, 'h').utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
    console.log(expiry)
    document.cookie = `${name}=${value}; path=/; expires=${expiry}`  
  }
  return getCookie(name)
}

export const sortBy = (arr, comparisonGetter) => {
  const sortedArr = [...arr]
  sortedArr.sort((a, b) => {
    var aValue = comparisonGetter(a)
    var bValue = comparisonGetter(b)
    if (aValue < bValue) {
      return -1
    }
    if (aValue > bValue) {
      return 1
    }
    return 0
  })
  return sortedArr
}