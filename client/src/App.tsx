import { useState } from "react";
import { NewOrgForm } from "./components/newOrg/NewOrgForm";
import { Sidebar } from "./components/sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
function App() {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="bg-dark flex">
      <Toaster />
      <Sidebar handleOpenForm={() => setFormOpen(true)}></Sidebar>
      <div className="flex-1 relative max-w-[2000px] mx-auto">
        <Outlet />
        <AnimatePresence>
          {formOpen && <NewOrgForm handleClose={() => setFormOpen(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
