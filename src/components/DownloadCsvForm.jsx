// import React, { useState } from "react";
// import axios from "axios";
// import ShowAttendanceData from "./ShowAttendanceData";

// const DownloadCsvForm = () => {

//   const [fromDate, setFromDate] = useState("");;
//   const [toDate, setToDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [attendanceData, setAttendanceData] = useState([]); // State to store fetched data

//   console.log("attendance, ", attendanceData);

//   const handleShowData = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Make a POST request to get the filtered data
//       const response = await axios.post("http://localhost:8000/getData", {
//         from: fromDate,
//         to: toDate,
//       });

//       // Store the fetched data in state
//       setAttendanceData(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className=" pt-8 w-full relative">
//       <h3 className="text-2xl font-bold text-center mb-6">
//         Attendance Management
//       </h3>
//       <form
//         onSubmit={handleShowData}
//         className="bg-white p-6 rounded-lg shadow-lg w-fit flex flex-row items-start gap-4"
//       >
//         {/* From Date Input */}
//         <div className="mb-4 flex flex-col items-start w-full">
//           <label
//             htmlFor="from-date"
//             className="block text-sm font-medium text-gray-700"
//           >
//             From
//           </label>
//           <input
//             type="datetime-local"
//             id="from-date"
//             name="from"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             required
//             className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>

//         {/* To Date Input */}
//         <div className="mb-6 flex flex-col items-start w-full">
//           <label
//             htmlFor="to-date"
//             className="block text-sm font-medium text-gray-700"
//           >
//             To
//           </label>
//           <input
//             type="datetime-local"
//             id="to-date"
//             name="to"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             required
//             className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full mt-6 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
//             loading ? "bg-gray-400" : "hover:bg-blue-600"
//           }`}
//         >
//           {loading ? "Loading..." : "Show Data"}
//         </button>
//       </form>

//       {attendanceData.length > 0 && !loading && (
//         <ShowAttendanceData data={attendanceData} />
//       )}
//     </div>
//   );
// };

// export default DownloadCsvForm;

import React, { useState } from "react";
import axios from "axios";
import ShowAttendanceData from "./ShowAttendanceData";

const DownloadCsvForm = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]); // Stores all data
  const [searchQuery, setSearchQuery] = useState(""); // Stores search term
  const [page, setPage] = useState(1); // Current page
  const [limit] = useState(500); // Number of records per page
  const [totalPages, setTotalPages] = useState(1); // Total pages from API

  // console.log("Attendance Data: ", attendanceData);

  const handleShowData = async (newPage = 1) => {
    setLoading(true);
    setPage(newPage); // Set current page

    try {
      // Fetch paginated data from the API
      const response = await axios.post("http://192.168.10.11:8000/getData", {
        from: fromDate,
        to: toDate,
        page: newPage,
        limit: limit,
      });

      setAttendanceData(response.data.data); // Store paginated data
      setTotalPages(response.data.totalPages); // Store total pages
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // **Filter Data Based on Search Query**
  const filteredData = attendanceData.filter((record) =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log("filteredData: ", filteredData);

  return (
    <div className="pt-8 w-full relative">
      <h3 className="text-2xl font-bold text-center mb-6">
        Attendance Management
      </h3>

      <div className="flex flex-row justify-between items-center gap-4">
        {/* Form for selecting date range */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleShowData(1); // Fetch from first page on form submit
          }}
          className="bg-white p-6 rounded-lg shadow-lg w-fit flex flex-row items-start gap-4"
        >
          {/* From Date Input */}
          <div className="mb-4 flex flex-col items-start w-full">
            <label
              htmlFor="from-date"
              className="block text-sm font-medium text-gray-700"
            >
              From
            </label>
            <input
              type="datetime-local"
              id="from-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* To Date Input */}
          <div className="mb-4 flex flex-col items-start w-full">
            <label
              htmlFor="to-date"
              className="block text-sm font-medium text-gray-700"
            >
              To
            </label>
            <input
              type="datetime-local"
              id="to-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              loading ? "bg-gray-400" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Loading..." : "Show Data"}
          </button>
        </form>

        {/* Search Bar for Filtering by Name */}
        {attendanceData.length > 0 && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by user name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Display Filtered Attendance Data */}
      {filteredData.length > 0 && !loading && (
        <ShowAttendanceData data={filteredData} />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <button
            disabled={page === 1 || loading}
            onClick={() => handleShowData(page - 1)}
            className={`mx-2 px-4 py-2 text-white rounded-lg shadow-md ${
              page === 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Previous
          </button>

          <span className="mx-4 text-lg font-semibold">{`Page ${page} of ${totalPages}`}</span>

          <button
            disabled={page === totalPages || loading}
            onClick={() => handleShowData(page + 1)}
            className={`mx-2 px-4 py-2 text-white rounded-lg shadow-md ${
              page === totalPages
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadCsvForm;
