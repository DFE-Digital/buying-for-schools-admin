
export const dataHasErrored = (bool, key) => {
  return {
    type: key + '_HAS_ERRORED',
    hasErrored: bool
  }
}

export const dataIsLoading = (bool, key) => {
  return {
    type: key + '_IS_LOADING',
    isLoading: bool
  }
}

export const dataFetchSuccess = (data, key) => {
  return {
    type: key + '_DATA_FETCH_SUCCESS',
    data
  }
}

export const dataFetch = (url, key="DEFAULT", postData=null, method=null) => {
  return (dispatch) => {
    dispatch(dataIsLoading(true, key))
    const opts = {}
    if (postData) {
      opts.method = method || 'POST'
      opts.body = JSON.stringify(postData)
      opts.headers = {
        'Content-Type': 'application/json'
      }
    }

    fetch(url, opts).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response
    })
    .then((response) => {
      dispatch(dataIsLoading(false, key))
      return response
    })
    .then(response => response.json())
    .then(items => dispatch(dataFetchSuccess(items, key)))
    .catch(() => dispatch(dataHasErrored(true, key)))
  }
}
