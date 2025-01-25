"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PatientTab from '@/app/components/PatientTab'; 
import Navbar from "@/app/components/Navbar";
import MedicalRecord from "@/app/components/MedicalRecord";
import PatientInformation from "@/app/components/PatitentInformation";
import AppointmentHistory from "@/app/components/AppointmentHistory";

const supabase = createClientComponentClient();
const SUB_PAGE_NAME = "Patient";

export default function DashboardPatientPage() {
  const [user, setUser] = useState<any>();

  const [subSection, setSubSection] = useState<number>(0);

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
        <DashboardSidebar currentPage={SUB_PAGE_NAME}/>
        <div className="ml-64 flex flex-row bg-background font-jksans">
        <div className="flex-1 p-6">
            <Navbar user={user} page={SUB_PAGE_NAME}/>
            <div className="bg-white p-6 rounded-lg shadow">
              
              <div>
                <div className="flex mb-6"></div>
                <PatientTab user={user} currentSubPage={subSection} setCurrentSubPage={setSubSection}/>
                { subSection == 2 ? <MedicalRecord/> : subSection == 1 ? <AppointmentHistory/> : subSection == 0 ? <PatientInformation/> : <></> }
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
