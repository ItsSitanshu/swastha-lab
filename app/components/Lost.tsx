"use client";

import Link from "next/link";

type RegisterOptionsProps = {
  doctorHref: string;
  patientHref: string;
};

export default function RegisterOptions({
  doctorHref,
  patientHref,
}: RegisterOptionsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h1 className="text-2xl font-bold mb-8">Are you lost?</h1>
      <div className="flex space-x-4">
        <Link href={doctorHref}>
          <button className="px-6 py-3 border rounded-lg bg-mod text-white hover:bg-mod-dark transition">
            Register as a Doctor
          </button>
        </Link>
        <Link href={patientHref}>
          <button className="px-6 py-3 border rounded-lg bg-mod text-white hover:bg-mod-dark transition">
            Register as a Patient
          </button>
        </Link>
      </div>
    </div>
  );
}
