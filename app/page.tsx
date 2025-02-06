"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import githubIcon from "@/app/assets/images/logos/github.svg";
import stethscopeIcon from "@/app/assets/images/icons/stethscope.svg";
import calendarIcon from "@/app/assets/images/icons/calendar.svg";
import newIcon from "@/app/assets/images/icons/new.svg";

import photo1 from "@/app/assets/photos/1.png";
import photo2 from "@/app/assets/photos/2.png";
import photo3 from "@/app/assets/photos/3.png";
import photo4 from "@/app/assets/photos/4.png";
import photo5 from "@/app/assets/photos/5.png";


import happyIcon from "@/app/assets/images/icons/landing/happy.svg";
import chatIcon from "@/app/assets/images/icons/landing/chat.svg";
import locationIcon from "@/app/assets/images/icons/landing/location.svg";
import callIcon from "@/app/assets/images/icons/landing/call.svg";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AutoCarousel from "./components/AutoCarousel";

const LandingPage = () => {
  const [visibleSection, setVisibleSection] = useState("home");

  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setVisibleSection(sectionId); 
          }
        });
      },
      {
        threshold: 0.02,
      }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      document.documentElement.style.scrollBehavior = "auto"; 
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSmoothScroll = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white text-gray-800">

      <motion.section
        id="home"
        className={`h-min-screen flex flex-col justify-center items-center text-center bg-background ${
          visibleSection === "home" ? "opacity-100" : "opacity-0"
        }`}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 2 }}
      >
        <img alt="Logo" className="w-2/12 h-2/12 p-10 mb-3 mt-32" src="/logo.svg" />
        <div className="flex flex-row justify-center text-8xl w-full font-bold mb-4">
            <div
              className="relative text-black hover:text-mod cursor-pointer transition-all ease-in-out duration-300
              before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-mod
              before:origin-center before:h-[5px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%]
               after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-mod 
               after:origin-center after:h-[5px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%] mr-4">
            <span> लाभ</span>
            </div><span className="text-foreground-100"> with <span className="
            bg-gradient-to-r from-brown to-mod bg-clip-text text-transparent">Swastha Lab</span></span>
        </div>
        <div className="flex flex-row justify-center items-center h-14 w-full space-x-5">
          <a href="/auth/register" target="_blank" className="w-2/12 h-full"><div
            className="hover:cursor-pointer hover:bg-foreground-100 hover:text-background-100 hover:scale-[1.02] transition-all duration-300 ease-in-out  
              flex flex-row justify-center items-center aspect-square px-1 w-full h-full border-[0.5px] border-foreground-20 bg-background-100 rounded-full"
          >
              <Image
                aria-hidden
                src={newIcon}
                alt="Doctor "
                width={26}
                height={26}
                className="mr-1.5"
              />
              <h1 className="font-jksans text-[1rem]">Resgister as a Patient</h1>
          </div></a>
          <a href="/auth/doctor" target="_blank" className="w-2/12 h-full"><div
            className="hover:cursor-pointer hover:bg-foreground-100 hover:text-background-100 hover:scale-[1.02] transition-all duration-300 ease-in-out  
              flex flex-row justify-center items-center aspect-square px-1 w-full h-full border-[0.5px] border-foreground-20 bg-background-100 rounded-full"
          >
              <Image
                aria-hidden
                src={stethscopeIcon}
                alt="Doctor "
                width={26}
                height={26}
                className="mr-1.5"
              />
              <h1 className="font-jksans text-[1rem]">Log in as official NMC Doctor</h1>
          </div></a>
        </div>
      </motion.section>

      <motion.section
        id="features"
        className={`h-max-screen w-full mt-32 py-16 px-6 bg-background-100 flex flex-col justify-center items-center 
        ${visibleSection === "features" ? "opacity-100" : "opacity-0"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 1 }}
      >
        <h2 className="font-nue text-7xl font-bold text-center mb-8">
          Key <span className="text-mod font-pacifico">Features</span>
        </h2>
        <div className="flex flex-row justify-between space-x-8 w-3/4">
          <div className="w-1/3 bg-[#f4d4d4] p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-nue font-bold mb-2">AI-Driven Insights</h3>
            <p className="text-foreground-100">
              Doctors can make better diagnoses with AI-powered monitoring for
              patients
            </p>
          </div>
          <div className="w-1/3  bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-nue font-bold mb-2">Open-Source Platform</h3>
            <p className="text-foreground-100">
              Swastha Lab is fully open-source, promoting transparency and
              collaborative development.
            </p>
          </div>
          <div className="w-1/3 bg-[#e0e0e0] p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-nue font-bold mb-2">Seamless Experience</h3>
            <p className="text-foreground-100">
              Connect patients and doctors effortlessly, enhancing the quality
              of care.
            </p>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        id="about"
        className={`h-max-screen bg-foreground-100 text-background-100 w-full mt-32 py-16 px-6 flex flex-col justify-center ${
          visibleSection === "about" ? "opacity-100" : "opacity-0"
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-row w-full justify-center items-center h-16 space-x-5 mb-5">
          <h2 className="font-nue mt-10 text-7xl font-bold text-center mb-8">
            DEVELOPMENT <span className="text-mod">SNAPSHOTS</span>
          </h2>
          <a href="https://github.com/ItsSitanshu/swastha-lab" target="_blank" className="p-0 h-full"><div
            className="hover:cursor-pointer hover:bg-background-100 hover:text-background-60 hover:scale-[1.05] transition-all duration-300 ease-in-out  
              flex flex-row justify-center items-center aspect-square p-0 h-full border-[0.5px] border-foreground-20 bg-background-100 rounded-full"
          >
            <Image
              aria-hidden
              src={githubIcon}
              alt="Github Icon"
              width={64}
              height={64}
              className="p-0 w-full h-full"
            />
          </div></a>
        </div>
        <AutoCarousel/>
      </motion.section>
      <footer className="bg-foreground-100 text-white text-center py-4">
        <p>© 2025 Swastha Lab. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
