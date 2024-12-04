import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        // For small screens, display a single image per slide
        breakpoint: 768, // for screens smaller than 768px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        // For larger screens, you can customize to show more slides if needed
        breakpoint: 1024, // for screens smaller than 1024px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <Image 
            width={1200} 
            height={700} 
            src="/assets/image1.jpg" 
            alt="Slide 1" 
            className="carousel-image" 
            layout="responsive" 
          />
        </div>
        <div>
          <Image 
            width={1200} 
            height={700} 
            src="/assets/image2.jpg" 
            alt="Slide 2" 
            className="carousel-image" 
            layout="responsive" 
          />
        </div>
        <div>
          <Image 
            width={1200} 
            height={700} 
            src="/assets/image3.avif" 
            alt="Slide 3" 
            className="carousel-image" 
            layout="responsive" 
          />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
