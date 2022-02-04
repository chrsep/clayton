import type { RequestHandler } from "@sveltejs/kit"

export const get: RequestHandler = async () => {
  const test = await process.env.KV_STORE.get("test")

  return {
    status: 200,
    body: {
      test,
    },
  }
}
