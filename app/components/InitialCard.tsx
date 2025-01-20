"use client";

import React, { useState } from "react";
import Image from "next/image";

import pfp from "@/app/assets/images/sitahero.png"; // Patient Image
import qrcode from "@/app/assets/images/esewaqr.png"; // QR Code

interface InitialCardInterface {
  isChild: boolean;
  childFunction?: () => void;
}

const InitialCard: React.FC<InitialCardInterface> = ({ isChild, childFunction }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const patientDetails = {
    name: "Sitanshu Shrestha",
    id: "123456",
    policy: "CA311712841",
    address: "Kathmandu, Nepal",
  };

  const doctorAvatars = [pfp, pfp, pfp];
  const hoverItems = ["Calendar", "Documents", "Medications"];

  return (
    <div className="w-[90vw] max-w-[1200px] h-[300px] bg-[#282c34] text-white flex p-6 rounded-lg shadow-lg relative">
      
      {/* Patient Image */}
      <div className="relative w-[150px] h-[150px] bg-gray-500 rounded-full flex items-center justify-center overflow-hidden">
        <Image src={pfp} alt="Patient" width={140} height={140} className="rounded-full object-cover" />
      </div>

      {/* Patient Details */}
      <div className="flex-1 flex flex-col justify-center pl-6">
        <h2 className="text-2xl font-semibold">{patientDetails.name}</h2>
        <p className="text-sm text-gray-300">Patient ID: <span className="text-yellow-400 font-semibold">{patientDetails.id}</span></p>
        <p className="text-sm text-gray-300">Policy Number: <span className="text-yellow-400 font-semibold">{patientDetails.policy}</span></p>
        <p className="text-sm text-gray-300">Address: <span className="text-yellow-400 font-semibold">{patientDetails.address}</span></p>

        {/* Doctor Avatars */}
        <div className="flex space-x-2 mt-4">
          {doctorAvatars.map((doc, index) => (
            <div key={index} className="w-10 h-10 bg-gray-400 rounded-full overflow-hidden flex items-center justify-center">
              <Image src={doc} alt={`Doctor ${index + 1}`} width={38} height={38} className="rounded-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-[800px] flex flex-col space-y-4"> {/* Increased left position */}
        {hoverItems.map((item, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center transition-transform duration-300 hover:bg-gray-500">
              {item.charAt(0).toUpperCase()}
            </button>

            <div className={`absolute top-1/2 -translate-y-1/2 left-16 w-28 h-12 px-4 bg-gray-800 text-white rounded-lg shadow-lg flex items-center justify-center text-sm transition-all duration-300 ${
              hoveredItem === item ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}>
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className="ml-auto flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-500 rounded-lg flex items-center justify-center overflow-hidden">
          <Image src={qrcode} alt="QR Code" width={100} height={100} className="object-contain" />
        </div>
      </div>
    </div>
  );
};

export default InitialCard;