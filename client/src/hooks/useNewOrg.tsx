import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useNewOrg() {
  const { mutateAsync } = useMutation({
    mutationFn: async (orgName: string) => {
      const response = await axios.post(
        "http://localhost:3000/orgs",
        { orgName },
        {
          withCredentials: true,
        }
      );

      return response.data;
    },
  });
  return mutateAsync;
}
