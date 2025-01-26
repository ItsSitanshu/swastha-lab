"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from "@/app/components/Navbar";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME = "Dashboard";

export default function DashboardPatientPage() {
  const [user, setUser ] = useState<any>();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser (session?.user ?? null);
      } catch (error: any) {
        console.error('Error fetching session:', error.message);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser (session?.user ?? null);
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
          <DashboardSidebar currentPage={SUB_PAGE_NAME} />
          <div className="flex flex-col p-6 ml-64 h-screen bg-background font-jksans">
            <Navbar user={user} page={SUB_PAGE_NAME} />
            <div className="flex-1">
              <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <button className="p-2 rounded-full hover:bg-gray-200">
                      <i className="fas fa-sun"></i>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-200 ml-2">
                      <i className="fas fa-bell"></i>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-200 ml-2">
                      <i className="fas fa-envelope"></i>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">Visitors</span>
                      <i className="fas fa-ellipsis-h text-gray-500"></i>
                    </div>
                    <div className="text-2xl font-semibold">4,592</div>
                    <div className="text-green-500">+15.9%</div>
                    <p className="text-gray-500 mt-2">
                      Stay informed with real-time data to enhance patient care and visitor management.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">Doctors</span>
                      <i className="fas fa-ellipsis-h text-gray-500"></i>
                    </div>
                    <div className="text-2xl font-semibold">260</div>
                    <div className="text-green-500">+15.9%</div>
                    <p className="text-gray-500 mt-2">
                      Stay updated with essential information to streamline medical support and management.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">Patient</span>
                      <i className="fas fa-ellipsis-h text-gray-500"></i>
                    </div>
                    <div className="text-2xl font-semibold">540</div>
                    <div className="text-red-500">-5.2%</div>
                    <p className="text-gray-500 mt-2">
                      Monitor patient statistics to improve healthcare delivery and patient satisfaction.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">Appointments</span>
                      <i className="fas fa-ellipsis-h text-gray-500"></i>
                    </div>
                    <div className="text-2xl font-semibold">1,500</div>
                    <div className="text-green-500">+10.3%</div>
                    <p className="text-gray-500 mt-2">
                      Keep track of appointments to enhance scheduling efficiency and patient care.
                    </p>
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