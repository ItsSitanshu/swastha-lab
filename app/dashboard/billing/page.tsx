"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/app/components/Navbar";

import { fetchDoctor } from "@/app/lib";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME: string = "Billing";

export default function DashboardBillingPage() {
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

  return (
    <>
      {user ? (
        <>
          <Sidebar currentPage={SUB_PAGE_NAME} />
          <div className="flex flex-col p-4 md:p-6 ml-0 md:ml-64 h-screen bg-background font-jksans">
            <Navbar user={user} page={SUB_PAGE_NAME} />
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
                {[
                  {
                    title: "Revenue this month",
                    amount: "$10,398",
                    change: "+ $498",
                  },
                  {
                    title: "Profit this month",
                    amount: "$3,982",
                    change: "+ $198",
                  },
                ].map((item, index) => (
                  <div className="bg-white p-4 rounded-lg shadow" key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500">{item.title}</span>
                    </div>
                    <div className="text-2xl font-semibold">{item.amount}</div>
                    <div className="text-green-500">{item.change}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                  <div className="flex space-x-4 mb-4 md:mb-0">
                    <button className="text-blue-500 border-b-2 border-blue-500 pb-2">
                      Bill
                    </button>
                    <button className="text-gray-500 pb-2">
                      Payment Received
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      className="px-4 py-2 border rounded-lg"
                      placeholder="1 May 2021 - 30 May 2021"
                      type="text"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                      Export
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white text-black">
                    <thead>
                      <tr>
                        {[
                          "RESERVATION ID",
                          "PATIENT NAME",
                          "NUMBER OF BILL",
                          "RESERVATION DATE",
                          "TOTAL AMOUNT",
                          "PAYMENT",
                          "",
                        ].map((header, index) => (
                          <th
                            className="py-2 text-left px-4 border-b"
                            key={index}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "#RSV008",
                          patient: "Mote Bhai",
                          bill: "1/2",
                          date: "24/05/2022",
                          amount: "$2,311",
                          payment: "PARTIALLY PAID",
                          img: "",
                        },
                        {
                          id: "#RSV007",
                          patient: "Mote Bhai",
                          bill: "1/2",
                          date: "23/05/2022",
                          amount: "$535",
                          payment: "PARTIALLY PAID",
                          img: "",
                        },
                      ].map((row, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border-b">
                            {row.id}{" "}
                            <span className="bg-blue-100 text-blue-500 text-xs px-2 py-1 rounded">
                              NEW
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b flex items-center">
                            <img
                              alt={row.patient}
                              className="w-8 h-8 rounded-full mr-2"
                              src={row.img || null}
                            />
                            {row.patient}
                          </td>
                          <td className="py-2 px-4 border-b">{row.bill}</td>
                          <td className="py-2 px-4 border-b">{row.date}</td>
                          <td className="py-2 px-4 border-b">{row.amount}</td>
                          <td className="py-2 px-4 border-b">
                            <span className="bg-purple-100 text-purple-500 text-xs px-2 py-1 rounded">
                              {row.payment}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
