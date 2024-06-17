import logo from "../../assets/workspace_logo.svg";
export function Sidebar() {
  return (
    <div className="min-w-64 w-[13%] max-w-96 bg-lighter-dark h-screen border-r border-primary-grey border-opacity-20 p-4 py-6">
      <img src={logo} alt="" />
    </div>
  );
}
