import React from "react";
import Image from "next/image";

import dashboardIcon from "@/app/assets/images/icons/dashboard/dashboard.svg";
import AdashboardIcon from "@/app/assets/images/icons/dashboard/A_dashboard.svg";

import patientIcon from "@/app/assets/images/icons/dashboard/patient.svg";
import ApatientIcon from "@/app/assets/images/icons/dashboard/A_patient.svg";

import messageIcon from "@/app/assets/images/icons/dashboard/message.svg";
import AmessageIcon from "@/app/assets/images/icons/dashboard/A_message.svg";

import calenderIcon from "@/app/assets/images/icons/dashboard/calender.svg";
import AcalenderIcon from "@/app/assets/images/icons/dashboard/A_calender.svg";

import appointmentIcon from "@/app/assets/images/icons/dashboard/appointment.svg";
import AappointmentIcon from "@/app/assets/images/icons/dashboard/A_appointment.svg";

import analyticsIcon from "@/app/assets/images/icons/dashboard/analytics.svg";
import AanalyticsIcon from "@/app/assets/images/icons/dashboard/A_analytics.svg";

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
    href: "/dashboard",
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
    icon: calenderIcon,
    Aicon: AcalenderIcon,
    text: "Calender",
    href: "/dashboard/calender",
  },
  {
    icon: appointmentIcon,
    Aicon: AappointmentIcon,
    text: "Appointment",
    href: "/dashboard/appointment",
  },
  {
    icon: analyticsIcon,
    Aicon: AanalyticsIcon,
    text: "Analytics",
    href: "/dashboard/analytics",
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

interface DashboardSidebarOptions {
  currentPage: string;
}

const DashboardSidebar: React.FC<DashboardSidebarOptions> = ({
  currentPage,
}) => {
  return (
    <div className="w-64 bg-white p-6 border-r border-gray-200 flex flex-col h-screen justify-between">
      <div>
        <div className="flex items-center mb-8">
          <img alt="Logo" className="w-10 h-10 mr-3" src="/logo.svg" />
          <span className="text-xl font-semibold text-black">Swastha Lab</span>
        </div>

        <nav>
          {SidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg mb-2 transition-colors duration-400 ${
                currentPage === item.text
                  ? "bg-dark text-foreground font-semibold"
                  : "hover:bg-black/30 text-background font-semibold"
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

      <a href="/logout" className="flex items-center text-red-500 p-3 rounded-lg">
        <Image src={logoutIcon} alt="Logout" width={20} height={20} className="w-5 h-5 mr-3" />
        <span>Log out</span>
      </a>
    </div>
  );
};

export default DashboardSidebar;
