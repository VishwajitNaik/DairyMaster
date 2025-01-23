"use client";
import React from 'react'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'

const SmoothScrollWrapper = ({children}) => {
  return (
    <ReactLenis root options={{lerp: 0.1}}>
      {children}
    </ReactLenis>
  )
}

export default SmoothScrollWrapper
