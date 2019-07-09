import { Map } from 'immutable'
import { rootQuestionRef } from '../config'

export const getBlankFramework = () => {
  return Map({
    _id: 'new',
    ref: '',
    title: ''
  })
}

export const getFrameworkUsage = questions => {
  const rootQ = questions.find(q => q.get('ref') === rootQuestionRef)
  if (!rootQ) {
    return []
  }
  let frameworkIds = {}
  const recur = (q) => {
    q.get('options').forEach(opt => {
      const result = opt.get('result') || []
      result.forEach(fId => {
        frameworkIds[fId] = frameworkIds[fId] ? frameworkIds[fId] + 1 : 1  
      })
      
      const nextQ = questions.find(qq => qq.get('_id') === opt.get('next'))
      if (nextQ) {
        recur(nextQ)
      }
    })
  }
  recur(rootQ)
  return frameworkIds
}