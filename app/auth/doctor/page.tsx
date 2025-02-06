"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nmc } from "@/app/lib";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();


const colors = [
  "34A853", // Green
  "4285F4", // Blue
  "FBBC05", // Yellow
  "DB4437", // Red
  "FF9800", // Orange
  "8E24AA", // Purple
  "00ACC1", // Cyan
  "9E9D24", // Lime
];

export default function DoctorAuth() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [primaryHospital, setPrimaryHospital] = useState<string>("");
  const [nmcNo, setNmcNo] = useState<number | "">(""); // Ensure controlled input
  const [nmcData, setNmcData] = useState<any | null>(null);
  const [degree, setDegree] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const verifyNMC = async () => {
      if (!nmcNo) {
        setNmcData(null); // Prevents uncontrolled input warnings
        return;
      }

      try {
        const response = await nmc(Number(nmcNo));
        if (response.code === 200) {
          setNmcData(response.response);
          setError(null);
        } else {
          setNmcData(null);
          setError("Invalid NMC number or not found.");
        }
      } catch (err) {
        setNmcData(null);
        setError("Failed to fetch NMC data.");
      }
    };

    verifyNMC();
  }, [nmcNo]);

  useEffect(() => {
    if (!nmcData) {
      setFirstName("");
      setLastName("");
      return;
    }

    let fullName = nmcData["Full Name"] || "";
    fullName = fullName.replace(/(Dr\.|PhD|MD|MBBS|MS|Prof\.|Sir)/gi, "").trim();

    const nameParts = fullName.split(" ");
    setFirstName(nameParts[0] || "");
    setLastName(nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

    setPrimaryHospital(nmcData["Working Place"] || "");
  }, [nmcData]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!firstName || !lastName || !email || !password || !nmcNo || !primaryHospital) {
      setError("All fields are required.");
      return;
    }

    try {
      const username = `${firstName} ${lastName}`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}%20${lastName}&background=${randomColor}&color=fff`;

        const { data: insertData, error: insertError } = await supabase
          .from("doctor")
          .insert([
            {
              name: [firstName, lastName],
              id: data.user.id,
              nmc: nmcNo,
              pfp: avatarUrl,
              email: email,
              special: [],
              reserv: [],
              personal: { 
                  workplace: primaryHospital,
                  gender: nmcData["Gender"] || "RNS",
                  degree: nmcData["Degree"] || "Unknown",
               },
            },
          ]);

        if (insertError) {
          setError("Failed to create doctor entry. Please try again.");
        } else {
          setSuccess(
            "Sign up successful! Please check your email for confirmation."
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message.charAt(0).toUpperCase() + error.message.slice(1));
      } else if (data.user) {
        setSuccess("Sign in successful!");
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="bg-background border border-foreground p-8 rounded-xl shadow-md w-full max-w-md">
        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? "Login to Your Account" : "Register as an Official Doctor"}
          </h2>

          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">NMC No.</label>
                <input
                  type="number"
                  placeholder="Enter NMC No."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mod"
                  value={nmcNo}
                  onChange={(e) => setNmcNo(e.target.value ? Number(e.target.value) : "")}
                />
              </div>

              {nmcData && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Hari"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mod"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acharya"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mod"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Primary Workplace</label>
                    <input
                      type="text"
                      placeholder="e.g. Xyz Hospital"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mod"
                      value={primaryHospital}
                      onChange={(e) => setPrimaryHospital(e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="e.g. haribahadur@gmail.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mod"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="e.g. sec!!rE@321"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mod"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

          <button
            type="submit"
            className="w-full border border-background text-background py-2 rounded-lg hover:bg-mod transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
