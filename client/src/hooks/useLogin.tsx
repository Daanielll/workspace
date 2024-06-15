import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LoginVars {
  email: string;
  password: string;
}

export default function useLogin() {
  const { mutateAsync } = useMutation({
    mutationFn: async ({ email, password }: LoginVars) => {
      const response = await axios.post("http://localhost:3000/users/login", {
        email: email,
        password: password,
      });
      console.log(response);
      return response.data;
    },
    onSuccess: () => {
      console.log("user logged in");
    },
  });
  return mutateAsync;
}
