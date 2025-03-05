

import React, { useRef, useState } from "react";
import axios from "axios";
import ShowAttendanceData from "./ShowAttendanceData";
import { gsap } from "gsap";
import { Search, X } from "lucide-react";
import Papa from "papaparse";




const DownloadCsvForm = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]); // Stores all data
  const [searchQuery, setSearchQuery] = useState(""); // Stores search term
  const [page, setPage] = useState(1); // Current page
  const [limit] = useState(500); // Number of records per page
  const [totalPages, setTotalPages] = useState(1); // Total pages from API

  // console.log("Attendance Data: ", attendanceData);

  // console.log("searchQuery: ", searchQuery);

  const searchIconRef = useRef(null);

  const handleFocus = (e) => {
    setIsFocused(true);

    gsap.to(searchIconRef.current, {
      duration: 0.3,
      x: "-200px", // Move the icon to the left
      ease: "power2.out",
    });


    gsap.to(e.target, {
      duration: 0.3,
      width: "200%", // Start with the default width
      x: "-200px", // Move the input left by 200px
      textAlign: "center",
      borderRadius: "20px", // Set border-radius to 20px
      borderWidth: "2px", // Set border width to 2px
      borderColor: "#2563EB", // Change border color to blue
      boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)", // Add a glowing blue shadow
      transformOrigin: "right", // Set origin to right side for expansion
      ease: "power2.out", // Smooth easing
    });
  };

  const handleBlur = (e) => {
    setIsFocused(false);

    gsap.to(searchIconRef.current, {
      duration: 0.3,
      x: "0px", // Move the icon back to its original position
      ease: "power2.out",
    });


    
    gsap.to(e.target, {
      duration: 0.3,
      width: "100%",
      x: "50", // Shrink width back to normal
      borderRadius: "4px", // Reset border-radius to normal
      borderWidth: "1px", // Reset border width to 1px
      borderColor: "#d1d5db", // Reset border color to gray (default)
      boxShadow: "none", // Remove the glowing effect
      ease: "power2.out", // Smooth easing
    });
  };

  const handleShowData = async (newPage = 1) => {
    setLoading(true);
    setPage(newPage); // Set current page

    try {
      // Fetch paginated data from the API
      const response = await axios.post("http://192.168.10.11:8000/getData", {
        from: fromDate,
        to: toDate,
        page: newPage,
        exportAll: false,
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


  const handleExportAllData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://192.168.10.11:8000/getData", {
        from: fromDate,
        to: toDate,
        exportAll: true, // Request all data
      });
  
      // Call export function with complete data
      const allData = response.data.data;

      const filteredData = allData.filter((record) =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase())
      );


      exportToCsv(filteredData);
    } catch (error) {
      console.error("Error exporting all data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const exportToCsv = (dataToExport) => {
    const csv = Papa.unparse(dataToExport.map((row, index) => ({ S_No: index + 1, ...row })));
    const fileURL = window.URL.createObjectURL(new Blob([csv]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "all_attendance_data.csv";
    link.click();
  };


  

  const clearSearch = () => {
    setSearchQuery("");
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
        {/* {attendanceData.length > 0 && (
          <div className="mt-4 mr-24 relative">
            <div className="absolute left-0 top-0 transform -translate-y-1/2">
              <Search className="text-gray-500" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by user name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />

            {searchQuery && (
              <div
                className=" cursor-pointer"
                onClick={clearSearch}
              >
                <X className="text-gray-500" size={20} />
              </div>
            )}
          </div>
        )} */}

        <div className="mt-4 mr-24 ">
          {attendanceData.length > 0 && (
            <div className="relative">
               <Search ref={searchIconRef} className="text-gray-500 absolute left-16 top-1/2 transform -translate-y-1/2" size={20} />
              <input
                type="text"
                placeholder="Search by user name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />

              {/* Search Icon */}
             
               
              

              {/* Close Icon - Only show if searchQuery exists */}
              {searchQuery && (
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={clearSearch}
                >
                  <X color="#FF0000" className="text-gray-500" size={30} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Display Filtered Attendance Data */}
      {filteredData.length > 0 && !loading && (
        <ShowAttendanceData data={filteredData} exportAllData={handleExportAllData}/>
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
