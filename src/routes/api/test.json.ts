import type { RequestHandler } from "@sveltejs/kit"

export const get: RequestHandler = async ({ platform: { env } }) => {
  const test = await env.KV_STORE.get("test")

  return {
    status: 200,
    body: {
      test,
    },
  }
}
