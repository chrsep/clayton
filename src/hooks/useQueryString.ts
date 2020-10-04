import { useRouter } from "next/router"

export const useQueryString = (key: string) => {
  const router = useRouter()
  const result = router.query[key]

  if (Array.isArray(result)) {
    return result[0]
  }
  return result
}

export default useQueryString
