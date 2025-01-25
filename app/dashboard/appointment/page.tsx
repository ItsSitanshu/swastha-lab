"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
        <div className="flex h-screen bg-background font-jksans">
          <DashboardSidebar currentPage="appointment"/>
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

            {/* --- MAIN BODY CONTENT STARTS HERE --- */}
            {/* You can start adding the removed content from this point onwards */}
            
          </div>
        </div>
      ) : (
        <a href="auth/register/" className="text-blue-600">
          NO USER LOGGED IN
        </a>
      )}
    </>
  );
}
