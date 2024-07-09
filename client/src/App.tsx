import { useState } from "react";
import { NewOrgForm } from "./components/newOrg/NewOrgForm";
import { Sidebar } from "./components/sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
function App() {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="bg-dark flex">
      <Toaster />
      <Sidebar handleOpenForm={() => setFormOpen(true)}></Sidebar>
      <div className={"flex-1 relative"}>
        <AnimatePresence>
          {formOpen && <NewOrgForm handleClose={() => setFormOpen(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
