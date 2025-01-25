"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PatientTab from '@/app/components/PatientTab'; 
import Navbar from "@/app/components/Navbar";

const supabase = createClientComponentClient();
const SUB_PAGE_NAME = "Patient";

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
        <DashboardSidebar currentPage={SUB_PAGE_NAME}/>
        <div className="ml-64 flex flex-row bg-background font-jksans">
        <div className="flex-1 p-6">
            <Navbar user={user} page={SUB_PAGE_NAME}/>
            <div className="bg-white p-6 rounded-lg shadow">
              
              <div>
                <div className="flex mb-6"></div>
                <PatientTab user={user}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First duplicated item */}
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

                  {/* Second duplicated item */}
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
