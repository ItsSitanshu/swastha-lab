'use client';

import React from 'react';
import Column from './Column';


const AppointmentHistory: React.FC  = () => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Column/>

      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-black">Maxillary Left Lateral Incisor</h3>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-500">MEI 03</div>
            <div className="text-green-600">Done</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Condition</div>
              <div className="text-gray-600">Caries</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Treatment</div>
              <div className="text-gray-600">Tooth filling</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Dentist</div>
              <div className="text-gray-600">Drg Soap Mactavish</div>
            </div>
            <div className="text-gray-500">Advanced Decay</div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-500">APR 12</div>
            <div className="text-yellow-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Condition</div>
              <div className="text-gray-600">Caries</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Treatment</div>
              <div className="text-gray-600">Tooth filling</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Dentist</div>
              <div className="text-gray-600">Drg Soap Mactavish</div>
            </div>
            <div className="text-gray-500">Reason: Not enough time</div>
            <div className="text-gray-500">Decay in pulp</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentHistory;