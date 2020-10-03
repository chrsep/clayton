import { useQuery } from "react-query"
import { getApi } from "../apiHelpers"

const useSearchTrack = (q: string) => {
  const searchTrack = getApi<{}>(`/search?type=track&q=${q}`)

  return useQuery(["search", q], searchTrack, { enabled: q })
}

export default useSearchTrack
