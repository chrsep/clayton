import { useQueryString } from "../../../hooks/useQueryString"

const Play = () => {
  const songId = useQueryString("songId")

  return <div>{songId}</div>
}

export default Play
