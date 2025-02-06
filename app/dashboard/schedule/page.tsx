"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/app/components/Navbar";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME = "Schedule";

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
          <Sidebar currentPage={SUB_PAGE_NAME} />
          <div className="flex flex-col p-6 ml-64 h-screen bg-background font-jksans">
            <Navbar user={user} page={SUB_PAGE_NAME} />
            <div className="flex-1">
              <div className="bg-gray-100">
                <div className="max-w-7xl mx-auto p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Feb 2025</h1>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                      Today
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                      <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {"<"}
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {">"}
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                        Day
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                        Week
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                        Month
                      </button>
                    </div>
                    <div className="text-gray-700">24 Jun - 30 Jun 2024</div>
                  </div>
                  <div className="grid grid-cols-8 gap-2 text-center text-gray-700">
                    <div className="col-span-1"></div>
                    <div>MON 24</div>
                    <div>TUE 25</div>
                    <div>WED 26</div>
                    <div>THU 27</div>
                    <div>FRI 28</div>
                    <div>SAT 29</div>
                    <div>SUN 30</div>
                  </div>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    <div className="col-span-1 text-right pr-2">
                      <div className="h-16">8 AM</div>
                      <div className="h-16">8:40 AM</div>
                      <div className="h-16">9 AM</div>
                      <div className="h-16">10 AM</div>
                      <div className="h-16">11 AM</div>
                      <div className="h-16">12 PM</div>
                      <div className="h-16">1 PM</div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-pink-200 text-pink-700 rounded p-2">
                        Client Presentation Preparation
                      </div>
                      <div className="h-16 bg-blue-200 text-blue-700 rounded p-2">
                        Client Meeting Planning
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-green-200 text-green-700 rounded p-2">
                        Meetup with UI8 internal team
                      </div>
                      <div className="h-16"></div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16 bg-blue-200 text-blue-700 rounded p-2">
                        New Project Kickoff Meeting
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-pink-200 text-pink-700 rounded p-2">
                        Design Revisions
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-green-200 text-green-700 rounded p-2">
                        Client Feedback Meeting
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-green-200 text-green-700 rounded p-2">
                        Meetup with Gojek internal team
                      </div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-pink-200 text-pink-700 rounded p-2">
                        Design Refinement
                      </div>
                      <div className="h-16 bg-purple-200 text-purple-700 rounded p-2">
                        Collaboration with Development Team
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-pink-200 text-pink-700 rounded p-2">
                        Design Refinement
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16 bg-blue-200 text-blue-700 rounded p-2">
                        Design Team Stand-up Meeting
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-pink-200 text-pink-700 rounded p-2">
                        Final Touches on Client Project
                      </div>
                      <div className="h-16 bg-blue-200 text-blue-700 rounded p-2">
                        Client Meeting Progress report
                      </div>
                      <div className="h-16"></div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-pink-200 text-pink-700 rounded p-2">
                        Planning & Goal Setting for the Week
                      </div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16 bg-green-200 text-green-700 rounded p-2">
                        Meetup with Adobe internal team
                      </div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                    </div>
                    <div className="col-span-1 border-r border-gray-300">
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                      <div className="h-16"></div>
                    </div>
                  </div>
                </div>
              </div>
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
