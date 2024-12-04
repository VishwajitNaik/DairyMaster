import React from 'react';
import Carousel from '../components/HomePage/Carousel'; // Adjust the import path as necessary

const HeroBanner = () => {
  return (
    <div className="hero-banner" style={styles.banner}>
      <div style={styles.carouselWrapper}>
        <Carousel />
      </div>
      <div style={styles.content}>
        <h1 style={styles.headline}>Welcome to Dairy HUB</h1>
        <p style={styles.description}>
          Collaborate, solve problems, and build projects together. Join a community of problem solvers and innovators today.
        </p>
        <button style={styles.ctaButton}>Get Started</button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  banner: {
    position: 'relative', // Ensure that the content is positioned relative to this container
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  carouselWrapper: {
    position: 'absolute', // Position carousel absolutely within the hero banner
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Make sure carousel is behind content
  },
  content: {
    position: 'absolute', // Position content absolutely within the hero banner
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '20px',
    borderRadius: '8px',
    width: '90%', // Ensure content doesn't take the full width on small screens
  },
  headline: {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 0 20px',
    lineHeight: '1.2', // Adjust line height for better readability
  },
  description: {
    fontSize: '18px',
    margin: '0 0 30px',
    lineHeight: '1.5', // Adjust line height for better readability
  },
  ctaButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#ff6600',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  // Media Queries for Mobile Responsiveness
  '@media (max-width: 768px)': {
    banner: {
      height: '50vh', // Reduce banner height for smaller screens
    },
    headline: {
      fontSize: '32px', // Smaller font size for the headline on mobile
    },
    description: {
      fontSize: '16px', // Smaller font size for description
    },
    ctaButton: {
      fontSize: '14px', // Smaller button text on mobile
      padding: '8px 16px', // Adjust button padding for mobile
    },
  },
};

export default HeroBanner;
