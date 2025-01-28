"use client";

import React, { useEffect } from "react";
import happyIcon from "@/app/assets/images/icons/landing/happy.svg";
import chatIcon from "@/app/assets/images/icons/landing/chat.svg";
import locationIcon from "@/app/assets/images/icons/landing/location.svg";
import callIcon from "@/app/assets/images/icons/landing/call.svg";

const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Header Section */}
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <img alt="Logo" className="w-10 h-10" src="/logo.svg" />
          <span className="text-xl font-bold">Swastha Lab</span>
        </div>
        <nav className="space-x-6">
          <a className="text-gray-600 hover:text-gray-800" href="#home">
            Home
          </a>
          <a className="text-gray-600 hover:text-gray-800" href="#about">
            About Us
          </a>
          <a className="text-gray-600 hover:text-gray-800" href="#contact">
            Contact
          </a>
        </nav>
        <div className="space-x-4">
          <a
            className="px-4 py-2 bg-mod text-white rounded-full hover:bg-dark transition-all ease-in-out duration-500"
            href="#"
          >
            Log in
          </a>
        </div>
      </header>

      {/* Main Section */}
      <main id="home" className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Lorem ipsum dolor sit.
          <span className="text-mod"> lorem </span>
          and
          <span className="text-brown"> ipsum </span>
          dolor sit.
        </h1>
        <p className="text-gray-600 mb-8">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          aspernatur repellendus eum aperiam. Officia, temporibus!
        </p>
        <a
          className="px-6 py-3 bg-mod text-white rounded-full hover:bg-dark transition-all ease-in-out duration-500"
          href="#"
        >
          Get started
        </a>
        <div className="mt-8 flex justify-center space-x-4">
          <img
            alt="lorem"
            className="w-24 h-24 rounded-full"
            src="https://placehold.co/100x100"
          />
          <img
            alt="ipsum"
            className="w-24 h-24 rounded-full"
            src="https://placehold.co/100x100"
          />
        </div>

        {/* Features Section */}
        <section className="py-16 px-4">
          <h2 className="text-3xl font-bold mb-8">
            Our
            <span className="text-mod font-pacifico"> interactive </span>
            features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f4d4d4] p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">
                Fun
                <span className="text-mod"> lorem </span>
              </h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam!
              </p>
            </div>
            <div className="bg-white text-black p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">
                Lorem
                <span className="text-mod"> Activities </span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Aliquam, reprehenderit.
              </p>
            </div>
            <div className="bg-[#e0e0e0] p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">
                Lorem, ipsum.
                <span className="text-mod"> Lorem </span>
              </h3>
              <p className="text-gray-800">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit!
              </p>
            </div>
          </div>
        </section>
      </main>
      <div className="border-b-2 border-mod mb-16"></div>

      {/* About Us Section */}
      <section id="about" className="bg-gray-50 py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">
          About
          <span className="text-mod font-pacifico"> Us </span>
        </h2>
        <p className="text-gray-600 mb-8">
          This is the about us section where you can describe your company.
        </p>
      </section>
      <div className="border-b-2 border-mod mb-16"></div>

      {/* Contact Us Section */}
      <section
        id="contact"
        className="bg-gray-50 flex items-center justify-center py-16 px-4"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Contact our friendly team</h1>
          <p className="text-gray-600 mb-8">Let us know how we can help.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <img
                  alt="Chat to sales"
                  className="w-10 h-10"
                  src={happyIcon}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Chat to sales</h2>
              <p className="text-gray-600 mb-4">Speak to our friendly team.</p>
              <a
                className="text-mod"
                href="mailto:sitanshu15shrestha@gmail.com"
              >
                sitanshu15shrestha@gmail.com
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <img
                  alt="Chat to support"
                  className="w-10 h-10"
                  src={chatIcon}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Chat to support</h2>
              <p className="text-gray-600 mb-4">We’re here to help.</p>
              <a
                className="text-mod"
                href="mailto:sitanshu15shrestha@gmail.com"
              >
                sitanshu15shrestha@gmail.com
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <img alt="Visit us" className="w-10 h-10" src={locationIcon} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Visit us</h2>
              <p className="text-gray-600 mb-4">Visit our office HQ.</p>
              <a className="text-mod" href="">
                View on Google Maps
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-4">
                <img alt="Call us" className="w-10 h-10" src={callIcon} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Call us</h2>
              <p className="text-gray-600 mb-4">We're available 24/7.</p>
              <a className="text-mod" href="tel:+1234567890">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="border-b-2 border-mod mb-16"></div>

      {/* Footer */}
      <footer className="bg-white text-center py-4">
        <p className="text-gray-600">
          © 2025 Swastha Lab. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
