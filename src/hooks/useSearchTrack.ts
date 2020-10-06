import { useQuery } from "react-query"
import useGetAccessToken from "./useGetAccessToken"
import { SearchTracksResponse } from "../pages/api/search"

const BASE_URL = `https://api.spotify.com/v1`

// Calls spotify directly to speed up search responsiveness.
const useSearchTrack = (q: string) => {
  const accessToken = useGetAccessToken()
  const searchTrack = async (): Promise<SearchTracksResponse> => {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${accessToken.data?.accessToken}`)

    const result = await fetch(`${BASE_URL}/search?type=track&q=${q}`, {
      credentials: "same-origin",
      headers,
    })

    const json = await result.json()
    if (!result.ok) {
      throw Error(json.error)
    }

    // Parse json
    return json
  }

  return useQuery(["search", q], searchTrack, {
    enabled: q && accessToken.data?.accessToken,
  })
}

export default useSearchTrack
