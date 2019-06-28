import { Map, List } from 'immutable'
import { rootQuestionRef } from '../config'

export const getBlankQuestion = () => {
  return Map({
    _id: null,
    ref: '',
    title: '',
    hint: '',
    err: '',
    suffix: '',
    options: []
  })
}

export const getAncestors = (questions, qID) => {
  const parents = getParent(questions, qID)
  let ancestry = Map({
    _id: qID,
    parents: parents.map(p => getAncestors(questions, p.get('_id')))
  })
  
  return ancestry
}

export const getParent = (questions, qID) => {
  return questions.filter(q => {
    const options = q.get('options')
    const withNext = options.find(o => o.get('next') === qID)
    return Map.isMap(withNext)
  })
}

export const getAllAncestorIDs = (questions, qID) => {
  const ancestry = getAncestors(questions, qID)

  let ancestorIDs = List([])
  const recur = (child => {
    ancestorIDs = ancestorIDs.push(child.get('_id'))
    child.get('parents').map(p => recur(p))
    return ancestorIDs
  })
  return recur(ancestry)
}

// export const getAllAncestorRefs = (questions, qID) => {
//   const ancestorIDs = getAllAncestorIDs(questions, qID) 
//   return ancestorIDs.map(id => {
//     const q = questions.find(qq => qq.get('_id') === id)
//     return q ? q.get('ref') : null
//   })
// }

export const getPaths = (questions, qID) => {
  const rootQ = questions.find(q => q.get('ref') === rootQuestionRef)
  if (!rootQ) {
    return []
  }
  const paths = []
  
  const recur = (q, url = []) => {
    const urlWithQ = [...url, { _id: q.get('_id'), ref: q.get('ref'), type: 'question'}]
    const options = q.get('options')
    options.forEach(opt => {
      const urlWithOption = [...urlWithQ, { _id: opt.get('_id'), ref: opt.get('ref'), type: 'option'}]
      paths.push(urlWithOption)
      const nxt = questions.find(q => q.get('_id') === opt.get('next'))
      if (nxt) {
        recur(nxt, urlWithOption)
      }  
    })
    return url
  }
  recur(rootQ)
  return paths
}