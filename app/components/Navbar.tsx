"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchDoctor } from "@/app/lib";

import lightCaretIcon from '@/app/assets/images/icons/light/caret_right.svg';
import darkCaretIcon from '@/app/assets/images/icons/dark/caret_right.svg';
import LightDarkIcon from "@/app/components/LightDark";

import Image from "next/image";

const supabase = createClientComponentClient();

const Navbar: React.FC<{
  user: any;
  page: string;
}> = ({ user, page }) => {
  const getRandomColor = () => {
    const colors = ["4285F4", "EA4335", "FBBC05", "34A853"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [doctor, setDoctor] = useState<any>();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const userName = user?.user_metadata?.username || "Guest User";

  const [pfpUrl, setPfpUrl] = useState<string | any>(``);


  useEffect(() => {
    if (user) {
      fetchDoctor(user.id, supabase, setDoctor);
    }
  }, [user]);

  useEffect(() => {
    if (doctor) {
      setPfpUrl(doctor.pfp);
    }
  }, [doctor])

  return (
    <div className="flex justify-between items-center py-4 mb-6 h-16 w-full border-b border-b-foreground/90 bg-background">
      <div className="flex items-center h-10 w-6/12">
        <div className="flex flex-row items-center font-medium text-foreground h-full w-full">
          <span className="text-lg">Dashboard</span>
          <LightDarkIcon
            lightIconPath={lightCaretIcon}
            darkIconPath={darkCaretIcon}
            alt="Caret Right"
            width={200}
            className="w-5 h-5 mx-2"
          />
          <span className="text-mod font-semibold">{page}</span>
        </div>
      </div>

      <div className="flex justify-end w-6/12 items-center">
        <input
          className="rounded-lg w-1/2 md:w-1/3 px-4 py-2 mr-4 bg-background text-foreground border border-foreground focus:border-dark focus:outline-none"
          placeholder="Search for anything here..."
          type="text"
        />
        <div className="flex items-center">
          <Image
            alt={`${userName} Avatar`}
            className="w-10 h-10 rounded-full mr-2"
            height="40"
            src={pfpUrl ? pfpUrl : null}
            width="40"
          />
          <div className="flex flex-col">
            <div className="font-semibold text-foreground">{userName}</div>
            <div className="text-sm text-light">Doctor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
