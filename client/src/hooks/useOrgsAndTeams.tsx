import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useOrgsAndTeams() {
  return useQuery({
    queryKey: ["userOrgsAndGroups"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/orgs", {
        withCredentials: true,
      });
      return data;
    },
  });
}
