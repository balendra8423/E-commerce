// src/components/auth/layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

// Floating emoji component
const FloatingEmoji = ({ emoji, top, left, delay = 0 }) => (
  <motion.div
    className="absolute text-5xl select-none opacity-80"
    style={{ top, left }}
    initial={{ y: 600, scale: 0.8 }}
    animate={{ y: -200, scale: 1.1 }}
    transition={{
      duration: 12,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

function AuthLayout() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Floating Emojis */}
      <FloatingEmoji emoji="👕" top="90%" left="10%" delay={0} />
      <FloatingEmoji emoji="👜" top="95%" left="30%" delay={2} />
      <FloatingEmoji emoji="👟" top="92%" left="50%" delay={4} />
      <FloatingEmoji emoji="🪑" top="94%" left="70%" delay={1} />
      <FloatingEmoji emoji="📱" top="96%" left="85%" delay={3} />
      <FloatingEmoji emoji="🧴" top="91%" left="20%" delay={5} />

      {/* Top: Welcome Text */}
      <div className="flex justify-center w-full max-w-4xl px-6 py-12 text-center text-white bg-black bg-opacity-70">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to ECommerce Shopping</h1>
          <p className="text-lg text-white/80">
            Discover fashion, electronics, household items, and more.
          </p>
        </div>
      </div>

      {/* Bottom: Auth Form */}
      <div className="flex items-center justify-center w-full px-4 py-12 bg-black bg-opacity-70 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl bg-opacity-95">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
