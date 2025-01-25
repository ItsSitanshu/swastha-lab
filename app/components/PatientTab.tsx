import React from 'react';

interface PatientCardProps {
  user: any;
}

const PatientTab: React.FC<PatientCardProps> = ({ user }) => {
  const getRandomColor = () => {
    const colors = ["4285F4", "EA4335", "FBBC05", "34A853"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const userName = "Sample Patient";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=${getRandomColor()}&color=fff`;

  return  (
    <div>
      <div className="flex items-center mb-6">
        <img
          alt="Patient Avatar"
          className="w-20 h-20 rounded-full mr-4"
          height="80"
          src={avatarUrl}
          width="80"
        />
        <div>
          <h2 className="text-xl font-semibold text-black">{userName}</h2>
          <div className="text-gray-500">hello</div>
        </div>
        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add Note
        </button>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <div className="flex">
          <div className="mr-6 pb-2 border-b-2 border-transparent">
            <a className="text-gray-600" href="/dashboard/patient/patientinfo/page.tsx">
              Patient Information
            </a>
          </div>
          <div className="mr-6 pb-2 border-b-2 border-transparent">
            <a className="text-gray-600" href="#">
              Appointment History
            </a>
          </div>
          <div className="pb-2 border-b-2 border-blue-600">
            <a className="text-blue-600" href="#">
              Medical Record
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTab;
