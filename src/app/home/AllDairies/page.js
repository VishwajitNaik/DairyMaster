"use client"
import React from 'react'
import SanghNavbar from "../../components/Navebars/SanghNavBar"
import { useRef } from "react"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


const AllderiesHome = () => {
  const videoRef = useRef(null);
    const containerRef = useRef(null);
    const textRef = useRef(null);

  useGSAP(() => {
  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "50% 50%",
        scrub: true,
      },
    });
  
    tl.to(
      textRef.current, { y:-300
       }, 'a')
       .to(videoRef.current, {
        scale: 1.5
       }, 'a')
       .to(containerRef.current, {
        y:400
       }, 'a')
  
  });
  return (
    <>
      <div className="relative w-full h-screen sm:h-[70vh] lg:h-screen overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover absolute top-0 left-0 opacity-20"
        >
          <source src="/assets/milk.mp4" type="video/mp4" />
        </video>
      </div>
    </>
        
  )
}

export default AllderiesHome


