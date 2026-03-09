// src/pages/UnauthPage.jsx

import React from "react";

function UnauthPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-red-800 bg-red-50 dark:bg-gray-900 dark:text-red-300 sm:p-8 md:p-12 lg:p-16"
    >
      {/* Animation Element: A pulsating red circle with a white 'X' */}
      <div
        className="
          relative w-32 h-32 mb-8 rounded-full flex items-center justify-center
          bg-red-500 border-4 border-red-700
          sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56
          animate-denied-pulse // This class applies the pulse animation from tailwind.config.js
          overflow-hidden // Ensures the 'X' elements stay within the circle
        "
      >
        {/* First bar of the 'X' */}
        <span
          className="absolute w-24 h-2 transform rotate-45 bg-white rounded-full sm:h-3 sm:w-32 md:h-4 md:w-40 lg:h-5 lg:w-48"
        ></span>
        {/* Second bar of the 'X' */}
        <span
          className="absolute w-24 h-2 transform -rotate-45 bg-white rounded-full sm:h-3 sm:w-32 md:h-4 md:w-40 lg:h-5 lg:w-48"
        ></span>
      </div>

      <h1 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
        You don't have access to view this page
      </h1>

      <p className="max-w-lg mx-auto text-base text-gray-600 sm:text-lg md:text-xl dark:text-gray-400">
        It looks like you don't have the necessary permissions to view this
        content. Please contact your administrator or log in with an authorized
        account.
      </p>

      {/* Optional: Add a button to go back or to login */}
      {/*
      <button className="px-6 py-3 mt-8 text-lg text-white transition-colors duration-200 bg-red-600 rounded-md shadow-md hover:bg-red-700 sm:px-8 sm:py-4 sm:text-xl hover:shadow-lg">
        Go to Login
      </button>
      */}
    </div>
  );
}

export default UnauthPage;
