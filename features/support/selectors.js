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
  }
}