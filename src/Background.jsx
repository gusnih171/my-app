//Import
import React from "react";
import './Background.css'
import backVideo from './component/back-video.mp4'

const Background = () => {
  // Return background video
  return (
    <div>
      <div className='overlay'>
       <video src={backVideo} autoPlay loop muted />
      </div>
  </div>
  )
}
//Export
export default Background
