import { useParams } from "react-router-dom";
import { useGetOrgDetails } from "../../hooks/useGetOrgDetails";
import { UseChangeOrgName } from "../../hooks/useChangeOrgName";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useSearchForUser } from "../../hooks/useSearchForUser";
import { useQuery } from "@tanstack/react-query";
import { useInviteUser } from "../../hooks/useOrgInvite";

interface User {
  id?: number;
  username: string;
  email: string;
  color: string;
  onClick?: (id: number | undefined) => void;
}
/**
 * Overview component for managing organization's profile and inviting new users.
 * @returns JSX.Element
 */
export function Overview() {
  // Destructure orgId from useParams
  const { orgId } = useParams();

  // Fetch organization details using useGetOrgDetails
  const orgDetails = useGetOrgDetails(Number(orgId));

  // Create a function to change organization name using UseChangeOrgName
  const changeOrgName = UseChangeOrgName(Number(orgId));

  // State variables for managing edit functionality
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [orgName, setOrgName] = useState("");

  // Function to invite new users using useInviteUser
  const inviteUser = useInviteUser(Number(orgId));

  // State variables for user search
  const [searchUsers, setSearchUsers] = useState("");
  const [searchId, setSearchId] = useState("");

  // Apply debounce to search inputs
  const debouncedUsers = useDebounce(searchUsers);
  const debouncedId = Number(useDebounce(searchId));

  // Query hooks for fetching users based on search input
  const searchedUsers = useQuery<User[]>({
    queryKey: ["searchForUser", debouncedUsers],
    queryFn: () => useSearchForUser(debouncedUsers),
    enabled: !!debouncedUsers && debouncedUsers != "",
  });

  const searchedId = useQuery<User>({
    queryKey: ["searchForID", debouncedId],
    queryFn: () => useSearchForUser(null, debouncedId),
    enabled: debouncedId > 0,
  });

  // Show loading state while fetching organization details
  if (orgDetails.isLoading) return <h1>Loading</h1>;

  /**
   * Handle name change functionality.
   */
  const handleNameChange = () => {
    if (!isEditEnabled) {
      setIsEditEnabled(true);
      setOrgName(orgDetails.data.org.name);
    } else {
      if (orgDetails.data.org.name !== orgName.trim())
        changeOrgName(orgName.trim());
      setIsEditEnabled(false);
    }
  };

  return (
    <div className="border-2 border-dark-accent p-4 rounded-lg bg-lighter-dark h-full">
      {/* Organization's profile section */}
      <div className="pb-4">
        <h1 className="text-lg font-medium">Overview</h1>
        <h2 className="text-washed-blue-700 font-medium">
          Manage your organization's profile, and invite new users to the
          organization
        </h2>
      </div>
      <div className="-mx-4 bg-dark-accent h-[2px]"></div>
      <div className="flex justify-between mt-8 items-start w-2/5 h-[3.5rem]">
        {/* Organization's name section */}
        {!isEditEnabled && (
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold">Organization's Name</h1>
            <h2 className="font-medium text-washed-blue-700">
              {orgDetails.data.org.name}
            </h2>
          </div>
        )}
        {/* Editable organization's name section */}
        {isEditEnabled && (
          <input
            type="text"
            className="bg-dark-accent p-2 px-3 rounded-md outline-none w-3/5"
            onChange={(e) => setOrgName(e.target.value)}
            value={orgName}
          />
        )}
        {/* Button to enable/disable edit mode */}
        <button
          onClick={handleNameChange}
          className={`${
            isEditEnabled
              ? "border-primary-blue text-primary-blue"
              : "border-washed-blue text-washed-blue"
          }  px-6 py-2 h-fit border rounded-lg`}
        >
          {isEditEnabled ? "Done" : "Edit"}
        </button>
      </div>
      <div className="flex w-2/5 justify-between my-4">
        {/* Organization's ID section */}
        <h1 className="font-semibold">Organization's ID</h1>
        <h2 className="font-medium text-washed-blue-700">
          {orgDetails.data.org.id}
        </h2>
      </div>
      {/* Invite new users section */}
      <div className="border-t-2 border-dark-accent py-2">
        <h1 className="py-2 font-semibold text-washed-blue-700">
          INVITE NEW USERS
        </h1>
        <div className="flex items-start gap-4 w-full">
          {/* Search by email section */}
          <div className="w-1/4 flex flex-col">
            <input
              className={`search-input w-full ${
                searchedUsers.data ? "rounded-t-md" : "rounded-md"
              }`}
              type="text"
              placeholder="Search with user's email"
              onChange={(e) => setSearchUsers(e.target.value)}
              value={searchUsers}
            />
            {searchedUsers.data && (
              <ul className="bg-dark-buttons border border-primary-grey rounded-md border-t-0 rounded-t-none py-2 overflow-auto">
                {searchedUsers.data.map((user: User) => (
                  <UserCard key={user.email} {...user} onClick={inviteUser} />
                ))}
              </ul>
            )}
          </div>
          {/* Search by ID section */}
          <h1 className="font-medium text-washed-blue-700 mt-[0.5rem]">OR</h1>
          <div className="w-1/4">
            <input
              className={`search-input w-full ${
                searchedId.data ? "rounded-t-md" : "rounded-md"
              }`}
              type="text"
              placeholder="Enter user's ID"
              onChange={(e) => setSearchId(e.target.value)}
              value={searchId}
            />
            {searchedId.data && (
              <ul className="bg-dark-buttons border border-primary-grey rounded-md border-t-0 rounded-t-none py-2">
                <UserCard
                  onClick={inviteUser}
                  username={searchedId.data.username}
                  id={searchedId.data.id}
                  email={searchedId.data.email}
                  color={searchedId.data.color}
                />
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserCard({ id, username, email, color, onClick }: User) {
  return (
    <li
      onClick={() => onClick && onClick(id)}
      className="flex gap-3 items-center hover:bg-dark-accent px-3 py-2 cursor-pointer"
    >
      <div
        style={{ backgroundColor: color }}
        className="size-10 rounded-full"
      ></div>
      <div>
        <h1 className="font-medium">{username}</h1>
        <h2 className="text-sm text-washed-blue-700">{email}</h2>
      </div>
    </li>
  );
}
