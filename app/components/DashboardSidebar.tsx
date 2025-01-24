import React from 'react';

const SidebarItems = [
  { icon: '/icons/dashboard.svg', text: 'Dashboard', href: '#', active: true },
  { icon: '/icons/patient.svg', text: 'Patient', href: '#' },
  { icon: '/icons/message.svg', text: 'Message', href: '#', badge: 120 },
  { icon: '/icons/appointment.svg', text: 'Appointment', href: '#' },
  { icon: '/icons/medical.svg', text: 'Medical Record', href: '#' },
  { icon: '/icons/analytics.svg', text: 'Analytics', href: '#' },
  { icon: '/icons/billing.svg', text: 'Billing', href: '#' },
  { icon: '/icons/settings.svg', text: 'Settings', href: '#' },
];

const DashboardSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white p-6 border-r border-gray-200 flex flex-col h-screen justify-between">
      <div>
        <div className="flex items-center mb-8">
          <img alt="Logo" className="w-10 h-10 mr-3" src="/logo.svg" />
          <span className="text-xl font-semibold text-black">Swastha Lab</span>
        </div>

        <nav>
          {SidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center p-3 rounded-lg mb-2 ${
                item.active ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
              } transition-colors duration-200 delay-75 hover:bg-gray-100`}
            >
              <img src={item.icon} alt="" className="w-6 h-6 mr-3" />
              <span>{item.text}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>

      <a href="/logout" className="flex items-center text-red-500 p-3 rounded-lg">
        <img src="/icons/logout.svg" alt="Logout" className="w-5 h-5 mr-3" />
        <span>Log out</span>
      </a>
    </div>
  );
};

export default DashboardSidebar;
