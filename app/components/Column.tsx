import React from "react";

const Column = () => {
  const headers = [
    "RESERVATION ID",
    "PATIENT NAME",
    "NUMBER OF BILL",
    "RESERVATION DATE",
    "TOTAL AMOUNT",
    "PAYMENT",
    "",
  ];

  const data = [
    {
      id: "#RSV008",
      patient: "Mote Bhai",
      bill: "1/2",
      date: "24/05/2022",
      amount: "$2,311",
      payment: "PARTIALLY PAID",
      img: "",
    },
    {
      id: "#RSV007",
      patient: "Mote Bhai",
      bill: "1/2",
      date: "23/05/2022",
      amount: "$535",
      payment: "PARTIALLY PAID",
      img: "",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <div className="flex space-x-4 mb-2">
          <button className="text-blue-500 border-b-2 border-blue-500 pb-2">
            Bill
          </button>
          <button className="text-gray-500 pb-2">Payment Received</button>
        </div>
        <div className="flex items-center space-x-4">
          <input
            className="px-4 py-2 border rounded-lg"
            placeholder="1 May 2021 - 30 May 2021"
            type="text"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th className="py-2 text-left px-4 border-b" key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="py-2 px-4 border-b">
                  {row.id}{" "}
                  <span className="bg-blue-100 text-blue-500 text-xs px-2 py-1 rounded">
                    NEW
                  </span>
                </td>
                <td className="py-2 px-4 border-b flex items-center">
                  <img
                    alt={row.patient}
                    className="w-8 h-8 rounded-full mr-2"
                    src={row.img}
                  />
                  {row.patient}
                </td>
                <td className="py-2 px-4 border-b">{row.bill}</td>
                <td className="py-2 px-4 border-b">{row.date}</td>
                <td className="py-2 px-4 border-b">{row.amount}</td>
                <td className="py-2 px-4 border-b">
                  <span className="bg-purple-100 text-purple-500 text-xs px-2 py-1 rounded">
                    {row.payment}
                  </span>
                </td>
                <td className="py-2 px-4 border-b"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Column;