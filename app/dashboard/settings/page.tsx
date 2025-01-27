"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/app/components/Navbar";

import Image from "next/image";
import { fetchDoctor } from "@/app/lib";

const supabase = createClientComponentClient();

const SUB_PAGE_NAME: string = "Settings";

export default function DashboardPatientPage() {
  const [user, setUser] = useState<any>();
  const [doctor, setDoctor] = useState<any>();

  const [pfpUrl, setPfpUrl] = useState<string | any>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [hasChanged, setHasChanged] = useState<boolean>(false);

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


  const uploadLogo = async () => {
    if (!selectedFile) return;
  
    const filePath = `doctors/${user.id}`;
  
    try {
      const { data: uploadData, error } = await supabase.storage
        .from('doctors')
        .upload(filePath, selectedFile, { upsert: true});
  
      if (error) {
        throw error;
      }
  
      const { data: publicUrlData } = supabase.storage
        .from('doctors')
        .getPublicUrl(filePath);
      

      return publicUrlData.publicUrl as string;
    } catch (error: any) {
      console.error('Error uploading logo:', error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDoctor(user.id, supabase, setDoctor);
    }
  }, [user]);

  useEffect(() => {
    if (doctor) {
      setFirstName(doctor.name[0]);
      setLastName(doctor.name[1]);
      setPfpUrl(doctor.pfp);
    }
  }, [doctor])

  useEffect(() => {
    if (doctor) {
      if (
        doctor.name[0] !== firstName ||
        doctor.name[1] !== lastName ||
        doctor.pfp !== pfpUrl
      ) {
        setHasChanged(true);
      } else {
        setHasChanged(false);
      }
    }

    console.log(hasChanged);
  })


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      
      setPfpUrl(fileUrl);
      setSelectedFile(file);
    }
  };

  const saveChanges = async () => {
    const { data, error: selectError } = await supabase
      .from('doctor')
      .select('*')
      .eq('id', user.id);
  
    if (selectError) {
      alert('Error checking for existing profile');
      return;
    }
    
    let URL: string | undefined = "";

    if (data && data.length > 0) {  
      if (selectedFile) {
        try {
          URL = await uploadLogo();
        } catch (error) {
          console.error('Error uploading logo:', error);
          alert('There was an issue uploading the profile piccture. Please try again.');
          return; 
        }
      } else {
        URL = doctor.pfp 
      }
  
      const updates = {
        id: doctor.id,
        name: [firstName, lastName],
        pfp: URL,  
        special: doctor.special,
        reserv: doctor.reserv,
        personal: doctor.personal,      
      };
  
      try {
        const { data: updatedData, error: updateError } = await supabase
          .from('doctor')
          .update(updates)  
          .eq('id', user.id); 
  
        if (updateError) {
          throw updateError;
        }
  
        alert('Changes saved successfully');
        setHasChanged(false);
      } catch (error: any) {
        console.error('Error saving changes:', error);
        alert(`Error saving changes: ${error.message || 'Unknown error'}`);
      } finally {
        fetchDoctor(user.id as string, supabase, setDoctor);
        setPfpUrl("");
      }
  
    } 
  };
  


  return (
    <>
      {user && doctor ? (
        <>
          <DashboardSidebar currentPage={SUB_PAGE_NAME} />
          <div className="flex ml-0 md:ml-64 h-screen bg-background font-jksans">
            <div className="flex-1 p-4 md:p-6">
              <Navbar user={user} page={SUB_PAGE_NAME} />

              <div className="flex min-h-screen bg-background-10">
                <div className="w-full md:w-full bg-background px-6 relative">
                  <div className="flex flex-row justify-between"> 
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Account</h2>
                      <p className="text-gray-500 text-sm mb-4">
                        This information will be displayed publicly so be careful
                        what you share.
                      </p>
                    </div>
                    <div className="flex flex-col items-center w-40 h-40">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden w-full h-full"
                        onChange={handleFileChange} 
                      />
                      <Image src={pfpUrl} 
                        width={2000}
                        height={2000}
                        alt='?' 
                        className='w-auto h-full hover:cursor-pointer rounded-full border border-background' 
                        onClick={() => fileInputRef.current?.click()}
                      />
                    </div>
                  </div>
                  <div className="w-3/4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className="font-nue text-[1rem] underline ml-1 text-foreground/80"
                          htmlFor="first-name"
                        >
                          First name
                        </label>
                        <input
                          className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
                          id="first-name"
                          type="text"
                          value={firstName}
                          onChange={(e: any) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          className="font-nue text-[1rem] underline ml-1 text-foreground/80"
                          htmlFor="last-name"
                        >
                          Last name
                        </label>
                        <input
                          className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
                          id="last-name"
                          type="text"
                          value={lastName}
                          onChange={(e: any) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
  
                    {/* <h3 className="text-lg font-semibold mb-2">
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
                          className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
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
                    </div> */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    </div> */}
                    <p className="text-gray-500 text-sm mb-4">
                      This account is associated with {user.id.toUpperCase()}
                    </p>
                    <div className="flex justify-end">
                      <button className="bg-background-40 hover:bg-foreground-100 hover:text-background-100 text-foreground border border-foreground-30 font-semibold py-2 px-4 rounded-xl mr-2 transition-all duration-200 ease-in-out">
                        Cancel
                      </button>
                      <button 
                        onClick={saveChanges}
                        disabled={!hasChanged}
                        className={`${ hasChanged ? 'bg-mod hover:bg-dark text-background' : 'bg-background-40 text-foreground border border-foreground-30' } font-semibold py-2 transition-all duration-200 ease-in-out px-4 rounded-xl`}>
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