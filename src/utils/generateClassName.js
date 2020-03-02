import generateAlphabeticName from './generateAlphabeticName';
import {hash} from './hash'

export default (componentId, style) => generateAlphabeticName(hash(`${componentId} ${style}`))
