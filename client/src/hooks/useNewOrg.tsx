import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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
      toast.success("Organization has been created successfully", {
        richColors: true,
      });
      await queryClient.invalidateQueries({ queryKey: ["userOrgsAndGroups"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status == 500)
          return toast.error("Internal server error", { richColors: true });
        if (error.response?.status == 400)
          return toast.error("Organization name not specified", {
            richColors: true,
          });
        else
          return toast.error("There was an error creating your organization", {
            richColors: true,
          });
      }
    },
  });
  return mutateAsync;
}
