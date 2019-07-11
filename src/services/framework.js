import { Map } from 'immutable'
import { rootQuestionRef } from '../config'
import moment from 'moment'

export const FRAMEWORK_ACTIVE = 'FRAMEWORK_ACTIVE'
export const FRAMEWORK_EXPIRED = 'FRAMEWORK_EXPIRED'
export const FRAMEWORK_EXPIRES_SOON = 'FRAMEWORK_EXPIRES_SOON'
export const FRAMEWORK_EXPIRY_UNKNOWN = 'FRAMEWORK_EXPIRY_UNKNOWN'

export const getBlankFramework = () => {
  return Map({
    _id: 'new',
    ref: '',
    title: ''
  })
}

export const getExpiryBlock = mom => {
  const expiryBlocks = [0, 1, 3, 6]
  const exp = expiryBlocks.find(e => {
    return mom.isBefore(moment().add(e, 'month'))
  })

  if (exp === undefined) {
    return null
  }

  return exp
}

export const getExpiryStatus = expiryBlock => {
  switch(expiryBlock) {
    case 0: {
      return {
        block: 0, 
        msg: 'Expired',
        class: 'expired',
        status: FRAMEWORK_EXPIRED
      }
    }
    case 1: {
      return {
        block: 1,
        msg: '< 1 month',
        class: 'expiryimminent',
        status: FRAMEWORK_EXPIRES_SOON
      }
    }
    case 3: {
      return {
        block: 3,
        msg: '< 3 months',
        class: 'expirysoon',
        status: FRAMEWORK_EXPIRES_SOON
      }
    }
    case 6: {
      return {
        block: 6,
        msg: '< 6 months',
        class: 'expirywarning',
        status: FRAMEWORK_EXPIRES_SOON
      }
    }
    case null: {
      return {
        block: -1,
        msg: 'Active',
        class: 'active',
        status: FRAMEWORK_ACTIVE
      }
    }
    default: {
      return  {
        block: -1,
        msg: '',
        class: 'expiryunkown',
        status: FRAMEWORK_EXPIRY_UNKNOWN
      }
    }
  }
}

export const getFrameworkInfo = framework => {
  const exp = framework.get('expiry')
  const mom = moment(exp)
  const info = {
    displayDate: '',
    expiry: getExpiryStatus(null)
  }

  if (exp && mom.isValid()) {
    info.displayDate = mom.format('DD/MM/YYYY')
    info.expiry = getExpiryStatus(getExpiryBlock(mom))
  }

  return framework.set('_info', Map(info))
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