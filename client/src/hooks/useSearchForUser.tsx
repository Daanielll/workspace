import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface user {
  id: number;
  username: string;
  color: string;
  displayPrefrence: string;
  email: string;
}

// export function useSearchForUser(
//   id: number | null = null,
//   query: string | null = null
// ): UseQueryResult<user[], Error> {
//   const shouldFetch = id != null || query != null;
//   return useQuery({
//     queryKey: ["searchForUser", id, query],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       if (id) params.append("id", id.toString());
//       if (query) params.append("query", query);
//       const { data } = await axios.get("http://localhost:3000/users/search", {
//         params,
//       });
//       return data;
//     },
//     enabled: shouldFetch,
//   });
// }
export const useSearchForUser = async (
  query: string | null = null,
  id: number | null = null
) => {
  const params = new URLSearchParams();
  if (id) params.append("id", id.toString());

  if (query) params.append("query", query);

  const { data } = await axios.get("http://localhost:3000/users/search", {
    params,
  });
  return data;
};
