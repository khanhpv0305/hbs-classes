import generateId from '../utils/generateId'

export default (literals, ...expressions) => {
  const componentId = generateId()

  const returnData = {
    styleData: {
      literals,
      expressions,
    },
    componentId,
  }

  returnData.toString = () => `.${componentId}`

  return returnData
}