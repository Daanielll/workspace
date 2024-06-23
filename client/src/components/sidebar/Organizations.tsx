import { useState } from "react";
import useOrgsAndTeams from "../../hooks/useOrgsAndTeams";
import plus_icon from "../../assets/plus_icon.svg";
import { GlobeIcon } from "../../assets/GlobeIcon";
import { SettingsIcon } from "../../assets/SettingsIcon";
import { motion, AnimatePresence } from "framer-motion";
// team interface
interface Team {
  id: number;
  name: string;
}

// org interface
interface Org {
  id: number;
  name: string;
  teams: Team[];
}
export function Organizations() {
  const [selectedOrg, setSelectedOrg] = useState<number | null>();
  const [selectedTeam, setSelectedTeam] = useState<number | null>();
  const orgAndTeams = useOrgsAndTeams();
  let orgs: Org[] = [];

  if (orgAndTeams.isFetched) orgs = orgAndTeams.data;

  if (orgAndTeams.isLoading) return <h1>Loading</h1>;
  return (
    <div className="text-washed-blue">
      <div className="group flex justify-between items-center mb-4 text-sm">
        <h1>Organizations</h1>
        <img
          className="opacity-0 group-hover:opacity-100 cursor-pointer p-1"
          src={plus_icon}
          alt="Plus icon"
        />
      </div>

      <div className="flex flex-col gap-4">
        {orgs.map((org) => {
          const isOpen = selectedOrg === org.id;
          const dynamicHeight = isOpen
            ? 1.25 + (org.teams ? org.teams.length * 2.25 : 0)
            : 0;

          return (
            <div
              className="flex flex-col gap-4 child:cursor-pointer overflow-hidden"
              key={org.id}
            >
              <button
                onClick={() => setSelectedOrg(isOpen ? null : org.id)}
                className="flex gap-3 items-center hover:text-washed-blue-700 duration-200"
              >
                <GlobeIcon />
                {org.name}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${dynamicHeight}rem` }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.15, ease: "linear" }}
                    className="flex flex-col gap-3 child:pl-6 border-l border-washed-blue ml-[10px] items-start"
                  >
                    {org.teams?.map((team) => (
                      <button
                        className={`${
                          selectedTeam === team.id ? "text-primary-blue" : ""
                        } hover:text-washed-blue-700`}
                        onClick={() => setSelectedTeam(team.id)}
                        key={team.id}
                      >
                        {team.name}
                      </button>
                    ))}
                    <button className="text-washed-blue-700 text-sm flex gap-1 relative rounded-edge hover:text-washed-blue-800 items-center">
                      <SettingsIcon />
                      Organization Settings
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
