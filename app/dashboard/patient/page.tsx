"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import PatientTab from "@/app/components/PatientTab";
import Navbar from "@/app/components/Navbar";
import MedicalRecord from "@/app/components/MedicalRecord";
import PatientInformation from "@/app/components/PatitentInformation";
import AppointmentHistory from "@/app/components/AppointmentHistory";

import { fetchDoctor } from "@/app/lib";



const supabase = createClientComponentClient();
const SUB_PAGE_NAME = "Patient";

export default function DashboardPatientPage() {
  const [user, setUser] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);


  const [subSection, setSubSection] = useState<number>(0);
  const [view, setView] = useState<number>(0);

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
    if (user) {
      fetchDoctor(user.id, supabase, setDoctor);
    }
  }, [user]);

  return (
    <>
      {user && doctor ? (
        <>
          <Sidebar currentPage={SUB_PAGE_NAME} />
          <div className="ml-64 flex flex-row bg-background font-jksans">
            <div className="flex-1 p-6">
              <Navbar user={user} page={SUB_PAGE_NAME} />
              <div className="bg-white p-3 rounded-lg shadow">
                {view == 0 ? (
                  <div className="bg-white p-4 rounded-md shadow-md">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="font-jksans text-lg text-foreground/80">
                          <th className="py-2">PATIENT NAME</th>
                          <th className="py-2">PHONE</th>
                          <th className="py-2">EMAIL</th>
                          <th className="py-2">ADDRESS</th>
                          <th className="py-2">REGISTERED</th>
                          <th className="py-2">LAST VISIT</th>
                          <th className="py-2">LAST TREATMENT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="border-t hover:cursor-pointer hover:bg-foreground-10 transition-all ease-in-out duration-500"
                          onClick={() => {
                            setView(1);
                            setSubSection(0);
                          }}
                        >
                          <td className="py-2 flex items-center">
                            <img
                              alt="Profile picture of user"
                              className="w-8 h-8 rounded-full mr-2"
                              src=""
                            />
                            Sitanshu Shrestha
                          </td>
                          <td className="py-2">(+977) 9781425360</td>
                          <td className="py-2">sitanshu15shrestha@gmail.com</td>
                          <td className="py-2">534 Victoria Trail</td>
                          <td className="py-2">Mar 12, 2021</td>
                          <td className="py-2">03 May 2021</td>
                          <td className="py-2">Tooth Scaling + Vene</td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-2 flex items-center">
                            <img
                              alt="Profile picture of user"
                              className="w-8 h-8 rounded-full mr-2"
                              src=""
                            />
                            Aashug Baruwal
                          </td>
                          <td className="py-2">(+977) 9841732560</td>
                          <td className="py-2">spider16man10@gmail.com</td>
                          <td className="py-2">534 Victoria Trail</td>
                          <td className="py-2">Mar 12, 2021</td>
                          <td className="py-2">03 May 2021</td>
                          <td className="py-2">Tooth Scaling + Vene</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <PatientTab
                      user={user}
                      currentSubPage={subSection}
                      setCurrentSubPage={setSubSection}
                    />
                    {subSection == 2 ? (
                      <MedicalRecord />
                    ) : subSection == 1 ? (
                      <AppointmentHistory />
                    ) : subSection == 0 ? (
                      <PatientInformation />
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </div>
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
}
