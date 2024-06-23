import { NewOrgForm } from "./components/newOrg/NewOrgForm";
import { Sidebar } from "./components/sidebar/Sidebar";
import { UserContextProvider } from "./context/userContext";
function App() {
  return (
    <UserContextProvider>
      <div className="bg-dark flex">
        <Sidebar></Sidebar>
        <div className="flex-1 relative">
          <NewOrgForm />
        </div>
      </div>
    </UserContextProvider>
  );
}

export default App;
