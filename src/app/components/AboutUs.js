import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';



const AboutPage = () => {
  return (
    <div className="about-page bg-blue-100 py-10 relative z-10">
      <div className="container mx-auto px-4">
        
        {/* Introduction Section */}
        <section className="intro text-center mb-12">
  <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'CustomFont' }}>
    About Us
  </h1>
  <div className="w-full flex flex-col sm:flex-row items-start">
    <p className="p-2 text-lg sm:text-xl text-gray-700 text-left mt-4 mr-12 shadow-md shadow-gray-300" style={{ fontFamily: 'CustomPara' }}>
      Welcome to <span className='font-bold text-blue-800'>Milk</span><span className='font-bold text-red-800'>hub</span>, a comprehensive web application designed to streamline and modernize the operations
      of the dairy industry. Our platform bridges the gap between milk producers, sub-divisions,
      and milk factories, ensuring transparency, efficiency, and convenience for everyone involved.
    </p>
    <div className="w-full p-4 bg-gray-400 flex justify-center items-center shadow-lg shadow-gray-700 mt-4 sm:mt-0 rounded-md">
      <video
        autoPlay
        loop
        muted
        className="mx-4 my-1 w-full shadow-md shadow-gray-700"
      >
        <source src="/assets/milk.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
</section>



        <section>
  <div className="flex flex-col justify-between">
    <h2 className="text-4xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'CustomPara' }}>What We Do</h2>

    {/* Card 1 */}
    <div className="flex flex-row justify-start p-6">
      <div className="flex flex-col bg-gray-300 p-6 rounded-lg shadow-lg max-w-md animate-roll hover:animate-hover">
        <h2 className="text-2xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'CustomPara' }}>For Milk Producers</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Manage daily milk submissions (cow and buffalo milk).</li>
          <li>Accurate testing and recording of milk quality and quantity.</li>
          <li>Track milk totals, payments, and deductions.</li>
          <li>Simplify payments made every 10 days directly to producers.</li>
          <li>View milk-related details, payments, and orders on mobile devices.</li>
        </ul>
      </div>
    </div>

    {/* Card 2 */}
    <div className="flex flex-row justify-end p-6">
      <div className="flex flex-col bg-blue-300 p-6 rounded-lg shadow-lg max-w-md animate-roll hover:animate-hover">
        <h2 className="text-2xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'CustomPara' }}>For Sub-Divisions</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Automate milk collection records and testing data.</li>
          <li>Calculate daily and total milk quantities and their value.</li>
          <li>Manage payments from milk factories to sub-divisions.</li>
          <li>Handle orders for pet-related services such as veterinary doctors and pet food.</li>
          <li>Integrate deductions for food bags and other items directly into producer payments.</li>
        </ul>
      </div>
    </div>

    {/* Card 3 */}
    <div className="flex flex-row justify-start p-6"> 
      <div className="flex flex-col bg-yellow-300 p-6 rounded-lg shadow-lg max-w-md animate-roll hover:animate-hover">
        <h2 className="text-2xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'CustomPara' }}>For Milk Factories</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Consolidate milk collection from multiple sub-divisions.</li>
          <li>Streamline the billing process for all stakeholders.</li>
          <li>Automate salary management for staff across sub-divisions and factories.</li>
          <li>Monitor milk production, sales, and logistics effectively.</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Add rolling and hover effects */}
  <style jsx>{`
    @keyframes roll {
      0% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(5deg);
      }
      50% {
        transform: rotate(-5deg);
      }
      75% {
        transform: rotate(5deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }

    @keyframes hover-scale {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    .animate-roll {
      animation: roll 10s infinite ease-in-out;
      transform-origin: bottom right;
    }

    .hover:animate-hover {
      animation: hover-scale 2s ease-in-out;
      animation-fill-mode: forwards;
      cursor: pointer;
    }
  `}</style>
</section>


        {/* Mission and Vision Section */}
        <section className="mission-vision mb-12 bg-transparent shadow-md sm:px-6 sm:py-8">
  {/* Mission Section */}
  <div className="container mx-auto">
    <div className="w-full mb-0 mt-8 px-4 sm:mb-6 sm:px-4">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-800" style={{ fontFamily: 'CustomPara' }}>
        Our Mission
      </h2>
      <p className="text-gray-700 mb-8 text-lg text-center max-w-4xl mx-auto">
        Our mission is to empower every stakeholder in the dairy ecosystem by providing a reliable and efficient platform that minimizes manual errors, enhances transparency, and maximizes productivity.
      </p>

      <div className="bg-blue-50 hover:bg-blue-200 p-8 rounded-lg shadow-xl text-center max-w-4xl mx-auto">
        <Image
          width={200}
          height={300}
          src="/assets/indnots.jpg"
          alt="Mission Image"
          className="w-64 h-64 object-cover rounded-lg mx-auto mb-6"
        />
        <h3 className="text-2xl font-semibold mb-4 text-black" style={{ fontFamily: 'CustomPara' }}>Why Choose Us?</h3>
        <p className="text-gray-600 text-lg mb-6">
          Simplified operations from milk collection to payment and supply orders. <br />
          Accurate data and transparent records for milk, payments, and orders. <br />
          A user-friendly interface accessible on both desktop and mobile devices. <br />
          Streamlined veterinary and food supply services for better livestock care. <br />
          Dedicated support for every level of the dairy industry.
        </p>
      </div>

      <div className="bg-white hover:bg-gray-100 p-8 rounded-lg shadow-lg mt-8 max-w-4xl mx-auto">
        <p className="text-gray-700 text-lg" style={{ fontFamily: 'CustomPara' }}>
          At <span className='font-bold text-blue-800 text-2xl'>Milk</span><span className='font-bold text-red-800 text-2xl'>hub</span>, we are committed to revolutionizing the dairy industry by fostering trust, efficiency, and growth. With features that cater to the health of animals, the productivity of producers, and the seamless management of operations, our platform ensures a smarter, more connected dairy ecosystem.
        </p>
        <p className="mt-6 text-gray-700 text-lg">
          Let us help you build a stronger, healthier, and more efficient dairy network!
        </p>
      </div>
    </div>
  </div>
</section>



{/* Our Team Section */}
<section className="team md:m-24">
  <div className="flex justify-center items-center w-full">
    <div className="w-full max-w-screen-lg px-4">
      <div className="bg-blue-50 hover:bg-blue-200 p-8 rounded-lg shadow-xl text-center">
        <Image 
          width={150} 
          height={150} 
          src="/assets/owner.jpeg" 
          alt="Vishwajit Naik" 
          className="w-40 h-40 rounded-full mx-auto mb-6" 
        />
        <h3 className="text-2xl font-semibold mb-2 text-black" style={{ fontFamily: 'CustomPara' }}>Vishwajit Naik</h3>
        <p className="text-gray-700 text-lg font-medium mb-4">Founder</p>
        <p className="text-gray-600 leading-relaxed">
          Vishwajit Naik is the visionary behind this platform, dedicated to 
          transforming the dairy industry through innovation and technology. 
          He ensures seamless operations across milk producers, sub-divisions, 
          and factories, making the industry more efficient and transparent.
        </p>
        <p className="mt-6 text-gray-600 leading-relaxed">
          Vishwajit’s passion for empowering rural communities and modernizing traditional practices has been the cornerstone of this project. His dedication to building solutions that benefit all levels of the dairy ecosystem has made
          <span className='font-bold text-blue-800'>Milk</span><span className='font-bold text-red-800'>hub</span>, an indispensable tool for the industry.
        </p>
        <div className="mt-6 flex justify-center space-x-6">
          {/* Social Media Icons */}
          <div className='shadow-md rounded-md shadow-slate-400 h-12 w-12 flex justify-center items-center'>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="text-3xl text-gray-800 hover:text-pink-600 transition-transform duration-300 transform hover:scale-110 shadow-lg p-2 rounded-full">
              <FaInstagram />
            </i>
          </a>
          </div>
          <div className='shadow-md rounded-md shadow-slate-400 h-12 w-12 flex justify-center items-center'>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="text-3xl text-gray-800 hover:text-blue-600 transition-transform duration-300 transform hover:scale-110 shadow-lg p-2 rounded-full">
              <FaLinkedin />
            </i>
          </a>
          </div>
          <div className='shadow-md rounded-md shadow-slate-400 h-12 w-12 flex justify-center items-center'>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="text-3xl text-gray-800 hover:text-blue-700 transition-transform duration-300 transform hover:scale-110 shadow-lg p-2 rounded-full">
              <FaFacebook />
            </i>
          </a>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

      </div>
    </div>
  );
};

export default AboutPage;
