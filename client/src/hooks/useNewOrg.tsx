import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useNewOrg() {
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userOrgsAndGroups"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return mutateAsync;
}
