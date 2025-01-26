import React from 'react';

interface PatientCardProps {
  user: any;
  currentSubPage: number;
  setCurrentSubPage: (value: number) => void;
}

const PatientTab: React.FC<PatientCardProps> = ({ user, currentSubPage, setCurrentSubPage }) => {
  const getRandomColor = () => {
    const colors = ["4285F4", "EA4335", "FBBC05", "34A853"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const userName = "Sample Patient";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=${getRandomColor()}&color=fff`;

  const linkStyles = (index: number) =>
    currentSubPage === index
      ? 'border-b-2 border-foreground text-foreground' 
      : 'border-b-2 border-transparent text-foreground/70 hover:text-foreground';

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center mb-6">
        <img
          alt="Patient Avatar"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full mr-4"
          height="80"
          src={avatarUrl}
          width="80"
        />
        <div className="flex-grow">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">{userName}</h2>
          <div className="text-foreground/50">hello</div>
        </div>
        <button className="mt-4 md:mt-0 md:ml-auto bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/80">
          Add Note
        </button>
      </div>
      <div className="border-b border-foreground/10 mb-6">
        <div className="flex flex-wrap">
          <div className={`mr-6 pb-2 ${linkStyles(0)}`} onClick={() => setCurrentSubPage(0)}>
            <a className="text-sm md:text-base">
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