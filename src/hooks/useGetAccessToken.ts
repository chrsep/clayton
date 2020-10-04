import { useQuery } from "react-query"
import { getApi } from "../apiHelpers"
import { GetAccessTokenResponse } from "../pages/api/auth/access-token"

const useGetAccessToken = () => {
  const getAccessToken = getApi<GetAccessTokenResponse>(`/auth/access-token`)

  return useQuery(["accessToken"], getAccessToken, {
    refetchOnWindowFocus: false,
  })
}

export default useGetAccessToken
