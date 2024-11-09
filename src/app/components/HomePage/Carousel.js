import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src="/assets/image1.jpg" alt="Slide 1" className="carousel-image" />
        </div>
        <div>
        <img src="/assets/image2.jpg" alt="Slide 1" className="carousel-image" />
        </div>
        <div>
        <img src="/assets/image3.avif" alt="Slide 1" className="carousel-image" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
