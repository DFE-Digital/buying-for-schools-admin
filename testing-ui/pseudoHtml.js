exports = module.exports = page => {
  const get = async selector => {
    await page.waitForSelector(selector)
    return await page.evaluate(sel => {
      const recur = n => {
        if (n.nodeType === 3) {
          return { text: n.textContent }
        }
        const children = [...n.childNodes].map(child => recur(child))
        const attributes = [...n.attributes].map(attr => ({ name: attr.name, value: attr.value }))
        return {
          name: n.nodeName.toLowerCase(),
          children,
          attributes
        }
      }
      const node = document.querySelector(sel)
      return recur(node)
    }, selector)
  }


  const findAll = (node, comparator) => {
    let result = []
    if (comparator(node)) {
      result.push(node)
      return result
    }
    if (!Array.isArray(node.children)) {
      return []
    }
    node.children.forEach(child => {
      result = result.concat(findAll(child, comparator))
    })
    return result
  }

  const getText = node => {
    if (node.text) {
      return node.text
    }
    let str = ''
    node.children.forEach(child => {
      str += getText(child)
    }) 
    return str
  }

  const getAttr = (node, attrName) => {
    if (!Array.isArray(node.attributes)) {
      return null
    }
    const attr = node.attributes.find(a => a.name === attrName)
    return attr ? attr.value : null
  }

  return {
    get,
    findAll,
    getText,
    getAttr
  }
}