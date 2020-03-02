import {useEffect, useContext, useCallback} from 'react'
import stylis from '@emotion/stylis'
import {get} from 'lodash-es'

// Constants
import {venderName} from './config'

// Contexts
import {ThemeContext} from './ThemeProvider'

// Utils
import generateClassName from './generateClassName'
import getCssString from './getCssString'

const renderCount = {}
const blockStyle = {}
const classNameList = {}

const headEl = document.head

export default (classes) => {
  const blockId = generateClassName(null, JSON.stringify(classes))
  const getStyleEl = useCallback(() => document.getElementById(blockId), [blockId])
  const theme = useContext(ThemeContext)

  /* Every time Block was rendered, the counter of Block plus 1 */
  useEffect(() => {
    if (renderCount[blockId] === undefined) {
      renderCount[blockId] = 1
    } else {
      renderCount[blockId] += 1
    }
  }, [blockId])

  /* Every time Block was unmounted, the counter of Block minus 1 */
  useEffect(() => {
    return () => {
      renderCount[blockId] -= 1
    }
  }, [blockId])

  /* Remove style tag and Block's data when the last Block was unmounted */
  useEffect(() => {
    return () => {
      if (renderCount[blockId] === 0) {
        delete renderCount[blockId]
        delete blockStyle[blockId]
        delete classNameList[blockId]
        
        const styleEl = getStyleEl()
        styleEl.remove()
      }
    }
  }, [blockId, getStyleEl])

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

      let styleEl = getStyleEl()

      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.setAttribute('id', blockId)
        styleEl.setAttribute('type', 'text/css')

        headEl.appendChild(styleEl)
      }

      styleEl.innerHTML = blockStyle[blockId]
    }
    
    if (process.env.NODE_ENV !== 'production') {
      return `${cpName}-${venderName} ${componentId} ${className}`
    }
    
    return `${componentId} ${className}`
  }, [classes, theme, blockId, getStyleEl])
}
