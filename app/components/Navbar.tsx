"use client";

import React from "react";

import lightCaretIcon from '@/app/assets/images/icons/light/caret_right.svg';
import darkCaretIcon from '@/app/assets/images/icons/dark/caret_right.svg';

import LightDarkIcon from "@/app/components/LightDark";

import Image from "next/image";


const Navbar: React.FC<{
  user: any;
  page: string;
}> = ({ user, page }) => {
  const getRandomColor = () => {
  const colors = ["4285F4", "EA4335", "FBBC05", "34A853"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const userName = user?.user_metadata?.username || "Guest User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=${getRandomColor()}&color=fff`;

  return (
    <div className="flex justify-between items-center py-4 mb-6 h-16 w-full border-b border-b-foreground/90 bg-background">
      <div className="flex items-center h-10 w-6/12">
        <div className="flex flex-row items-center font-medium text-foreground h-full w-full">
          Dashboard
          <LightDarkIcon
            lightIconPath={lightCaretIcon}
            darkIconPath={darkCaretIcon}
            alt="Caret Right"
            width={200}
            className="w-5 h-10 aspect-square"
          />
          <span className="text-mod font-semibold">{page}</span>
        </div>
      </div>

      <div className="flex justify-end w-6/12 items-center">
        <input
          className="rounded-lg w-6/12 px-4 py-2 mr-4 bg-background text-foreground border border-foreground focus:border-dark focus:outline-none"
          placeholder="Search for anything here..."
          type="text"
        />
        <div className="flex w-3/13 items-center ml-4">
          <Image
            alt={`${userName} Avatar`}
            className="w-10 h-10 rounded-full mr-2"
            height="40"
            src={avatarUrl}
            width="40"
          />

          <div>
            <div className="font-semibold text-foreground">{userName}</div>
            <div className="text-sm text-light">Doctor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
