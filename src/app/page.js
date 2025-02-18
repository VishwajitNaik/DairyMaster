"use client";
import React, { use, useEffect, useRef, useState } from "react";
import Modal from "./components/Models/Modal";
import SignupForm from "./components/SignupForm";
import SigninForm from "./components/SigninForm";
import UserSign from "./components/UserSignIn";
import SignupSangh from "./components/SignUpSangh";
import SignInSangh from "./components/SignInSangh";
import Navbar from "./components/Navebars/HomeNavBar";
import HeroBanner from "./components/HeroBanner";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Map from "./components/Map";
import AboutUs from "./components/AboutUs";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
import SmoothScrollWrapper from "./components/Animation/SmoothScrollWrapper";
import { connectToDB } from "./lib/dbconfig.js";
import axios from "axios";
connectToDB();

const Home = () => {
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        const response = await fetch("/api/owner/OwnerName"); // Call your API route
        const data = await response.json();

        if (response.ok) {
          setName(data.ownerName); // Set owner name in state
        } else {
          console.error(data.error); // Log error if any
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
      }
    };

    fetchOwnerName();
  }, []);

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



  const scrollToSection = (section) => {
    switch (section) {
      case "testimonials":
        testimonialsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "contact":
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "faq":
        faqRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [isSanghSignup, setIsSanghSignup] = useState(false);
  const [isSanghSignin, setIsSanghSignin] = useState(false);
  const [isUserSignInOpen, setUserSignInOpen] = useState(false);
  const [isOpenReqPassword, setIsopenReqPassword] = useState(false);
  const [isOpenResetPass, setIsopenResetPass] = useState(false);

  const handleModalClose = (setter) => () => setter(false);

  return (
    <SmoothScrollWrapper>
      <Navbar
        setIsSignupOpen={setIsSignupOpen}
        setIsSigninOpen={setIsSigninOpen}
        setIsSanghSignup={setIsSanghSignup}
        setIsSanghSignin={setIsSanghSignin}
        setUserSignInOpen={setUserSignInOpen}
        scrollToSection={scrollToSection}
      />
      
      <div ref={containerRef} className="relative text-white">
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



<h1
  ref={textRef}
  className=" absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center whitespace-nowrap"
>
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500"> W</span>elcome to Milk<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">HUB</span>

</h1>
<h1>
{ name && (
  <h2 className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-4xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
  {name || "Login to get started"}
  </h2>
) }
</h1>

      </div>


      <div className="w-full">
        <AboutUs />
      </div>

      <section
        ref={testimonialsRef}
        className="testimonials-section bg-gray-800 flex flex-col justify-center items-center"
      >
        <div className="bg-gray-300 w-4/5 sm:px-8 md:px-16 lg:px-20 mt-20 pb-4 rounded-lg shadow-lg">
          <Testimonials />
        </div>

        <div
          className="w-full max-w-4xl mb-8 mt-20 bg-white p-6 rounded-lg shadow-md"
          ref={contactRef}
        >
          <Contact />
        </div>
      </section>

      <Footer />

      <Modal isOpen={isSignupOpen} onClose={handleModalClose(setIsSignupOpen)}>
        <SignupForm />
      </Modal>

      <Modal isOpen={isSigninOpen} onClose={handleModalClose(setIsSigninOpen)}>
        <SigninForm />
      </Modal>

      <Modal
        isOpen={isUserSignInOpen}
        onClose={handleModalClose(setUserSignInOpen)}
      >
        <UserSign />
      </Modal>

      <Modal
        isOpen={isSanghSignup}
        onClose={handleModalClose(setIsSanghSignup)}
      >
        <SignupSangh />
      </Modal>

      <Modal
        isOpen={isSanghSignin}
        onClose={handleModalClose(setIsSanghSignin)}
      >
        <SignInSangh />
      </Modal>
      </SmoothScrollWrapper>
  );
};

export default Home;

