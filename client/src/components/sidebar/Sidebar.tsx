import logo from "../../assets/workspace_logo.svg";
import { Organizations } from "./Organizations";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { HomeIcon } from "../../assets/HomeIcon";
import { ActivityIcon } from "../../assets/ActivityIcon";
import { ClockIcon } from "../../assets/ClockIcon";
export function Sidebar({ handleOpenForm }) {
  // get user from context
  const { user } = useContext(UserContext);

  return (
    <div className="min-w-72 w-[12%] max-w-96 bg-lighter-dark min-h-screen border-r border-primary-grey border-opacity-20 p-5 py-6 flex flex-col text-washed-blue">
      <img className="self-start h-8" src={logo} alt="" />
      <div className=" h-[1px] bg-primary-grey bg-opacity-20 my-6 -mx-5 "></div>
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-4 child:flex child:gap-3 text-washed-blue child:hover:cursor-pointer child:items-center">
            <button className="hover:text-washed-blue-700">
              <HomeIcon /> Home
            </button>
            <button className="hover:text-washed-blue-700">
              <ActivityIcon /> Activity
            </button>
            <button className="hover:text-washed-blue-700">
              <ClockIcon /> Upcoming
            </button>
          </div>
          <Organizations handleOpenForm={handleOpenForm}></Organizations>
        </div>
        <div className="w-full px-2 py-3 align-self background-gradient border-2 border-white border-opacity-20 flex gap-3 rounded-md items-center justify-start">
          <div
            style={{ backgroundColor: user?.color }}
            className={`bg-black h-full aspect-square rounded-full`}
          ></div>
          <div>
            <h1 className="font-medium mb-1">{user?.username}</h1>
            <h2 className="text-xs text-primary-grey">{user?.email}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
