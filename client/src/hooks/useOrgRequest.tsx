import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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
    onSuccess: () => {
      toast.success("A request to join the organization has been sent");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(
          error.response?.data.error || "An unknown error has occurred",
          { richColors: true }
        );
      }
    },
  });
  return mutateAsync;
}
