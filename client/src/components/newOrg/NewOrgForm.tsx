import { motion } from "framer-motion";
export function NewOrgForm() {
  const invitations = [
    {
      id: 1,
      orgName: "Yotaniel",
      invitedBy: "Daniel Moshe",
    },
    {
      id: 2,
      orgName: "Yotaniel",
      invitedBy: "Daniel Moshe",
    },
    {
      id: 3,
      orgName: "Yotaniel",
      invitedBy: "Daniel Moshe",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: "-100vh", x: "-50%" }}
      animate={{ opacity: 1, y: "-50%", x: "-50%" }}
      exit={{ opacity: 0, y: "100vh", x: "-50%" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="w-[clamp(500px,33%,800px)] flex flex-col text-washed-blue p-4 gap-4 bg-lighter-dark border-2 border-primary-grey border-opacity-20 rounded-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <h1 className="text-lg font-semibold">Add An Organization</h1>
      <div className="h-[2px] -mx-4 bg-primary-grey opacity-20"></div>
      <form className="flex gap-2 items-end text-sm" action="">
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="orgName">Organization's Name</label>
          <input
            type="text"
            name="orgName"
            id=""
            placeholder="Enter organization name..."
            className="bg-primary-grey bg-opacity-20 p-2 px-3 rounded-md"
          />
        </div>
        <button
          className="p-2 px-4 h-fit bg-primary-blue rounded-md"
          type="submit"
        >
          Create New
        </button>
      </form>
      <h5 className="mt-2 text-sm">Or Join An Existing One</h5>
      <div className="border border-primary-grey border-opacity-20 rounded-lg mx-2 -mt-2 p-3">
        <form className="flex gap-2 items-end text-sm " action="">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="orgName">Add With Organization ID</label>
            <input
              type="text"
              name="orgName"
              id=""
              placeholder="Enter organization ID..."
              className="bg-primary-grey bg-opacity-20 p-2 px-3 rounded-md outline-none"
            />
          </div>
          <button
            className="p-2 px-6 h-fit border box-border border-washed-blue rounded-md"
            type="submit"
          >
            Add
          </button>
        </form>
        <h5 className="mt-4 mb-2 text-sm">Pending Invitations</h5>
        <div className="flex flex-col gap-2 max-h-[18.5rem] overflow-auto custom-scrollbar">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="flex justify-between items-center bg-primary-grey bg-opacity-20 rounded-md p-2 px-4"
            >
              <div>
                <h1 className="font-medium">{inv.orgName}</h1>
                <h2 className="text-washed-blue-700">
                  Invited by {inv.invitedBy}
                </h2>
              </div>

              <button className="p-2 px-6 h-fit border box-border border-washed-blue rounded-md text-sm">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
