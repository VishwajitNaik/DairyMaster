import React from 'react';

const Map = () => {
  return (
    <div className="w-full h-64">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.276081973712!2d-122.41941538468113!3d37.77492977975974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808ebddcfb8b%3A0x56c28b7d8c9c7907!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1630023801633!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe>
    </div>
  );
};

export default Map;
