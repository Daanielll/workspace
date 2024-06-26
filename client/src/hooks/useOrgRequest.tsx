import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useOrgRequest() {
  const { mutateAsync } = useMutation({
    mutationFn: async (orgId: number) => {
      const response = await axios.post(
        "http://localhost:3000/orgs/request",
        { orgId },
        {
          withCredentials: true,
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });
  return mutateAsync;
}
