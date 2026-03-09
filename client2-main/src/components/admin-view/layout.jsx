import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";
// You imported App.css, ensure it only contains global styles
// and NOT the gradient animation keyframes/classes, as those are now in tailwind.config.js
import "../../App.css";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    // Apply the same gradient background and animation classes here
    // as you did in AuthLayout.jsx and ShoppingLayout.jsx
    <div
      className="flex w-full min-h-screen overflow-hidden bg-gradient-to-br from-background via-accent to-secondary animate-gradient-flow" // Added overflow-hidden for consistency
    >
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-col flex-1">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex flex-col flex-1 p-4 bg-muted/40 md:p-6">
          {/*
            Note: The 'bg-muted/40' on the main content area will
            partially obscure the gradient. If you want the gradient
            to be fully visible behind the main content, you might
            consider removing 'bg-muted/40' or changing it to a transparent
            background if that's desired for your admin panel.
            For now, I'm leaving it as is, but be aware of its effect.
          */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
