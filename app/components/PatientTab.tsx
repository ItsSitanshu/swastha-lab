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
          <h2 className="text-xl font-semibold text-foreground">{userName}</h2>
          <div className="text-foreground/50">hello</div>
        </div>
        <button className="ml-auto bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/80">
          Add Note
        </button>
      </div>
      <div className="border-b border-foreground/10 mb-6">
        <div className="flex">
          <div className={`mr-6 pb-2 ${linkStyles(0)}`} onClick={() => setCurrentSubPage(0)}>
            <a className="text-sm">
              Patient Information
            </a>
          </div>
          <div className={`mr-6 pb-2 ${linkStyles(1)}`} onClick={() => setCurrentSubPage(1)}>
            <a className="text-sm" href="#">
              Appointment History
            </a>
          </div>
          <div className={`pb-2 ${linkStyles(2)}`} onClick={() => setCurrentSubPage(2)}>
            <a className="text-sm" href="#">
              Medical Record
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTab;
