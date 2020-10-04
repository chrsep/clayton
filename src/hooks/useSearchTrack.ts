import { useQuery } from "react-query"
import { getApi } from "../apiHelpers"
import { SearchTracksResponse } from "../pages/api/search"

const useSearchTrack = (q: string) => {
  const searchTrack = getApi<SearchTracksResponse>(`/search?type=track&q=${q}`)

  return useQuery(["search", q], searchTrack, { enabled: q })
}

export default useSearchTrack
