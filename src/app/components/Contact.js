"use client";
import React, { useState } from "react";
import Link from "next/link";

const ContactForm = () => {
  return (
    <div className="bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Contact Us
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Feel free to reach out to us using the details below.
        </p>

        <div className="flex items-center mb-4">
          <span className="text-violet-600 text-xl mr-3">📍</span>
          <p className="text-gray-700">
            A/P Bhedasgaon, Tal- Shahuwadi, Dist - Kolhapur, Pin - 416214,
            Maharashtra, India
          </p>
        </div>

        <div className="flex items-center mb-4">
          <span className="text-violet-600 text-xl mr-3">📞</span>
          <p className="text-gray-700">+91 74473 40940</p>
        </div>

        <div className="flex items-center mb-4">
          <span className="text-violet-600 text-xl mr-3">✉️</span>
          <p className="text-gray-700">vishwajitnaik1999@gmail.com</p>
        </div>

        <div className="flex items-center">
          <span className="text-violet-600 text-xl mr-3">🌐</span>
          <Link href="https://milkhub.site/" legacyBehavior>
            <a className="text-blue-600 hover:underline">https://milkhub.site/</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;