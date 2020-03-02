import {isFunction} from 'lodash-es'

export default (styleData, props, theme) => {
  const {
    literals,
    expressions,
  } = styleData

  let cssString = ''

  for (const [i, val] of expressions.entries()) {
    const expression = isFunction(val) ? val({...props, theme}) : val

    cssString += literals[i] + expression
  }

  cssString += literals[literals.length - 1]

  return cssString
}
