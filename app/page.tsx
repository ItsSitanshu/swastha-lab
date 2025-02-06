"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import happyIcon from "@/app/assets/images/icons/landing/happy.svg";
import chatIcon from "@/app/assets/images/icons/landing/chat.svg";
import locationIcon from "@/app/assets/images/icons/landing/location.svg";
import callIcon from "@/app/assets/images/icons/landing/call.svg";

const LandingPage = () => {
  const [visibleSection, setVisibleSection] = useState("home");

  useEffect(() => {
    // Enable smooth scrolling on the page
    document.documentElement.style.scrollBehavior = "smooth";

    // Create IntersectionObserver instance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setVisibleSection(sectionId); // Set visible section
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    // Observe each section on the page
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    // Cleanup observer on unmount
    return () => {
      sections.forEach((section) => observer.unobserve(section));
      document.documentElement.style.scrollBehavior = "auto"; // Reset scroll behavior
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Handle smooth scroll when navigation items are clicked
  const handleSmoothScroll = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Header Section */}
      <header className="fixed top-0 w-full z-50 bg-white shadow-md">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <img alt="Logo" className="w-10 h-10" src="/logo.svg" />
            <span className="text-xl font-bold">Swastha Lab</span>
          </div>
          <nav className="space-x-6">
            <a
              className="text-gray-600 hover:text-gray-800"
              onClick={() => handleSmoothScroll("home")}
              role="button"
            >
              Home
            </a>
            <a
              className="text-gray-600 hover:text-gray-800"
              onClick={() => handleSmoothScroll("about")}
              role="button"
            >
              About Us
            </a>
            <a
              className="text-gray-600 hover:text-gray-800"
              onClick={() => handleSmoothScroll("contact")}
              role="button"
            >
              Contact
            </a>
          </nav>
          <div className="space-x-4">
            <a
              className="px-4 py-2 bg-mod text-white rounded-full hover:bg-dark transition-all duration-500"
              href="/auth/login"
            >
              Log in
            </a>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <motion.section
        id="home"
        className={`h-screen flex flex-col justify-center items-center text-center bg-gray-50 ${
          visibleSection === "home" ? "opacity-100" : "opacity-0"
        }`}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Empowering Healthcare with <span className="text-mod">AI</span> and{" "}
          <span className="text-brown">Open Source</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Swastha Lab is your trusted partner in healthcare, seamlessly
          connecting patients and doctors.
        </p>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-mod text-white rounded-full hover:bg-dark transition-all duration-500"
          onClick={() => handleSmoothScroll("features")}
          role="button"
        >
          Get Started
        </a>
        <div className="mt-8 flex justify-center space-x-4">
          <img
            alt="AI-driven healthcare"
            className="w-24 h-24 rounded-full"
            src="https://placehold.co/100x100"
          />
          <img
            alt="Open-source platform"
            className="w-24 h-24 rounded-full"
            src="https://placehold.co/100x100"
          />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className={`h-screen py-16 px-6 bg-white flex flex-col justify-center ${
          visibleSection === "features" ? "opacity-100" : "opacity-0"
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Key <span className="text-mod font-pacifico">Features</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#f4d4d4] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">AI-Driven Insights</h3>
            <p className="text-gray-600">
              Get actionable insights with AI-powered monitoring for both
              patients and doctors.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Open-Source Platform</h3>
            <p className="text-gray-600">
              Swastha Lab is fully open-source, promoting transparency and
              collaborative development.
            </p>
          </div>
          <div className="bg-[#e0e0e0] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Seamless Experience</h3>
            <p className="text-gray-800">
              Connect patients and doctors effortlessly, enhancing the quality
              of care.
            </p>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        id="about"
        className={`h-screen py-16 px-6 bg-gray-50 flex flex-col justify-center ${
          visibleSection === "about" ? "opacity-100" : "opacity-0"
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          About <span className="text-mod">Us</span>
        </h2>
        <div className="text-center">
          <p className="text-gray-600 max-w-xl mx-auto">
            Swastha Lab uses cutting-edge technology to empower healthcare
            providers and patients. From AI insights to open-source innovation,
            we are reimagining medical care.
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <a
            className="px-6 py-3 bg-mod text-white rounded-full hover:bg-dark transition-all duration-500"
            onClick={() => handleSmoothScroll("contact")}
            role="button"
          >
            Learn More
          </a>
        </div>
      </motion.section>

      {/* Contact Us Section */}
      <motion.section
        id="contact"
        className={`h-screen py-16 px-6 bg-white flex flex-col justify-center items-center text-center ${
          visibleSection === "contact" ? "opacity-100" : "opacity-0"
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Contact <span className="text-mod">Us</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              alt="Chat to sales"
              className="w-10 h-10 mx-auto mb-4"
              src={happyIcon}
            />
            <h3 className="text-xl font-semibold mb-2">Chat to sales</h3>
            <p className="text-gray-600">Speak to our friendly team.</p>
            <a className="text-mod" href="mailto:contact@swasthalab.com">
              contact@swasthalab.com
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              alt="Chat to support"
              className="w-10 h-10 mx-auto mb-4"
              src={chatIcon}
            />
            <h3 className="text-xl font-semibold mb-2">Chat to support</h3>
            <p className="text-gray-600">We’re here to help.</p>
            <a className="text-mod" href="mailto:support@swasthalab.com">
              support@swasthalab.com
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              alt="Visit us"
              className="w-10 h-10 mx-auto mb-4"
              src={locationIcon}
            />
            <h3 className="text-xl font-semibold mb-2">Visit us</h3>
            <p className="text-gray-600">Come to our office HQ.</p>
            <a className="text-mod" href="#">
              View on Google Maps
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              alt="Call us"
              className="w-10 h-10 mx-auto mb-4"
              src={callIcon}
            />
            <h3 className="text-xl font-semibold mb-2">Call us</h3>
            <p className="text-gray-600">We're available 24/7.</p>
            <a className="text-mod" href="tel:+1234567890">
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>© 2025 Swastha Lab. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
