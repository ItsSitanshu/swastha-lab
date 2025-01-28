"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/SideBar";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME = "Dashboard";

type User = {
  user_metadata: {};
};

type Patient = {
  name: string;
  ward: string;
  priority: "High" | "Medium" | "Low";
  startDate: string;
  endDate: string;
  gender: string;
  age: number;
  imgSrc: string;
};

const cardsData = [
  {
    icon: "fas fa-bed",
    title: "Beds",
    count: 86,
    description: "Available hospital beds",
  },
  {
    icon: "fas fa-user-md",
    title: "Doctors",
    count: 126,
    description: "Available doctors",
  },
  {
    icon: "fas fa-ambulance",
    title: "Ambulance",
    count: 32,
    description: "Available ambulance",
  },
];

const patientsData: Patient[] = [
  {
    name: "Sitanshu Shrestha",
    ward: "#123456",
    priority: "Medium",
    startDate: "June 3, 2023",
    endDate: "--",
    gender: "Male",
    age: 26,
    imgSrc: "",
  },
  {
    name: "Sourya Udas",
    ward: "#985746",
    priority: "Low",
    startDate: "May 31, 2023",
    endDate: "June 4, 2023",
    gender: "Female",
    age: 22,
    imgSrc: "",
  },
];

const DashboardPatientPage = () => {
  const [user, setUser] = useState<User | null>(null);

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
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {user ? (
        <>
          <Sidebar currentPage={SUB_PAGE_NAME} />
          <div className="flex flex-col p-6 ml-64 h-screen bg-background font-jksans">
            <Navbar user={user} page={SUB_PAGE_NAME} />
            <div className="flex-1">
              <div className="p-6 h-full">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {cardsData.map((card, index) => (
                      <div
                        key={index}
                        className="p-6 rounded-lg border border-gray-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <i
                              className={`${card.icon} text-blue-500 text-2xl`}
                            ></i>
                            <span className="text-lg font-semibold">
                              {card.title}
                            </span>
                          </div>
                          <i className="fas fa-arrow-right text-gray-400"></i>
                        </div>
                        <div className="text-3xl font-bold">{card.count}</div>
                        <div className="text-gray-500">{card.description}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-6 rounded-lg border border-gray-300">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-lg font-semibold">Patient</h2>
                          <p className="text-gray-500">
                            This is your several latest patient list
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg mr-4">
                            Sort : A - Z
                          </button>
                          <a className="text-blue-500" href="#">
                            See All
                          </a>
                        </div>
                      </div>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="py-2">Name</th>
                            <th className="py-2">Ward No.</th>
                            <th className="py-2">Priority</th>
                            <th className="py-2">Start Date</th>
                            <th className="py-2">End Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientsData.map((patient, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-2 flex items-center">
                                <img
                                  alt={`Profile picture of ${patient.name}`}
                                  className="w-10 h-10 rounded-full mr-2"
                                  src={patient.imgSrc}
                                />
                                <div>
                                  <div className="font-semibold">
                                    {patient.name}
                                  </div>
                                  <div className="text-gray-500">{`${patient.gender}, ${patient.age} Years`}</div>
                                </div>
                              </td>
                              <td className="py-2">{patient.ward}</td>
                              <td className="py-2">
                                <span
                                  className={`bg-${
                                    patient.priority === "High"
                                      ? "red"
                                      : patient.priority === "Medium"
                                      ? "blue"
                                      : "green"
                                  }-100 text-${
                                    patient.priority === "High"
                                      ? "red"
                                      : patient.priority === "Medium"
                                      ? "blue"
                                      : "green"
                                  }-500 px-2 py-1 rounded-lg`}
                                >
                                  {patient.priority}
                                </span>
                              </td>
                              <td className="py-2">{patient.startDate}</td>
                              <td className="py-2">{patient.endDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Calendar */}
                    <div className="p-6 rounded-lg border border-gray-300">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">January 2025</h2>
                        <div className="flex items-center">
                          <span className="text-blue-500 mr-2">Surgery</span>
                          <span className="text-green-500 mr-2">
                            Polyclinic
                          </span>
                          <span className="text-red-400">Evaluation</span>
                        </div>
                      </div>
                      <table className="w-full text-center">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="py-2">MON</th>
                            <th className="py-2">TUE</th>
                            <th className="py-2">WED</th>
                            <th className="py-2">THU</th>
                            <th className="py-2">FRI</th>
                            <th className="py-2">SAT</th>
                            <th className="py-2">SUN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [30, 31, 1, 2, 3, 4, 5],
                            [6, 7, 8, 9, 10, 11, 12],
                            [13, 14, 15, 16, 17, 18, 19],
                            [20, 21, 22, 23, 24, 25, 26],
                            [27, 28, 29, 30, 1, 2, 3],
                          ].map((week, weekIndex) => (
                            <tr key={weekIndex} className="text-gray-700">
                              {week.map((day, dayIndex) => (
                                <td
                                  key={dayIndex}
                                  className={`py-2 ${
                                    day === 8 ? "bg-blue-100 rounded-full" : ""
                                  }`}
                                >
                                  {day}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* END OF MAIN BODY */}
            </div>
          </div>
        </>
      ) : (
        <a href="auth/register/" className="text-blue-600">
          NO USER LOGGED IN
        </a>
      )}
    </>
  );
};

export default DashboardPatientPage;
