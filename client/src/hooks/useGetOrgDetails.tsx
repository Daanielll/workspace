import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetOrgDetails(orgId: number) {
  return useQuery({
    queryKey: ["userOrg", orgId],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/orgs/${orgId}`, {
        withCredentials: true,
      });
      return data;
    },
  });
}
