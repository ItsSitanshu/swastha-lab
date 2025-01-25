"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PatientTab from '@/app/components/PatientTab'; 
import Navbar from "@/app/components/Navbar";

const supabase = createClientComponentClient();

export default function DashboardPatientPage() {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error: any) {
        console.error('Error fetching session:', error.message);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user.user_metadata);
    }
  }, [user]);

  return (
    <>
      {user ? (
        <>
        <DashboardSidebar currentPage="Patient"/>
        <div className="ml-64 flex flex-row bg-background font-jksans">
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <h1 className="text-2xl text-foreground font-semibold mr-4">Patient</h1>
                <div className="text-foreground">
                  Patient list &gt;
                    <span className="text-blue-600">Patient detail</span>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 mr-4 bg-background text-foreground"
                  placeholder="Search for anything here..."
                  type="text"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-4">
                  <i className="fas fa-plus"></i> Add
                </button>
                <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
                  <i className="fas fa-cog"></i> Settings
                </button>
                <div className="flex items-center ml-4">
                  <img
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                    height="40"
                    src=""
                    width="40"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{user.user_metadata.username}</div>
                    <div className="text-gray-500 text-sm">Super admin</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <img
                  alt="Patient Avatar"
                  className="w-20 h-20 rounded-full mr-4"
                  height="80"
                  src=""
                  width="80"
                />
                <div>
                  <h2 className="text-xl font-semibold text-black">{user.user_metadata.username}</h2>
                  <div className="text-gray-500">Have uneven jawline</div>
                </div>
                <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Create Appointment
                </button>
              </div>
              <div className="border-b border-gray-200 mb-6">
                <div className="flex">
                  <div className="mr-6 pb-2 border-b-2 border-transparent">
                    <a className="text-gray-600" href="#">
                      Patient Information
                    </a>
                  </div>
                  <div className="mr-6 pb-2 border-b-2 border-transparent">
                    <a className="text-gray-600" href="#">
                      Appointment History
                    </a>
                  </div>
                  <div className="mr-6 pb-2 border-b-2 border-transparent">
                    <a className="text-gray-600" href="#">
                      Next Treatment
                    </a>
                  </div>
                  <div className="pb-2 border-b-2 border-blue-600">
                    <a className="text-blue-600" href="#">
                      Medical Record
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Use the PatientCard Component */}
                  <PatientTab/>
                  <div className="bg-gray-50 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 text-black">Maxillary Left Lateral Incisor</h3>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-500">MEI 03</div>
                        <div className="text-green-600">Done</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-600">Condition</div>
                          <div className="text-gray-600">Caries</div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-600">Treatment</div>
                          <div className="text-gray-600">Tooth filling</div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-600">Dentist</div>
                          <div className="text-gray-600">Drg Soap Mactavish</div>
                        </div>
                        <div className="text-gray-500">Advanced Decay</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-500">APR 12</div>
                        <div className="text-yellow-600">Pending</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-600">Condition</div>
                          <div className="text-gray-600">Caries</div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-600">Treatment</div>
                          <div className="text-gray-600">Tooth filling</div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-600">Dentist</div>
                          <div className="text-gray-600">Drg Soap Mactavish</div>
                        </div>
                        <div className="text-gray-500">Reason: Not enough time</div>
                        <div className="text-gray-500">Decay in pulp</div>
                      </div>
                    </div>
                  </div>
                </div>
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
