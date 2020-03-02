import {useState, useEffect, useContext, useCallback} from 'react'
import stylis from 'stylis'
import {get} from 'lodash-es'

// Constants
import {venderName} from './config'

// Contexts
import {ThemeContext} from './ThemeProvider'

// Utils
import generateClassName from '../utils/generateClassName'
import getCssString from '../utils/getCssString'
import usePrevious from '../utils/usePrevious'

const renderCount = {}
const blockStyle = {}
const classNameList = {}

const headEl = document.head

export default (classes) => {
  const blockId = generateClassName(null, JSON.stringify(classes))

  const [isFirstRenderedBlock, setIsFirstRenderedBlock] = useState(false)

  const theme = useContext(ThemeContext)

  const styleEl = document.createElement('style')

  useEffect(() => {
    if (renderCount[blockId] === undefined) {
      setIsFirstRenderedBlock(true)

      renderCount[blockId] = 1
    } else {
      renderCount[blockId] += 1
    }
  }, [blockId])

  useEffect(() => {
    return () => {
      renderCount[blockId] -= 1
    }
  }, [blockId])

  useEffect(() => {
    return () => {
      if (renderCount[blockId] === 0) {
        delete renderCount[blockId]
        delete blockStyle[blockId]
        delete classNameList[blockId]

        styleEl.remove()
      }
    }
  }, [blockId])

  useEffect(() => {
    if (isFirstRenderedBlock) {
      headEl.appendChild(styleEl)
    }
  }, [isFirstRenderedBlock])

  useEffect(() => {
    if (isFirstRenderedBlock) {
      styleEl.innerHTML = blockStyle[blockId]
    }
  }, [blockId, isFirstRenderedBlock])

  const previousBlockStyle = usePrevious(blockStyle[blockId])

  useEffect(() => {
    const currentBlockStyle = blockStyle[blockId]
    const shouldInjectNewStyle = previousBlockStyle !== undefined && previousBlockStyle !== currentBlockStyle

    if (shouldInjectNewStyle) {
      styleEl.innerHTML = currentBlockStyle
    }
  }, [blockId, previousBlockStyle])

  return useCallback((cpName, props = {}) => {
    const {
      styleData,
      componentId,
    } = classes[cpName]

    const cssString = getCssString(styleData, props, theme)
    
    const className = generateClassName(componentId, cssString)

    const cpClassNameList = get(classNameList, blockId, [])

    const classNameExist = cpClassNameList.includes(className)

    if (!classNameExist) {
      if (classNameList[blockId] === undefined) {
        classNameList[blockId] = [className]
      } else {
        classNameList[blockId].push(className)
      }

      const compiledCss = stylis(`.${className}`, cssString)

      if (blockStyle[blockId] === undefined) {
        blockStyle[blockId] = ''
      }

      blockStyle[blockId] += compiledCss
    }
    
    if (process.env.NODE_ENV !== 'production') {
      return `${cpName}-${venderName} ${componentId} ${className}`
    }
    
    return `${componentId} ${className}`
  }, [classes, blockId, theme])
}
