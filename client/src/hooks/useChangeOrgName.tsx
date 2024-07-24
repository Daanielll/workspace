import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

type userOrgData = {
  org: { id: number; name: string };
};
type UserOrgsAndGroupsData = {
  id: number;
  name: string;
  teams: { id: number; name: string }[];
};

export function UseChangeOrgName(orgId: number) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (name: string) => {
      const response = axios.patch(
        `http://localhost:3000/orgs/${orgId}`,
        { newOrgName: name },
        { withCredentials: true }
      );
      return response;
    },
    onSuccess: (data, variables) => {
      const newOrgName = variables;
      queryClient.setQueryData(["userOrg", orgId], (oldData: userOrgData) => {
        if (oldData) {
          return {
            ...oldData,
            org: {
              ...oldData.org,
              name: newOrgName,
            },
          };
        }
        return oldData;
      });
      queryClient.setQueryData(
        ["userOrgsAndGroups"],
        (oldData: UserOrgsAndGroupsData[]) => {
          if (oldData) {
            // Find the index of the organization you want to update
            const index = oldData.findIndex((org) => org.id === orgId);

            // If the organization is found, update its name
            if (index !== -1) {
              const updatedOrgs = [...oldData];
              updatedOrgs[index] = { ...updatedOrgs[index], name: newOrgName };
              return updatedOrgs;
            }
          }
          return oldData;
        }
      );
      toast.success("Organization was updated successfully", {
        richColors: true,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        toast.error(
          error.response?.data.error || "An unknown error has occurred",
          { richColors: true }
        );
    },
  });
  return mutateAsync;
}
