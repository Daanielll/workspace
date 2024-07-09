import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface userInvite {
  invitedBy: { username: string };
  org: { id: number; name: string };
}
type Params = {
  orgId: number;
  userResponse: number;
};
export function useOrgsInvite() {
  return useQuery<userInvite[]>({
    queryKey: ["userInvites"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/users/invites", {
        withCredentials: true,
      });
      return data;
    },
  });
}
export function useInviteResponse() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ orgId, userResponse }: Params) => {
      const response = await axios.post(
        "http://localhost:3000/users/invites",
        { orgId: orgId, response: userResponse },
        {
          withCredentials: true,
        }
      );

      return response.data;
    },
    onSuccess: async () => {
      toast.success("You just joined the organization", { richColors: true });
      await queryClient.invalidateQueries({ queryKey: ["userOrgsAndGroups"] });
      await queryClient.invalidateQueries({ queryKey: ["userInvites"] });
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

export default {
  useInviteResponse,
  useOrgsInvite,
};
