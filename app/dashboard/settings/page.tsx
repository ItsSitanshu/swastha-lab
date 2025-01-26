"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/app/components/Navbar";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME: string = "Settings";

export default function DashboardPatientPage() {
  const [user, setUser ] = useState<any>();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser (session?.user ?? null);
      } catch (error: any) {
        console.error("Error fetching session:", error.message);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser (session?.user ?? null);
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
          <div className="flex ml-0 md:ml-64 h-screen bg-background font-jksans">
            <div className="flex-1 p-4 md:p-6">
              <Navbar user={user} page={SUB_PAGE_NAME} />

              <div className="flex min-h-screen bg-gray-100">
                <div className="w-full md:w-1/4 bg-white p-6">
                  <h2 className="text-lg font-semibold mb-4">Settings</h2>
                  <ul>
                    {[
                      { title: "Account" },
                      { title: "Notifications" },
                      { title: "Security" },
                      { title: "Appearance" },
                      { title: "Billing" },
                      { title: "Integrations" },
                      { title: "Additional Resources" },
                    ].map((item, index) => (
                      <li key={index} className="mb-4 flex flex-col">
                        <div className="flex items-center mb-2">
                          <span className="mr-2"></span>
                          <a className="text-[#B61717] font-semibold" href="#">
                            {item.title}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full md:w-3/4 bg-white p-6 relative">
                  <h2 className="text-2xl font-semibold mb-6">Account</h2>
                  <div className="absolute top-6 right-6 text-center">
                    <img
                      alt="Profile photo placeholder"
                      className="rounded-full h-12 w-12 mx-auto"
                      src=""
                    />
                    <div className="mt-2">
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded mr-2">
                        Change
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Profile</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="first-name"
                        >
                          First name
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="first-name"
                          type="text"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="last-name"
                        >
                          Last name
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray- 700 leading-tight focus:outline-none focus:shadow-outline"
                          id="last-name"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="address"
                      >
                        Address
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          workcation.com/
                        </span>
                        <input
                          className="shadow appearance-none border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="address"
                          type="text"
                          value="lisamarie"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Personal Information
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="email"
                        >
                          Email address
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="email"
                          type="email"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="phone"
                        >
                          Phone number
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="phone"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="country"
                        >
                          Country
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="country"
                          type="text"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="language"
                        >
                          Language
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="language"
                          type="text"
                        />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      This account was created on January 5, 2017, 8:35:40 PM
                    </p>
                    <div className="flex justify-end">
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2">
                        Cancel
                      </button>
                      <button className="bg-[#B61717] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
                        Save
                      </button>
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