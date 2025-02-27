import React, { useState } from "react";
import axios from "axios";
import ShowAttendanceData from "./ShowAttendanceData";

const DownloadCsvForm = () => {

    const defaultDate = new Date();
    defaultDate.setHours(5, 0, 0, 0); // Set time to 5:00 AM

const offset = defaultDate.getTimezoneOffset() * 60000; // Get local timezone offset
const localDate = new Date(defaultDate.getTime() - offset); // Adjust to local timezone


  const [fromDate, setFromDate] = useState(localDate.toISOString().slice(0, 16));;
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]); // State to store fetched data

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/download-csv",
        {
          from: fromDate,
          to: toDate,
        },
        {
          responseType: "blob",
        }
      );

      // Create a URL for the CSV blob and download the file
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `filtered_attendance_${fromDate}-${toDate}.csv`;
      link.click();
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make a POST request to get the filtered data
      const response = await axios.post("http://192.168.40.11:8000/getData", {
        from: fromDate,
        to: toDate,
      });

      // Store the fetched data in state
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" pt-8 w-full relative">
      <h3 className="text-2xl font-bold text-center mb-6">
        Download Attendance CSV
      </h3>
      <form
        onSubmit={handleShowData}
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
            name="from"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* To Date Input */}
        <div className="mb-6 flex flex-col items-start w-full">
          <label
            htmlFor="to-date"
            className="block text-sm font-medium text-gray-700"
          >
            To
          </label>
          <input
            type="datetime-local"
            id="to-date"
            name="to"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            loading ? "bg-gray-400" : "hover:bg-blue-600"
          }`}
        >
          {loading ? "Loading..." : "Show Data"}
        </button>
      </form>

      {attendanceData.length > 0 && !loading && (
        <ShowAttendanceData data={attendanceData} />
      )}
    </div>
  );
};

export default DownloadCsvForm;
