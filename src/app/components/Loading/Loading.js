import React from 'react'
import './Loading.css'

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="circle-spinner">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  )
}

export default Loading
