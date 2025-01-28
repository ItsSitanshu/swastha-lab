import React from "react";
import Image from "next/image";

import dashboardIcon from "@/app/assets/images/icons/dashboard/dashboard.svg";
import AdashboardIcon from "@/app/assets/images/icons/dashboard/A_dashboard.svg";

import patientIcon from "@/app/assets/images/icons/dashboard/patient.svg";
import ApatientIcon from "@/app/assets/images/icons/dashboard/A_patient.svg";

import messageIcon from "@/app/assets/images/icons/dashboard/message.svg";
import AmessageIcon from "@/app/assets/images/icons/dashboard/A_message.svg";

import scheduleIcon from "@/app/assets/images/icons/dashboard/schedule.svg";
import AscheduleIcon from "@/app/assets/images/icons/dashboard/A_schedule.svg";

import billingIcon from "@/app/assets/images/icons/dashboard/billing.svg";
import AbillingIcon from "@/app/assets/images/icons/dashboard/A_billing.svg";

import settingsIcon from "@/app/assets/images/icons/dashboard/settings.svg";
import AsettingsIcon from "@/app/assets/images/icons/dashboard/A_settings.svg";

import logoutIcon from "@/app/assets/images/icons/dashboard/logout.svg";

const SidebarItems = [
  {
    icon: dashboardIcon,
    Aicon: AdashboardIcon,
    text: "Dashboard",
    href: "/dashboard/",
  },
  {
    icon: patientIcon,
    Aicon: ApatientIcon,
    text: "Patient",
    href: "/dashboard/patient",
  },
  {
    icon: messageIcon,
    Aicon: AmessageIcon,
    text: "Message",
    href: "/dashboard/message",
  },
  {
    icon: scheduleIcon,
    Aicon: AscheduleIcon,
    text: "Schedule",
    href: "/dashboard/schedule",
  },
  {
    icon: billingIcon,
    Aicon: AbillingIcon,
    text: "Billing",
    href: "/dashboard/billing",
  },
  {
    icon: settingsIcon,
    Aicon: AsettingsIcon,
    text: "Settings",
    href: "/dashboard/settings",
  },
];

interface SidebarOptions {
  currentPage: string;
}

const Sidebar: React.FC<SidebarOptions> = ({ currentPage }) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-background p-6 border-r border-foreground/50 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-center mb-8">
          <img alt="Logo" className="w-10 h-10 mr-3" src="/logo.svg" />
          <span className="text-xl font-semibold text-foreground">
            Swastha Lab
          </span>
        </div>

        <nav>
          {SidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex font-jksans items-center px-3 py-2 rounded-lg mb-2 transition-colors duration-400 ${
                currentPage === item.text
                  ? "bg-dark text-foreground font-semibold"
                  : "hover:bg-black/30 text-foreground font-semibold"
              }`}
            >
              <Image
                src={currentPage === item.text ? item.Aicon : item.icon}
                alt={item.text}
                width={24}
                height={24}
                className="w-6 h-6 mr-3"
              />
              <span>{item.text}</span>
            </a>
          ))}
        </nav>
      </div>

      <a
        href="/logout"
        className="flex items-center text-red-500 p-3 rounded-lg hover:bg-foreground transition-all ease-in-out duration-500"
      >
        <Image
          src={logoutIcon}
          alt="Logout"
          width={20}
          height={20}
          className="w-5 h-5 mr-3"
        />
        <span>Logout</span>
      </a>
    </div>
  );
};

export default Sidebar;
