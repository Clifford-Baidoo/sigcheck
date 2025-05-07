import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [totalEmails, setTotalEmails] = useState(0);
  const [verifiedEmails, setVerifiedEmails] = useState(0);
  const [failedEmails, setFailedEmails] = useState(0);
  const [totalPDFs, setTotalPDFs] = useState(0);
  const [verifiedPDFs, setVerifiedPDFs] = useState(0);
  const [failedPDFs, setFailedPDFs] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [pdfList, setPdfList] = useState([]);
  const [emailVerificationDetails, setEmailVerificationDetails] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [scanMessage, setScanMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/get-logs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        return response.json();
      })
      .then(data => {
        const uniqueLogs = [];
        const seen = new Set();
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(log => {
          const key = log.email || log.file;
          if (key && !seen.has(key)) {
            seen.add(key);
            uniqueLogs.push(log);
          }
        });

        const emailLogs = uniqueLogs.filter(log => (log.file?.endsWith('.eml') || log.email?.endsWith('.eml')));
        const pdfLogs = uniqueLogs.filter(log => (log.file?.endsWith('.pdf') || log.email?.endsWith('.pdf')));

        setTotalEmails(emailLogs.length);
        setVerifiedEmails(emailLogs.filter(log => log.status === 'verified').length);
        setFailedEmails(emailLogs.filter(log => log.status === 'failed').length);
        setEmailVerificationDetails(emailLogs.slice(0, 3));

        setTotalPDFs(pdfLogs.length);
        setVerifiedPDFs(pdfLogs.filter(log => log.status === 'verified').length);
        setFailedPDFs(pdfLogs.filter(log => log.status === 'failed').length);
        setPdfList(pdfLogs);

        setRecentItems([...emailLogs, ...pdfLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5));

        const sortedLogs = [...emailLogs, ...pdfLogs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const timestamps = [...new Set(sortedLogs.map(log => {
          const date = new Date(log.timestamp);
          return date.toISOString().split('T')[0];
        }))];
        const verifiedCounts = timestamps.map(time =>
          sortedLogs.filter(log => new Date(log.timestamp).toISOString().split('T')[0] === time && log.status === 'verified').length
        );
        const failedCounts = timestamps.map(time =>
          sortedLogs.filter(log => new Date(log.timestamp).toISOString().split('T')[0] === time && log.status === 'failed').length
        );

        setChartData({
          labels: timestamps,
          datasets: [
            {
              label: 'Verified Items',
              data: verifiedCounts,
              borderColor: '#1e40af',
              backgroundColor: 'rgba(30, 64, 175, 0.2)',
              fill: true,
            },
            {
              label: 'Failed Items',
              data: failedCounts,
              borderColor: '#9333ea',
              backgroundColor: 'rgba(147, 51, 234, 0.2)',
              fill: true,
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
        setErrorMessage('Failed to load dashboard data. Please try again later.');
      });
  }, []);

  const handleScanEmails = () => {
    setIsScanning(true);
    setScanMessage('Scanning emails...');
    setErrorMessage('');
    fetch('http://localhost:5000/scan-emails', { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setScanMessage(`Scan complete! Processed ${data.length} emails.`);
        fetch('http://localhost:5000/get-logs')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch logs');
            }
            return response.json();
          })
          .then(data => {
            const uniqueLogs = [];
            const seen = new Set();
            data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(log => {
              const key = log.email || log.file;
              if (key && !seen.has(key)) {
                seen.add(key);
                uniqueLogs.push(log);
              }
            });

            const emailLogs = uniqueLogs.filter(log => (log.file?.endsWith('.eml') || log.email?.endsWith('.eml')));
            const pdfLogs = uniqueLogs.filter(log => (log.file?.endsWith('.pdf') || log.email?.endsWith('.pdf')));
            setTotalEmails(emailLogs.length);
            setVerifiedEmails(emailLogs.filter(log => log.status === 'verified').length);
            setFailedEmails(emailLogs.filter(log => log.status === 'failed').length);
            setEmailVerificationDetails(emailLogs.slice(0, 3));
            setTotalPDFs(pdfLogs.length);
            setVerifiedPDFs(pdfLogs.filter(log => log.status === 'verified').length);
            setFailedPDFs(pdfLogs.filter(log => log.status === 'failed').length);
            setPdfList(pdfLogs);
            setRecentItems([...emailLogs, ...pdfLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5));
          })
          .catch(error => {
            console.error('Error fetching logs after scan:', error);
            setErrorMessage('Failed to refresh dashboard after scan. Please reload the page.');
          });
      })
      .catch(error => {
        console.error('Error scanning emails:', error);
        setScanMessage('');
        setErrorMessage(`Error scanning emails: ${error.message}`);
      })
      .finally(() => {
        setIsScanning(false);
      });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().replace('T', ' ').substring(0, 16);
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Email Verification Dashboard</h1>
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-900 text-red-200 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div className="mb-4">
        <Link to="/" className="text-blue-400 hover:underline">Back to Upload</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Scan Emails</h2>
          <button
            onClick={handleScanEmails}
            className={`mt-2 w-full text-white px-4 py-2 rounded flex items-center justify-center ${
              isScanning ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'
            }`}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Scanning...
              </>
            ) : (
              'Start Scan'
            )}
          </button>
          <div className="mt-4">
            <p>Total Emails</p>
            <p className="text-lg">{totalEmails} processed</p>
            {scanMessage && (
              <p className="mt-2 text-sm" style={{ color: scanMessage.includes('Error') ? '#ef4444' : '#22c55e' }}>
                {scanMessage}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Email Verification Details</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p>Verified</p>
              <p className="text-lg">{verifiedEmails} successfully verified</p>
            </div>
            <div>
              <p>Failed</p>
              <p className="text-lg">{failedEmails} verification failed</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Recent Email Verifications</p>
            {emailVerificationDetails.length > 0 ? (
              <ul className="mt-2">
                {emailVerificationDetails.map((email, index) => (
                  <li key={index} className="py-1">
                    <span className="block">{email.email}</span>
                    <span className="text-sm text-gray-400">{email.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No email verifications available</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">PDF Files</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p>Verified</p>
              <p className="text-lg">{verifiedPDFs} verified</p>
            </div>
            <div>
              <p>Failed</p>
              <p className="text-lg">{failedPDFs} failed</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">PDF List</p>
            {pdfList.length > 0 ? (
              <ul className="mt-2">
                {pdfList.map((pdf, index) => (
                  <li key={index} className="flex items-center justify-between py-1">
                    <span>{pdf.file}</span>
                    <a
                      href={`http://localhost:5000/view-file/${pdf.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No PDFs available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg h-64">
          <h2 className="text-lg font-semibold">Verification Trend</h2>
          <div className="mt-2 h-48">
            {chartData.labels.length > 0 ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Count', color: '#d1d5db' } },
                    x: { title: { display: true, text: 'Date', color: '#d1d5db' } },
                  },
                  plugins: {
                    legend: { labels: { color: '#d1d5db' } },
                  },
                }}
              />
            ) : (
              <div className="text-center mt-10 text-gray-500">No trend data available</div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Recent Items</h2>
          <table className="w-full mt-2">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 text-left text-gray-300">Name</th>
                <th className="p-2 text-left text-gray-300">Status</th>
                <th className="p-2 text-left text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item, index) => (
                <tr key={index} className="border-t border-gray-600">
                  <td className="p-2 text-gray-200">{item.email || item.file || 'Unknown'}</td>
                  <td className="p-2 text-gray-200">{item.status}</td>
                  <td className="p-2 text-gray-200">{formatDate(item.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;