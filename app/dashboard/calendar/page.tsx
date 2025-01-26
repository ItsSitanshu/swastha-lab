"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/app/components/Navbar";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME = "Calendar";

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
              {/* MAIN BODY */}
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
}
