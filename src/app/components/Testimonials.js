import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Modal from '../components/Navebars/NavbarModal'; // Adjust the path according to your file structure
import Image from 'next/image';

const Testimonials = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const testimonials = [
    {
      name: "John Doe",
      position: "CEO, Company A",
      image: "/assets/mony.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example video URL
    },
    {
      name: "Jane Smith",
      position: "CTO, Company B",
      image: "https://picsum.photos/seed/picsum/200/300",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example video URL
    },
    {
      name: "Sarah Lee",
      position: "Product Manager, Company C",
      image: "/assets/mony.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example video URL
    },
    {
      name: "Sarah Lee",
      position: "Product Manager, Company C",
      image: "/assets/mony.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example video URL
    },
    // Add more testimonials as needed
  ];

  const handleButtonClick = (videoUrl) => {
    setVideoUrl(videoUrl);
    setModalOpen(true);
  };

  return (
    <>
      <div className="text-black text-3xl sm:text-4xl md:text-5xl font-semibold mb-6">
        What Our Users Say
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1} // Default to 1 slide per view
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 }, // On mobile, show one card per row
          768: { slidesPerView: 2 }, // On medium screens, show two cards per row
          1024: { slidesPerView: 3 }, // On larger screens, show three cards per row
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white hover:bg-blue-200 p-6 rounded-lg shadow-md flex flex-col items-center">
              <Image
                width={200}
                height={300} 
                src={testimonial.image} 
                alt={`${testimonial.name}'s testimonial`} 
                className="w-64 h-48 mb-4 rounded"
              />
              <p className="text-xs sm:text-sm text-gray-600 mb-2">{testimonial.position}</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">{testimonial.name}</p>
              <button
                onClick={() => handleButtonClick(testimonial.videoUrl)}
                className="bg-blue-200 text-black py-2 px-4 rounded hover:bg-blue-600 transition duration-300 text-xs sm:text-sm"
              >
                Watch Video
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} videoUrl={videoUrl} />
    </>
  );
};

export default Testimonials;
