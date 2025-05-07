import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">About Sig-Check</h1>
      <div className="mb-4">
        <Link to="/" className="text-blue-400 hover:underline">Back to Upload</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">What is Sig-Check?</h2>
          <p className="text-gray-200 mb-4">
            Sig-Check is a web app built to make email and PDF verification a breeze. It’s designed to help you check the authenticity of your files by verifying S/MIME signatures on emails, as well as DKIM and SPF for domain authentication. For PDFs, it ensures the files are properly signed (with more verification logic to come). The app also features a slick dashboard where you can track your verification stats, see trends over time, and dive into recent activity.
          </p>
          <p className="text-gray-200 mb-4">
            Whether you’re dealing with a handful of emails or a stack of PDFs, Sig-Check has got your back. It logs all verification results, quarantines failed files, and gives you a clear view of what’s legit and what’s not. The goal? To keep your digital communication secure and trustworthy, without the headache.
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-200">
            <li className="mb-2">S/MIME, DKIM, and SPF verification for emails</li>
            <li className="mb-2">PDF signature verification</li>
            <li className="mb-2">Real-time dashboard with stats and trends</li>
            <li className="mb-2">Quarantine for failed files</li>
            <li className="mb-2">MongoDB-backed logging</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">How It Works</h2>
          <p className="text-gray-200 mb-4">
            Sig-Check monitors a designated folder for email files (`.eml`) and lets you upload PDFs directly. When you hit "Start Scan" on the dashboard, it processes each email, checking for S/MIME signatures first (partial detection for now), then falling back to DKIM and SPF checks. PDFs are verified for signatures, with results logged in real-time.
          </p>
          <p className="text-gray-200">
            All verification results are stored in a MongoDB database and displayed on the dashboard. Failed files are sent to a quarantine endpoint, keeping your workflow clean and secure.
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Tech Stack</h2>
          <p className="text-gray-200 mb-2">
            <span className="font-semibold">Frontend:</span> React, Tailwind CSS, Chart.js
          </p>
          <p className="text-gray-200 mb-2">
            <span className="font-semibold">Backend:</span> Flask, Python, MongoDB
          </p>
          <p className="text-gray-200">
            <span className="font-semibold">Libraries:</span> pyOpenSSL, Watchdog, Requests
          </p>
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-400">
        <p>Created by Nek0</p>
        <p className="mt-1">May 2025</p>
      </footer>
    </div>
  );
}

export default About;