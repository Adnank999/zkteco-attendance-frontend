import React from "react";
import Papa from "papaparse"; // Import papaparse for CSV export

const ShowAttendanceData = ({ data,exportAllData }) => {
  // console.log("data", data);
  // Group data by date and user_id
  const groupedData = data.reduce((acc, curr) => {
    const key = `${curr.user_id}-${curr.date}`; // Unique key for each user per date

    if (!acc[key]) {
      acc[key] = {
        user_id: curr.user_id,
        name: curr.name || "Unknown", // Handle missing name
        date: curr.date,
        start_time: curr.time, // First log of the day
        end_time: curr.time, // Will update later
      };
    } else {
      // Update end_time to the latest time of the day
      acc[key].end_time = curr.time;
    }

    return acc;
  }, {});

  const finalData = Object.values(groupedData);

  // CSV export functionality
  // const exportToCsv = () => {
  //   try {
  //     const csv = Papa.unparse(finalData.map((row, index) => ({ S_No: index + 1, ...row }))); // Add Serial No.
  //     const fileURL = window.URL.createObjectURL(new Blob([csv]));
  //     const link = document.createElement("a");
  //     link.href = fileURL;
  //     link.download = "filtered_attendance.csv";
  //     link.click();
  //   } catch (error) {
  //     console.error("Error exporting CSV:", error);
  //   }
  // };

  const exportToCsv = (dataToExport) => {
    try {
      const csv = Papa.unparse(
        dataToExport.map((row, index) => ({ S_No: index + 1, ...row })) // Add Serial No.
      );
      const fileURL = window.URL.createObjectURL(new Blob([csv]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "attendance_data.csv";
      link.click();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  return (
    <div className="mt-8 w-full">
      {/* Export Button */}
      {/* <button
        onClick={exportToCsv}
        className="absolute top-0 right-10 mt-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
      >
        Export CSV
      </button> */}

      <div className="absolute top-0 right-10 mt-4 flex gap-4">
        <button
          onClick={() => exportToCsv(finalData)} // Export current filtered data
          className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
        >
          Export Filtered Data
        </button>

        <button
          onClick={exportAllData} // Trigger API call to fetch all data
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
        >
          Export All Data
        </button>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-black border-collapse">
          <thead className="text-xs text-white uppercase bg-gray-600">
            <tr>
              {/* <th className="px-6 py-3 text-start border-x border-black">S.No</th> */}
              <th className="px-6 py-3 text-start border-x border-black">
                User ID
              </th>
              <th className="px-6 py-3 text-start border-x border-black">
                Name
              </th>
              <th className="px-6 py-3 text-start border-x border-black">
                Date
              </th>
              <th className="px-6 py-3 text-start border-x border-black">
                Start Time
              </th>
              <th className="px-6 py-3 text-start border-x border-black">
                End Time
              </th>
            </tr>
          </thead>
          <tbody className="border-b-3 border-slate-500">
            {finalData.map((row, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800">
                {/* <td className="px-6 py-4 text-start border-x border-black">{index + 1}</td> */}
                <td className="px-6 py-4 text-start border-x border-black">
                  {row.user_id}
                </td>
                <td className="px-6 py-4 text-start border-x border-black">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-start border-x border-black">
                  {row.date}
                </td>
                <td className="px-6 py-4 text-start border-x border-black">
                  {row.start_time}
                </td>
                <td className="px-6 py-4 text-start border-x border-black">
                  {row.end_time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowAttendanceData;
