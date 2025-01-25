"use client";

import React from "react";

import lightCaretIcon from '@/app/assets/images/icons/light/caret_right.svg';
import darkCaretIcon from '@/app/assets/images/icons/dark/caret_right.svg';

import LightDarkIcon from "@/app/components/LightDark";

import Image from "next/image";


const Navbar: React.FC<{
  user: any;
}> = ({ user }) => {
  const getRandomColor = () => {
    const colors = ["4285F4", "EA4335", "FBBC05", "34A853"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const userName = user?.user_metadata?.username || "Guest User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=${getRandomColor()}&color=fff`;

  return (
    <div className="flex justify-between items-center px-6 py-4 mb-6 h-16 w-full border-b border-b-gray-200/20 bg-background">
      <div className="flex items-center h-10 w-6/12">
        <div className="flex flex-row font-medium text-foreground h-full w-full">
          Dashboard
          <LightDarkIcon
            lightIconPath={lightCaretIcon}
            darkIconPath={darkCaretIcon}
            alt="Caret Right"
            width={200}
            className="w-10 h-10 aspect-square"
          />
          <span className="text-light font-semibold">Patient detail</span>
        </div>
      </div>

      <div className="flex items-center">
        <input
          className="rounded-lg px-4 py-2 mr-4 bg-background text-foreground border border-foreground focus:ring-2 focus:ring-light focus:outline-none"
          placeholder="Search for anything here..."
          type="text"
        />

        <button className="px-4 py-2 rounded-lg mr-4 bg-mod text-background hover:bg-dark transition">
          <i className="fas fa-plus"></i> Add
        </button>

        <button className="px-4 py-2 rounded-lg bg-background text-foreground border border-foreground hover:bg-light hover:text-background transition">
          <i className="fas fa-cog"></i> Settings
        </button>

        <div className="flex items-center ml-4">
          <Image
            alt={`${userName} Avatar`}
            className="w-10 h-10 rounded-full mr-2"
            height="40"
            src={avatarUrl}
            width="40"
          />

          <div>
            <div className="font-semibold text-foreground">{userName}</div>
            <div className="text-sm text-light">Super admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
