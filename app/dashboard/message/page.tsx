"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/SideBar";
import Navbar from "@/app/components/Navbar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();
const SUB_PAGE_NAME = "Message";

function InboxSidebar() {
  const conversations = [
    { name: "You", count: 10 },
    { name: "Mentions", count: 6 },
    { name: "All", count: 223, highlight: true },
    { name: "Unassigned", count: 30 },
    { name: "Promotions", count: 108 },
    { name: "Support", count: 2 },
    { name: "Global Sales", count: 23 },
    { name: "Archive", count: 560 },
  ];

  const teamMembers = [
    "Kathryn Murphy",
    "Theresa Webb",
    "Darlene Robertson",
    "Arlene McCoy",
    "Jane Cooper",
    "Courtney Henry",
  ];

  return (
    <div className="bg-white w-full md:w-64 border-r border-gray-300">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold">Inbox</h2>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">Conversations</span>
          <i className="fas fa-search"></i>
        </div>
        <ul className="space-y-2">
          {conversations.map((item, index) => (
            <li
              key={index}
              className={`flex justify-between items-center ${
                item.highlight ? "text-var(--mod)" : ""
              }`}
            >
              <span>{item.name}</span>
              <span className="text-gray-500">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-300">
        <span className="font-semibold">Your Team</span>
        <ul className="mt-4 space-y-2">
          {teamMembers.map((member) => (
            <li key={member} className="flex items-center space-x-2">
              <img className="rounded-full w-8 h-8" src="" alt="" />
              <span>{member}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-[var(--mod)]">
          <a href="#" className="fas fa-plus">
            Invite your Team
          </a>
        </div>
      </div>
    </div>
  );
}

function MessageInput() {
  return (
    <div className="p-4 border-t border-gray-300">
      <div className="flex items-center space-x-4">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Send your message..."
          type="text"
        />
        <i className="fas fa-paperclip text-gray-500"></i>
        <i className="fas fa-smile text-gray-500"></i>
        <i className="fas fa-paper-plane text-[var(--mod)"></i>
      </div>
    </div>
  );
}

export default function DashboardPatientPage() {
  const [user, setUser] = useState<any>(null);

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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    fetchSession();
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <>
          <DashboardSidebar currentPage={SUB_PAGE_NAME} />
          <div className="flex flex-col p-6 md:ml-64 h-screen bg-background font-jksans">
            <Navbar user={user} page={SUB_PAGE_NAME} />
            <div className="flex-1 bg-gray-100 flex flex-col md:flex-row">
              <InboxSidebar />
              <div className="flex-1 bg-gray-100">
                <div className="p-4 border-b border-gray-300 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      alt="User  Avatar"
                      className="rounded-full w-10 h-10"
                      src=""
                    />
                    <div>
                      <h2 className="text-xl font-semibold">
                        {user?.user_metadata?.name || "User  Name"}
                      </h2>
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <i className="fas fa-ellipsis-v"></i>
                </div>
                <div className="p-4 flex-1 overflow-y-auto"></div>
                <MessageInput />
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
