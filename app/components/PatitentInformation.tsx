'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();


interface ExternalReferenceProps {
  onSelectReference: (referenceType: string) => void;
}

const ExternalReferenceTemplate: React.FC<ExternalReferenceProps> = ({ onSelectReference }) => {
  return (
    <div className="col-span-3 border-b border-background-20">
      <button
        onClick={() => onSelectReference('X-Ray')}
        className="p-4 mt-4 w-full rounded-lg bg-mod text-light border border-background-20"
      >
        X-Ray
      </button>
      <button
        onClick={() => onSelectReference('CT Scan')}
        className="p-4 mt-4 w-full rounded-lg bg-mod text-light border border-background-20"
      >
        CT Scan
      </button>
      <button
        onClick={() => onSelectReference('ECG')}
        className="p-4 mt-4 w-full rounded-lg bg-mod text-light border border-background-20"
      >
        ECG
      </button>
      <button
        onClick={() => onSelectReference('MRI')}
        className="p-4 mt-4 w-full rounded-lg bg-mod text-light border border-background-20"
      >
        MRI
      </button>
    </div>
  );
};


const PatientInformation: React.FC = () => {
  const [medications, setMedications] = useState<any>([]);
  const [allMedications, setAllMedications] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedMrp, setNewMedMrp] = useState('');
  const [newMedDesc, setNewMedDesc] = useState('');
  const [externalReference, setExternalReference] = useState('');
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [selectedReferenceType, setSelectedReferenceType] = useState<string | null>(null);
  const [selectedObservation, setSelectedObservation] = useState<string | null>(null);
  const [selectedMedications, setSelectedMedications] = useState<any>([]);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [xrayRegion, setXrayRegion] = useState('');
  const [xrayType, setXrayType] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('medications')
          .select('id, name, mrp, desc');
        
        if (error) throw error;
        
        setAllMedications(data);
        setMedications(data); 
      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setMedications(allMedications);
      return;
    }

    const filteredMedications = allMedications.filter((med: any) =>
      med.name.toLowerCase().includes(search.toLowerCase()) || 
      med.desc.toLowerCase().includes(search.toLowerCase())
    );
    setMedications(filteredMedications);
  }, [search, allMedications]);

  const handleAddMedication = async () => {
    if (!newMedName || !newMedMrp || !newMedDesc) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([
          { name: newMedName, mrp: newMedMrp, desc: newMedDesc }
        ]);
      
      if (error) throw error;

      setAllMedications((prevMedications: any) => [
        ...prevMedications,
        ...(data || []), 
      ]);
      
      setMedications((prevMedications: any) => [
        ...prevMedications,
        ...(data || []),
      ]);
      
      setNewMedName('');
      setNewMedMrp('');
      setNewMedDesc('');
      setShowAddMedicationModal(false);
      alert('Medication added successfully!');
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const handleSelectMedication = (medication: any) => {
    setSelectedMedications((prev: any) => [...prev, medication]);
  };

  const handleRemoveMedication = (id: number) => {
    setSelectedMedications((prev: any) => prev.filter((med: any) => med.id !== id));
  };

  const observations: any = {
    'X-Ray': ['Normal', 'Mild Deformity', 'Fracture', 'Dislocation', 'Infection'],
    'CT Scan': ['Normal', 'Tumor', 'Cyst', 'Hemorrhage', 'Infection'],
    'ECG': ['Normal', 'Arrhythmia', 'Bradycardia', 'Tachycardia', 'Heart Attack'],
    'MRI': ['Normal', 'Herniated Disc', 'Tumor', 'Arthritis', 'Spinal Stenosis']
  };

  const handleAddReference = () => {
    alert(`Reference Type: ${selectedReferenceType}, Observation: ${selectedObservation}`);
    setShowReferenceModal(false); // Close modal after saving
  };


  return (
    <div className="p-8 grid grid-cols-12 gap-8">
      {/* Diagnosis and Observation Textareas */}
      <div className="col-span-3 h-full flex flex-col gap-6 border-b border-background-20">
        <textarea className="p-4 rounded-lg bg-background-80 text-foreground-100 border border-foreground-20 focus:outline-none focus:border-mod" placeholder="Diagnosis" style={{ height: '200px' }}></textarea>
        <textarea className="p-4 rounded-lg bg-background-80 text-foreground-100 border border-foreground-20 focus:outline-none focus:border-mod" placeholder="Observation" style={{ height: '200px' }}></textarea>
      </div>

      <div className="col-span-3 border-b border-background-20">
        <input
          type="text"
          placeholder="Search Medications"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-background-70 text-foreground-100 border border-foreground-20 focus:outline-none focus:border-mod"
        />
        {loading ? (
          <p className="text-foreground-50">Loading...</p>
        ) : (
          <ul className="bg-background-60 rounded-lg border border-background-20">
            {medications.slice(0, 3).map((med: any, i: number) => (
              <li 
                key={med.id} 
                className={`p-3 border-b border-x border-foreground-20 cursor-pointer ${i == 2 && 'rounded-b-xl'}`}
                onClick={() => handleSelectMedication(med)}
              >
                <p className="text-foreground-100 font-normal">{med.name} - Rs. {med.mrp}</p>
                <p className="text-foreground-70 text-sm">{med.desc}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
        
      <ExternalReferenceTemplate onSelectReference={setSelectedReferenceType} />

      {showReferenceModal && selectedReferenceType && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-background-60 p-6 rounded-lg w-96">
            <h3 className="text-foreground-100 font-semibold">Add {selectedReferenceType} Observation</h3>
            
            {/* Observation Selection */}
            <div className="mt-4">
              <label className="block text-foreground-90">Select Observation</label>
              <select
                value={selectedObservation || ''}
                onChange={(e) => setSelectedObservation(e.target.value)}
                className="w-full p-3 rounded-lg bg-background-70 text-foreground-90 border border-background-20 mb-4"
              >
                <option value="">Select Observation</option>
                {observations[selectedReferenceType]?.map((obs: any, index: any) => (
                  <option key={index} value={obs}>
                    {obs}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddReference}
                className="w-1/2 p-3 bg-mod text-light rounded-lg"
              >
                Save Reference
              </button>
              <button
                onClick={() => setShowReferenceModal(false)}
                className="w-1/2 p-3 bg-gray-500 text-light rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="col-span-3 bg-background-50 p-6 rounded-lg border border-background-20">
        <h3 className="text-foreground-100 font-semibold">Patient Information</h3>
        <p className="text-foreground-80">Name: John Doe</p>
        <p className="text-foreground-80">Age: 35</p>
        <p className="text-foreground-80">Gender: Male</p>
        <p className="text-foreground-80">Contact: +977-123456789</p>
        <p className="text-foreground-80">Blood Type: O+</p>
        <p className="text-foreground-80">Allergies: None</p>
        <p className="text-foreground-80">Previous Conditions: Hypertension</p>
      </div>

      <div className="col-span-3 bg-background-50 p-6 rounded-lg border border-background-20 mt-8">
        <h3 className="text-foreground-100 font-semibold">Selected Medications</h3>
        <ul>
          {selectedMedications.map((med: any) => (
            <li key={med.id} className="p-2 border-b border-background-20 flex justify-between">
              <p className="text-foreground-100 font-semibold">{med.name}</p>
              <button
                onClick={() => handleRemoveMedication(med.id)}
                className="text-red-500 cursor-pointer"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showReferenceModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-background-60 p-6 rounded-lg w-96">
            <h3 className="text-foreground-100 font-semibold">Add External Reference</h3>
            <div className="mt-4">
              <input
                type="text"
                value={xrayRegion}
                onChange={(e) => setXrayRegion(e.target.value)}
                className="w-full p-3 rounded-lg bg-background-70 text-foreground-90 border border-background-20 mb-4"
                placeholder="Region (e.g., Chest)"
              />
              <input
                type="text"
                value={xrayType}
                onChange={(e) => setXrayType(e.target.value)}
                className="w-full p-3 rounded-lg bg-background-70 text-foreground-90 border border-background-20 mb-4"
                placeholder="Type (e.g., X-Ray, CT, MRI)"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddReference}
                className="w-1/2 p-3 bg-mod text-light rounded-lg"
              >
                Save Reference
              </button>
              <button
                onClick={() => setShowReferenceModal(false)}
                className="w-1/2 p-3 bg-gray-500 text-light rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInformation;
