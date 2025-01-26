"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/app/components/Navbar";

const supabase = createClientComponentClient();
const SUB_PAGE_NAME = "Appointment";

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
              {/* MAIN PART */}
              <div className="bg-white p-4 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <button className="text-#[4285F4] border-b-2 border-blue-500 pb-1">
                      Active Treatment
                    </button>
                    <button className="text-gray-500">
                      Inactive Treatment
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">72 total patients</span>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                      + Add Patient
                    </button>
                  </div>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500">
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
                    {/* Example Patient Data */}
                    <tr className="border-t">
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
                        Aayan Maskey
                      </td>
                      <td className="py-2">(+977) 9841732560</td>
                      <td className="py-2">maskeyaayan08@gmail.com</td>
                      <td className="py-2">534 Victoria Trail</td>
                      <td className="py-2">Mar 12, 2021</td>
                      <td className="py-2">03 May 2021</td>
                      <td className="py-2">Tooth Scaling + Vene</td>
                    </tr>
                  </tbody>
                </table>
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
