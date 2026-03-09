// src/pages/NotFound.jsx

import React from "react";
// Import Link from react-router-dom if you plan to use the "Go to Homepage" button.
// If you are not using react-router-dom, you can remove this import
// and use a standard <a> tag or a regular button with window.location.href.
// For a typical React application with routing, react-router-dom's Link is recommended.
// import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 sm:p-8 md:p-12 lg:p-16"
    >
      <div className="mb-8">
        {/* The prominent "404" text with animation and styling */}
        <h1
          className="
            text-7xl font-extrabold text-blue-600 dark:text-blue-400
            sm:text-8xl md:text-9xl lg:text-[10rem] // Responsive font sizes
            leading-none mb-4 animate-wiggle-404 // Applies the wiggle animation from tailwind.config.js
            drop-shadow-lg // Adds a subtle shadow for depth
          "
        >
          404
        </h1>
        {/* The "Page Not Found" subheading */}
        <p
          className="text-2xl font-semibold text-gray-700  dark:text-gray-300 sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Page Not Found
        </p>
      </div>

      {/* Descriptive paragraph for the user */}
      <p className="max-w-lg mx-auto text-base text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Optional: "Go to Homepage" button for user navigation */}
      {/*
         To enable this button:
         1. Uncomment the `import { Link } from "react-router-dom";` line at the top.
         2. Uncomment the <Link> component block below.
         3. Ensure you have React Router set up in your application.
      */}
      {/*
      <Link to="/"
        className="px-6 py-3 mt-8 text-lg font-medium text-white transition-colors duration-200 bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-lg">
        Go to Homepage
      </Link>
      */}
    </div>
  );
}

export default NotFound;
