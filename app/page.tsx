"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import githubIcon from "@/app/assets/images/logos/github.svg";
import stethscopeIcon from "@/app/assets/images/icons/stethscope.svg";
import newIcon from "@/app/assets/images/icons/new.svg";

import physioIcon from "@/app/assets/images/icons/landing/physio.svg";
import watchIcon from "@/app/assets/images/icons/landing/watch.svg";
import centerIcon from "@/app/assets/images/icons/landing/center.svg";
import AiIcon from "@/app/assets/images/icons/landing/ai.svg";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AutoCarousel from "./components/AutoCarousel";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchDoctor, fetchPatient } from "./lib";

const supabase = createClientComponentClient();

const LandingPage = () => {
  const [visibleSection, setVisibleSection] = useState("home");

  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error: any) {
        console.error("Error fetching session:", error.message);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    if (fetchDoctor(user.id, supabase, setDoctor)) return;

    fetchPatient(user.id, supabase, setPatient);
  }, [user]);

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
        <img
          alt="Logo"
          className="w-2/12 h-2/12 p-10 mb-3 mt-32"
          src="/logo.svg"
        />
        <div className="flex flex-row justify-center text-8xl w-full font-bold mb-4">
          <div
            className="relative text-black hover:text-mod cursor-pointer transition-all ease-in-out duration-300
              before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-mod
              before:origin-center before:h-[5px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%]
              after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-mod 
              after:origin-center after:h-[5px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%] mr-4"
          >
            <span> लाभ</span>
          </div>
          <span className="text-foreground-100">
            {" "}
            with{" "}
            <span
              className="
            bg-gradient-to-r from-brown to-mod bg-clip-text text-transparent"
            >
              Swastha Lab
            </span>
          </span>
        </div>
        {patient ? (
          <div className="flex flex-row justify-center items-center h-14 w-full space-x-5">
            <a href="/auth/register" target="_blank" className="w-2/12 h-full">
              <div
                className="hover:cursor-pointer hover:bg-foreground-100 hover:text-background-100 hover:scale-[1.02] transition-all duration-300 ease-in-out  
                  flex flex-row justify-center items-center aspect-square px-1 w-full h-full border-[0.5px] border-foreground-20 bg-background-100 rounded-full"
              >
                <Image
                  aria-hidden
                  src={newIcon}
                  alt="Patient Information"
                  width={26}
                  height={26}
                  className="mr-1.5"
                />
                <h1 className="font-jksans text-[1rem]">
                  Register as a Patient
                </h1>
              </div>
            </a>
          </div>
        ) : doctor ? (
          <div className="flex flex-row justify-center items-center h-14 w-full space-x-5">
            <a href="/dashboard" target="_blank" className="w-2/12 h-full">
              <div
                className="hover:cursor-pointer hover:bg-foreground-100 hover:text-background-100 hover:scale-[1.02] transition-all duration-300 ease-in-out  
                  flex flex-row justify-center items-center aspect-square px-1 w-full h-full border-[0.5px] border-foreground-20 bg-background-100 rounded-full"
              >
                <Image
                  aria-hidden
                  src={stethscopeIcon}
                  alt="Doctor"
                  width={26}
                  height={26}
                  className="mr-1.5"
                />
                <h1 className="font-jksans text-[1rem]">
                  Go to the Doctor's Dashboard
                </h1>
              </div>
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-row justify-center items-center h-14 w-full space-x-5">
              <a
                href="/auth/register"
                target="_blank"
                className="w-2/12 h-full"
              >
                <div
                  className="hover:cursor-pointer hover:bg-foreground-100 hover:text-background-100 hover:scale-[1.02] transition-all duration-300 ease-in-out  
                  flex flex-row justify-center items-center aspect-square px-1 w-full h-full border-[0.5px] border-foreground-20 bg-background-100 rounded-full"
                >
                  <Image
                    aria-hidden
                    src={newIcon}
                    alt="Patient Information"
                    width={26}
                    height={26}
                    className="mr-1.5"
                  />
                  <h1 className="font-jksans text-[1rem]">
                    Register as a Patient
                  </h1>
                </div>
              </a>
              <a href="/auth/doctor" target="_blank" className="w-2/12 h-full">
                <div
                  className="hover:cursor-pointer hover:bg-foreground-100 hover:text-background-100 hover:scale-[1.02] transition-all duration-300 ease-in-out  
                    flex flex-row justify-center items-center aspect-square px-1 w-full h-full border-[0.5px] border-foreground-20 bg-background-100 rounded-full"
                >
                  <Image
                    aria-hidden
                    src={stethscopeIcon}
                    alt="Doctor"
                    width={26}
                    height={26}
                    className="mr-1.5"
                  />
                  <h1 className="font-jksans text-[1rem]">
                    Log in as official NMC Doctor
                  </h1>
                </div>
              </a>
            </div>
          </>
        )}
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
        <div className="relative flex flex-col justify-center items-center overflow-hiddenpy-6 h-full sm:py-12">
          <div className="flex flex-row justify-between space-x-8 w-3/4 h-full">
            {[
              {
                color: "dark",
                hoverColor: "dark/80",
                title: "Physiotherapy and Telemedicine Services",
                description:
                  "Remote physiotherapy computer vision services to make sure you do it right",
                link: "#",
                linkText: "Try a demo",
                icon: physioIcon,
              },
              {
                color: "brown",
                hoverColor: "brown/80",
                title: "Seamless Experience",
                description:
                  "Connect your favorite devices, or use our use Swastha Lab's own fit bit",
                link: "#",
                linkText: "Learn More",
                icon: watchIcon,
              },
              {
                color: "dark",
                hoverColor: "dark/80",
                title: "Centralized Medical Records",
                description:
                  "All your records, one place, one time and easily accessible for you",
                link: "#",
                linkText: "Fill a survey",
                icon: centerIcon,
              },
              {
                color: "brown",
                hoverColor: "brown/80",
                title: "Advanced AI Integration",
                description:
                  "AI-powered insights for smarter healthcare decisions",
                link: "#",
                linkText: "Discover AI Features",
                icon: AiIcon,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-10 w-1/4 h-full shadow-xl ring-1 
              ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto 
              sm:max-w-sm sm:rounded-lg sm:px-10 "
              >
                <span
                  className={`absolute top-10 z-0 h-20 w-20 rounded-full bg-${item.color} transition-all duration-300 group-hover:scale-[10]`}
                ></span>
                <div className="relative z-10 mx-auto max-w-md">
                  <span
                    className={`grid h-20 w-20 place-items-center rounded-full bg-${item.color} transition-all duration-300 group-hover:bg-${item.hoverColor}`}
                  >
                    <Image
                      width={128}
                      height={128}
                      alt={item.linkText}
                      src={item.icon}
                      className="h-14 w-14 text-white transition-all"
                    />
                  </span>
                  <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                    <p>{item.description}</p>
                  </div>
                </div>
                {/* <div className="h-10 absolute bottom-0 text-base font-semibold leading-7 mt">
                  <p>
                    <a
                      href={item.link}
                      className={`text-${item.color} transition-all duration-300 group-hover:text-white`}
                    >
                      {item.linkText} &rarr;
                    </a>
                  </p>
                </div> */}
              </div>
            ))}
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
          <a
            href="https://github.com/ItsSitanshu/swastha-lab"
            target="_blank"
            className="p-0 h-full"
          >
            <div
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
            </div>
          </a>
        </div>
        <AutoCarousel />
      </motion.section>
      <footer className="bg-foreground-100 text-white text-center py-4">
        <p>© 2025 Swastha Lab. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
