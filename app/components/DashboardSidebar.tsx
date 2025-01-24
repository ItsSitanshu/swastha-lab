import React from 'react';

const sections = [
  {
    title: 'CLINIC',
    items: [
      { icon: 'fas fa-calendar-alt', text: 'Reservations', href: '#' },
      { icon: 'fas fa-user-friends', text: 'Patients', href: '#' },
      { icon: 'fas fa-stethoscope', text: 'Treatments', href: '#' },
      { icon: 'fas fa-users', text: 'Staff List', href: '#' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { icon: 'fas fa-file-invoice-dollar', text: 'Accounts', href: '#' },
      { icon: 'fas fa-chart-line', text: 'Sales', href: '#' },
      { icon: 'fas fa-shopping-cart', text: 'Purchases', href: '#' },
      { icon: 'fas fa-credit-card', text: 'Payment Method', href: '#' },
    ],
  },
  {
    title: 'PHYSICAL ASSET',
    items: [
      { icon: 'fas fa-boxes', text: 'Stocks', href: '#' },
      { icon: 'fas fa-desktop', text: 'Peripherals', href: '#' },
    ],
  },
  {
    title: 'REPORT',
    items: [
      { icon: 'fas fa-file-alt', text: 'Report', href: '#' },
      { icon: 'fas fa-headset', text: 'Customer Support', href: '#' },
    ],
  },
];

const DashboardSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white p-6 border-r border-black/30">
      <div className="flex items-center mb-8">
        <img alt="" className="w-10 h-10 mr-3" height="40" src="/logo.svg" width="40" />
        <span className="text-xl font-semibold text-black">Swastha Lab</span>
      </div>
      {sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">{section.title}</h2>
          <div>
            {section.items.map((item, idx) => (
              <div key={idx} className="mb-4">
                <a className="flex items-center text-gray-600" href={item.href}>
                  <i className={`${item.icon} mr-3`}></i>
                  {item.text}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSidebar;
