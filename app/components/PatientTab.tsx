import React from 'react';

interface PatientCardProps {
  user: any;
  patient: any;
  currentSubPage: number;
  setCurrentSubPage: (value: number) => void;
}

const PatientTab: React.FC<PatientCardProps> = ({ user, patient, currentSubPage, setCurrentSubPage }) => {
  const getRandomColor = () => {
    const colors = ["4285F4", "EA4335", "FBBC05", "34A853"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const userName = patient.name;
  const avatarUrl = patient.pfp;

  const linkStyles = (index: number) =>
    currentSubPage === index
      ? 'border-b-2 border-mod text-foreground' 
      : 'hover:cursor-pointer hover:border-b-2 hover:border-dark border-b-2 border-transparent \
        transition-all duration-500 text-foreground/70 hover:text-foreground';

  return (
    <div className="pt-4 px-4">
      <div className="flex flex-col md:flex-row items-center mb-3">
        <img
          alt="Patient Avatar"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full mr-4"
          height="80"
          src={avatarUrl}
          width="80"
        />
        <div className="flex-grow">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">{userName}</h2>
        </div>
      </div>
      <div className="border-b border-foreground/10 mb-6">
        <div className="flex flex-wrap">
          <div className={`mr-6 pb-2 ${linkStyles(0)}`} onClick={() => setCurrentSubPage(0)}>
            <a className="text-sm md:text-base ">
              Patient Information
            </a>
          </div>
          <div className={`mr-6 pb-2 ${linkStyles(1)}`} onClick={() => setCurrentSubPage(1)}>
            <a className="text-sm md:text-base" href="#">
              Appointment History
            </a>
          </div>
          <div className={`pb-2 ${linkStyles(2)}`} onClick={() => setCurrentSubPage(2)}>
            <a className="text-sm md:text-base" href="#">
              Medical Record
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTab;