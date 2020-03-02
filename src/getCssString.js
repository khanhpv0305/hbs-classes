import {isFunction} from 'lodash-es'

const INTERPOLATION_TYPE = Symbol('INTERPOLATION_TYPE')

export const int = (literals, ...expressions) => {
  const returnData = {
    literals,
    expressions,
  }

  returnData.type = INTERPOLATION_TYPE

  return returnData
}

const getCssString = (styleData, props, theme) => {
  const {
    literals,
    expressions,
  } = styleData

  let cssString = ''

  for (const [i, val] of expressions.entries()) {
    let expression

    if (isFunction(val)) {
      console.log(val)
      const calculatedResult = val({...props, theme})
      console.log(calculatedResult)

      if (calculatedResult.type === INTERPOLATION_TYPE) {
        expression = getCssString(calculatedResult, props, theme)
      } else {
        expression = calculatedResult
      }
    } else {
      expression = val
    }

    cssString += literals[i] + expression
  }

  cssString += literals[literals.length - 1]

  return cssString
}

export {getCssString as default}
