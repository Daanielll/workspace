import { motion } from "framer-motion";
import useNewOrg from "../../hooks/useNewOrg";
import { useState } from "react";
import x_icon from "../../assets/x_icon.svg";
import { Backdrop } from "./Backdrop";
import useOrgRequest from "../../hooks/useOrgRequest";
import { useOrgsInvite, useInviteResponse } from "../../hooks/useOrgInvite";

type Props = {
  handleClose: () => void;
};

export function NewOrgForm({ handleClose }: Props) {
  const newOrg = useNewOrg();
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState("");
  const createRequest = useOrgRequest();
  const inviteResponse = useInviteResponse();
  const userInvites = useOrgsInvite();
  userInvites.isFetched
    ? console.log(userInvites.data)
    : console.log("Fetching user invites");

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        initial={{ opacity: 0, y: "-10%", x: "-50%" }}
        animate={{ opacity: 1, y: "-50%", x: "-50%" }}
        exit={{ opacity: 0, y: "10%", x: "-50%" }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="w-[clamp(500px,33%,800px)] flex flex-col text-washed-blue p-4 gap-4 bg-lighter-dark border-2 border-dark-accent rounded-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg font-semibold flex justify-between items-center">
          Add An Organization
          <img
            className="cursor-pointer"
            onClick={handleClose}
            src={x_icon}
            alt=""
          />
        </h1>
        <div className="h-[2px] -mx-4 bg-primary-grey opacity-20"></div>
        <form
          className="flex gap-2 items-end text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            newOrg(orgName);
            setOrgName("");
            handleClose();
          }}
        >
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="orgName">Organization's name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              name="orgName"
              id=""
              placeholder="Enter organization name..."
              className="bg-dark-accent p-2 px-3 rounded-md outline-none"
            />
          </div>
          <button
            className="p-2 px-4 h-fit bg-primary-blue rounded-md"
            type="submit"
          >
            Create New
          </button>
        </form>
        <h5 className="mt-2 text-sm">Or join an existing one</h5>
        <div className="border border-primary-grey border-opacity-20 rounded-lg mx-2 -mt-2 p-3">
          <form
            className="flex gap-2 items-end text-sm "
            onSubmit={(e) => {
              e.preventDefault();
              if (Number(orgId) > 0) {
                createRequest(Number(orgId));
                setOrgId("");
              }
            }}
          >
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="orgName">Add with organization ID</label>
              <input
                type="text"
                name="orgName"
                id=""
                placeholder="Enter organization ID..."
                className="bg-primary-grey bg-opacity-20 p-2 px-3 rounded-md outline-none"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
              />
            </div>
            <button
              className="p-2 px-6 h-fit border box-border border-washed-blue rounded-md"
              type="submit"
            >
              Add
            </button>
          </form>
          <h5 className="mt-4 mb-2 text-sm">Pending invitations</h5>
          <div className="flex flex-col gap-2 max-h-[18.5rem] overflow-auto custom-scrollbar">
            {userInvites.isFetched &&
            userInvites.data &&
            userInvites.data[0] ? (
              userInvites.data?.map((inv) => (
                <div
                  key={inv.org.id}
                  className="flex justify-between items-center bg-primary-grey bg-opacity-20 rounded-md p-2 px-4"
                >
                  <div>
                    <h1 className="font-medium">{inv.org.name}</h1>
                    <h2 className="text-washed-blue-700">
                      Invited by {inv.invitedBy.username}
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      inviteResponse({ orgId: inv.org.id, userResponse: 1 });
                    }}
                    className="p-2 px-6 h-fit border box-border border-washed-blue rounded-md text-sm"
                  >
                    Join
                  </button>
                </div>
              ))
            ) : (
              <h1 className="text-washed-blue-700 text-sm">
                There are no pending invitations
              </h1>
            )}
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
}
