import { Outlet } from "react-router-dom";
import LandingNavbar from "../Navigation/LandingNavbar";

const LandingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer can go here later */}
    </div>
  );
};

export default LandingLayout;
