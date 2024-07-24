import { useState } from "react";
import { Overview } from "./Overview";

export function OrgSettings() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = ["Overview", "Teams", "Roles", "Users", "Requests"];
  return (
    <div className="p-8 flex flex-col gap-4 h-screen">
      <h1 className="text-xl font-medium">Organization Settings</h1>
      <ul className="flex p-1 child:px-5 child:py-1 border border-dark-accent rounded-lg w-fit">
        {tabs.map((tab, i) => (
          <ul
            className={`${
              selectedTab == i ? "bg-dark-accent" : ""
            } rounded-[5px]`}
            key={i}
          >
            {tab}
          </ul>
        ))}
      </ul>
      <div className="flex-1">{selectedTab == 0 && <Overview />}</div>
    </div>
  );
}
