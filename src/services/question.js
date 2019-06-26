import { Map, List } from 'immutable'

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