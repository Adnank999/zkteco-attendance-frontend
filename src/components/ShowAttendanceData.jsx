import React from "react";
import Papa from "papaparse"; // Import papaparse

const ShowAttendanceData = ({ data }) => {
  // Group data by user_id and aggregate the time
  // const groupedData = data.reduce((acc, curr) => {
  //   const existingUser = acc.find((item) => item.user_id === curr.user_id);
  //   if (existingUser) {
  //     existingUser.time += `, ${curr.time}`;
  //   } else {
  //     acc.push({
  //       user_id: curr.user_id,
  //       name: curr.name || "Unknown", // Handle missing name
  //       date: curr.date,
  //       time: curr.time,
  //     });
  //   }
  //   return acc;
  // }, []);

  const groupedData = data.reduce((acc, curr) => {
    const existingUser = acc.find((item) => item.user_id === curr.user_id);

    if (existingUser) {
      // Update last time if the current time is later
      existingUser.end_time = curr.time;
    } else {
      // Add user to the list, starting with the first time as the same as end_time
      acc.push({
        user_id: curr.user_id,
        name: curr.name || "Unknown", // Handle missing name
        date: curr.date,
        start_time: curr.time, // First time
        end_time: curr.time, // Set as end time initially
      });
    }

    return acc;
  }, []);

  groupedData.forEach((row) => {
    if (row.start_time === row.end_time) {
      row.end_time = "--"; // No end time, show "--"
    }
  });

  // CSV export functionality
  const exportToCsv = () => {
    try {
      // Convert JSON data to CSV format using papaparse
      const csv = Papa.unparse(groupedData);

      // Create a Blob from the CSV data and trigger download
      const fileURL = window.URL.createObjectURL(new Blob([csv]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "filtered_attendance.csv";
      link.click();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  return (
    <div className="mt-8 w-full">
      {/* Export Button */}
      <button
        onClick={exportToCsv}
        className="absolute top-0 right-10 mt-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Export CSV
      </button>

      {/* Table Title */}
      <h3 className="text-xl text-center font-semibold mb-4">
        Filtered Attendance Data
      </h3>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-black border-collapse dark:text-gray-400 ">
          <thead className="text-xs text-white uppercase bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-2 border-slate-600">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-start border-x border-black "
              >
                User ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start border-x border-black"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start border-x border-black"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start border-x border-black"
              >
                Start Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-start border-x border-black"
              >
                End Time
              </th>
            </tr>
          </thead>
          <tbody className="border-b-3 border-slate-500">
            {groupedData.map((row, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
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
