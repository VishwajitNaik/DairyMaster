"use client"
import React, { useRef, useState } from 'react';
import Modal from './components/Models/Modal';
import SignupForm from './components/SignupForm';
import SigninForm from './components/SigninForm';
import UserSign from './components/UserSignIn';
import SignupSangh from './components/SignUpSangh';
import SignInSangh from './components/SignInSangh';
import Navbar from './components/Navebars/HomeNavBar';
import HeroBanner from './components/HeroBanner';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Contact from "./components/Contact";
import Map from "./components/Map";
import AboutUs from "./components/AboutUs";

import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import {withAuthenticator} from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);


const Home = () => {
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);

  const scrollToSection = (section) => {
    switch (section) {
      case 'testimonials':
        testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contact':
        contactRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'faq':
        faqRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <>
      <Navbar 
        setIsSignupOpen={setIsSignupOpen} 
        setIsSigninOpen={setIsSigninOpen} 
        setIsSanghSignup={setIsSanghSignup} 
        setIsSanghSignin={setIsSanghSignin} 
        setUserSignInOpen={setUserSignInOpen}
        scrollToSection={scrollToSection}
      />

      <HeroBanner />
      <div className="w-full" style={{marginTop:"150px"}}>
        <AboutUs />
      </div>

      <section ref={testimonialsRef} className="testimonials-section bg-gray-800 flex flex-col justify-center items-center">
        <div className='bg-gray-300 w-4/5 px-20 mt-20 pb-4 rounded-lg shadow-lg'>
          <Testimonials />
        </div>
        <div className="w-full max-w-4xl mb-8 mt-20 bg-white p-6 rounded-lg shadow-md" ref={contactRef}>
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

      <Modal isOpen={isUserSignInOpen} onClose={handleModalClose(setUserSignInOpen)}>
        <UserSign />
      </Modal>

      <Modal isOpen={isSanghSignup} onClose={handleModalClose(setIsSanghSignup)}>
        <SignupSangh />
      </Modal>

      <Modal isOpen={isSanghSignin} onClose={handleModalClose(setIsSanghSignin)}>
        <SignInSangh />
      </Modal>
    </>
  );
};

export default Home;


// UserName : VishwaTech
// password  : Vishwa123
