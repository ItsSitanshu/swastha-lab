'use client';

import React from "react";
import Image from 'next/image';

import InitialCard from "@/app/components/InitialCard";


function Home() {

  const assignParent = async () => {
    /* fetch  db */
    /* child ko data set gariyo */
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <InitialCard isChild={true} childFunction={assignParent}/>
    </div>
  );
}

export default Home;