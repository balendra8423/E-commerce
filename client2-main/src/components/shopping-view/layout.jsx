import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import '../../App.css'

function ShoppingLayout() {
  return (
  
    <div
      className="flex flex-col w-full min-h-screen overflow-hidden bg-gradient-to-br from-background via-accent to-secondary animate-gradient-flow" // Added overflow-hidden to prevent scrollbars from background animation
    >
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
