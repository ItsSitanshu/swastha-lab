"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Supabase client initialization
const supabase = createClientComponentClient();

interface Medication {
  id: number;
  name: string;
  mrp: string;
  desc: string;
}

interface ExternalReferenceProps {
  onSelectReference: (referenceType: string) => void;
  setShowReferenceModal: (x: boolean) => void;
}

interface Test {
  testType: string;
  testName: string;
}

const ExternalReferenceTemplate: React.FC<ExternalReferenceProps> = ({ onSelectReference, setShowReferenceModal }) => {
  return (
    <div className="col-span-2 border-b border-background-20">
      <button
        onClick={() => { onSelectReference('X-Ray'); setShowReferenceModal(true) }}
        className="p-4 w-full rounded-lg font-bold text-foreground border border-foreground-20 hover:bg-foreground-100 hover:text-background-100"
      >
        X-Ray
      </button>
      <button
        onClick={() => { onSelectReference('CT Scan'); setShowReferenceModal(true) }}
        className="p-4 mt-4 w-full rounded-lg font-bold text-foreground border border-foreground-20 hover:bg-foreground-100 hover:text-background-100"
      >
        CT Scan
      </button>
      <button
        onClick={() => { onSelectReference('ECG'); setShowReferenceModal(true) }}
        className="p-4 mt-4 w-full rounded-lg font-bold text-foreground border border-foreground-20 hover:bg-foreground-100 hover:text-background-100"
      >
        ECG
      </button>
      <button
        onClick={() => { onSelectReference('MRI'); setShowReferenceModal(true) }}
        className="p-4 mt-4 w-full rounded-lg font-bold text-foreground border border-foreground-20 hover:bg-foreground-100 hover:text-background-100"
      >
        MRI
      </button>
    </div>
  );
};

const PatientInformation: React.FC<{
  patient: any;
}> = ({ patient }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allMedications, setAllMedications] = useState<Medication[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedMrp, setNewMedMrp] = useState('');
  const [newMedDesc, setNewMedDesc] = useState('');
  const [selectedReferenceType, setSelectedReferenceType] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>([]);
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [showReferenceModal, setShowReferenceModal] = useState(false);

  // Fetch medications
  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("medications")
          .select("id, name, mrp, desc");

        if (error) throw error;
        
        setAllMedications(data || []);
        setMedications(data || []); 
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // Medication search filter
  useEffect(() => {
    if (!search.trim()) {
      setMedications(allMedications);
      return;
    }

    const filteredMedications = allMedications.filter((med: Medication) =>
      med.name.toLowerCase().includes(search.toLowerCase()) || 
      med.desc.toLowerCase().includes(search.toLowerCase())
    );
    setMedications(filteredMedications);
  }, [search, allMedications]);

  const handleSelectMedication = (medication: Medication) => {
    if (!selectedMedications.some((med) => med.id === medication.id)) {
      setSelectedMedications((prev) => [...prev, medication]);
    }
  };

  const handleRemoveMedication = (id: number) => {
    setSelectedMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const tests: { [key: string]: string[] } = {
    'X-Ray': ['Lateral Chest Scan', 'Lateral Spine Scan', 'Abdomen Scan'],
    'CT Scan': ['Brain Scan', 'Abdomen Scan', 'Chest Scan', 'Spine Scan'],
    'ECG': ['Resting ECG', 'Exercise ECG'],
    'MRI': ['Brain MRI', 'Spine MRI', 'Knee MRI', 'Abdomen MRI']
  };

  const handleAddTest = () => {
    if (selectedTest && selectedReferenceType) {
      setSelectedTests((prevTests) => [
        ...prevTests, 
        { testType: selectedReferenceType, testName: selectedTest }
      ]);
      setShowReferenceModal(false); 
    }
  };

  return (
    <div className="p-8 grid grid-cols-12 gap-8">
      <div className="col-span-4 h-full flex flex-col gap-6 border-b border-background-20">
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
            {medications.slice(0, 3).map((med: Medication, i: number) => (
              <li 
                key={med.id} 
                className={`p-3 border-b border-x border-foreground-20 cursor-pointer ${i === 2 && 'rounded-b-xl'}
                  hover:bg-foreground-10`}
                onClick={() => handleSelectMedication(med)}
              >
                <p className="text-foreground-100 font-normal">
                  {med.name} - Rs. {med.mrp}
                </p>
                <p className="text-foreground-70 text-sm">{med.desc}</p>
              </li>
            ))}
          </ul>
        )}

      <div>
        <div className="bg-background-70 rounded-lg p-4">
          <h4 className="text-foreground-100 text-lg">Selected Medications:</h4>
          <ul className="">
            {selectedMedications.map((med: Medication) => (
              <li key={med.id} className="flex justify-between items-center hover">
                <span>{med.name}</span>
                <button
                  onClick={() => handleRemoveMedication(med.id)}
                  className="text-mod hover:text-mod-dark px-3 aspect-square hover:bg-foreground-100 font-bold rounded-full transitition-all duration-300"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>

      <div className="flex flex-col col-span-2">
        <ExternalReferenceTemplate onSelectReference={setSelectedReferenceType} setShowReferenceModal={setShowReferenceModal} />
        <div>
          <h4 className="text-foreground-100 text-lg mt-6">Prescribed Tests:</h4>
          <ul className="mt-2">
            {selectedTests.map((test: Test, index: number) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{test.testType} - {test.testName}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showReferenceModal && selectedReferenceType && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
          <div className="bg-background-100 p-6 rounded-lg w-96">
            <h3 className="text-foreground-100 font-semibold">Add {selectedReferenceType} Test</h3>
            <div className="mt-4">
              <label className="block text-foreground-90">Select Test</label>
              <select
                value={selectedTest || ''}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full p-3 rounded-lg bg-background-70 text-foreground-90 border border-background-20 mb-4"
              >
                {tests[selectedReferenceType]?.map((test, index) => (
                  <option key={index} value={test}>
                    {test}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddTest}
                className="p-4 mt-4 w-2/4 rounded-lg font-bold text-foreground border border-foreground-20 hover:bg-foreground-100 hover:text-background-100"
              >
                Prescribe Test
              </button>
              <button
                onClick={() => setShowReferenceModal(false)}
                className="p-4 mt-4 w-1/4 rounded-lg font-bold text-foreground border border-foreground-20 hover:bg-foreground-100 hover:text-background-100"
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
