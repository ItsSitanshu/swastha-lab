"use client";

import { useEffect, useState } from "react";

import DashboardSidebar from "@/app/components/DashboardSidebar";
import Navbar from "@/app/components/Navbar";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME: string = "Message";

export default function DashboardPatientPage() {
  const [user, setUser] = useState<any>();

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
      console.log(user);
    }
  }, [user]);

  return (
    <>
      {user ? (
        <>
          <DashboardSidebar currentPage={SUB_PAGE_NAME} />
          <div className="ml-64 p-6 flex h-screen bg-background font-jksans">
            <Navbar user={user} page={SUB_PAGE_NAME} />

            {/* --- MAIN BODY CONTENT STARTS HERE --- */}
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
