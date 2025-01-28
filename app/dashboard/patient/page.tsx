"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import PatientTab from "@/app/components/PatientTab";
import Navbar from "@/app/components/Navbar";
import MedicalRecord from "@/app/components/MedicalRecord";
import PatientInformation from "@/app/components/PatitentInformation";
import AppointmentHistory from "@/app/components/AppointmentHistory";
import { fetchDoctor } from "@/app/lib";

const supabase = createClientComponentClient();
const SUB_PAGE_NAME = "Patient";

export default function DashboardPatientPage() {
  const [user, setUser] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);

  const [patients, setPatients] = useState<any[]>([]); // State for storing patient data
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [subSection, setSubSection] = useState<number>(0);
  const [view, setView] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // State for inputting phone number
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator
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
      fetchDoctor(user.id, supabase, setDoctor);
    }
  }, [user]);

  useEffect(() => {
    if (doctor) {
      const fetchPatients = async () => {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .contains('doctors', [doctor.id]);

        if (error) {
          console.error("Error fetching patients:", error.message);
        } else {
          setPatients(data);
        }
      };

      fetchPatients();
    }
  }, [doctor]);

  const handleAddDoctorToPatient = async () => {
    setIsLoading(true);

    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', phoneNumber)
      .single();

    if (error || !patient) {
      console.error("Error fetching patient:", error?.message);
      setIsLoading(false);
      return;
    }

    const updatedDoctors = [...(patient.doctors || []), doctor.id];

    const { error: updateError } = await supabase
      .from('patients')
      .update({ doctors: updatedDoctors })
      .eq('id', patient.id);

    if (updateError) {
      console.error("Error updating patient:", updateError.message);
    } else {
      console.log("Patient's doctors array updated successfully.");
      const { data } = await supabase
        .from('patients')
        .select('*')
        .contains('doctors', [doctor.id]);

      setPatients(data);
    }

    setIsLoading(false);
    setPhoneNumber(""); // Clear the input field
  };

  return (
    <>
      {user && doctor ? (
        <>
          <Sidebar currentPage={SUB_PAGE_NAME} />
          <div className="ml-64 flex flex-row bg-background font-jksans">
            <div className="flex-1 p-6">
              <Navbar user={user} page={SUB_PAGE_NAME} />
              <div className="bg-white p-3 rounded-lg shadow">
                {/* Patient phone number input */}

                {view === 0 ? (
                  <>
                  <div className="bg-white p-4 rounded-md shadow-md">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="font-jksans text-lg text-foreground/80">
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
                        {patients.map((patient: any) => (
                          <tr
                            key={patient.id}
                            className="border-t hover:cursor-pointer hover:bg-foreground-10 transition-all ease-in-out duration-500"
                            onClick={() => {
                              setView(1);
                              setSubSection(0);
                              setSelectedPatient(patient);
                            }}
                          >
                            <td className="py-2 flex items-center">
                              <img
                                alt="Profile picture of patient"
                                className="w-8 h-8 rounded-full mr-2"
                                src={patient.pfp || null}  
                              />
                              {patient.name}
                            </td>
                            <td className="py-2">{patient.personal?.phone}</td>
                            <td className="py-2">{patient.email}</td>
                            <td className="py-2">{patient.personal?.address}</td>
                            <td className="py-2">{patient.personal?.registered_date}</td>
                            <td className="py-2">{patient.personal?.last_visit}</td>
                            <td className="py-2">{patient.personal?.last_treatment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-row w-full justify-end mt-5">
                  <div className="mb-4 w-1/3 flex flex-col">
                    <input
                      id="phoneNumber"
                      type="text"
                      className="border p-2 rounded-md"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter patient's ID"
                    />
                    <button
                      className="mt-2 bg-mod text-white p-2 rounded-md"
                      onClick={handleAddDoctorToPatient}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Add Doctor to Patient"}
                    </button>
                  </div>
                </div>
                </>
                ) : (
                  <div>
                    <PatientTab
                      user={user}
                      currentSubPage={subSection}
                      patient={selectedPatient}
                      setCurrentSubPage={setSubSection}
                    />
                    {subSection === 2 ? (
                      <MedicalRecord />
                    ) : subSection === 1 ? (
                      <AppointmentHistory />
                    ) : subSection === 0 ? (
                      <PatientInformation patient={selectedPatient}/>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
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
