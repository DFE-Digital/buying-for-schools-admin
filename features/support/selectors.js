module.exports = (label) => {
  switch (label.toLowerCase()) {
    case 'heading': {
      return 'h1'
    }

    case 'subheading': {
      return 'h2'
    }

    case 'submit': {
      return '[type=submit]'
    }

    case 'recommendation':
    case 'intro': {
      return 'h1 + p.govuk-body-l'
    }

    case 'page title': {
      return 'head title'
    }

    case 'framework delete button': {
      return '#frameworktable .button--red'
    }

    case 'new framework button': {
      return '#newframework'
    }

    case 'save button': {
      return '#savebtn'
    }

    case 'back button': {
      return '#backbtn'
    }

    case 'field:slug': {
      return '#ref'
    }
    case 'field:title': {
      return '#title'
    }
    case 'field:description': {
      return '#descr'
    }
    case 'field:expiry': {
      return '#expiry'
    }
    case 'field:url': {
      return '#url'
    }
    case 'field:provider': {
      return '#provider'
    }
    case 'field:category': {
      return '#cat'
    }
    case 'field:body': {
      return '#body'
    }

    case 'dialog button no': {
      return '#dialogbuttonno'
    }

    case 'dialog button yes': {
      return '#dialogbuttonyes'
    }

    case 'framework editor form': {
      return '#frameworkeditorform'
    }

    case 'option editor form': {
      return '#optioneditorform'
    }

    case 'dialog': {
      return '.dialog__content'
    }

    default: {
      if (label.substr(0, 8) === 'option /') {
        const id = '#' + label.substr(8).replace(/\//g, '_') + ' h3 a'
        return id
      }
      const reg = /^remove framework (\d+) button$/i
      if (reg.test(label)) {
        const i = Number(label.replace(reg, '$1')) -1
        console.log(`#removeresult_${i}`)
        return `#removeresult_${i}`

        // 'remove framework 1 button'
      }
      console.log('No selector specified', label.toLowerCase())
    }
  }
}