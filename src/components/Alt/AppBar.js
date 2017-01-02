/**
 * A wrapper for carbon-ui/AppBar
 *
 * Passing style object to stock appBar causes this error:
 * ReactNativeJS: In this environment the sources for assign MUST be an object.This error is a performance optimization and not spec compliant.
 */

import React from 'react'
import { AppBar as CarbonAppBar } from 'carbon-ui'

const AppBar = (props, state) => {
  const { style, ...rest } = props
  
  return (
    <CarbonAppBar style={{...style}} {...rest} />
  )
}
export default AppBar