<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"

  export const load: Load = async ({ params, fetch }) => {
    const test = await process.env.KV_STORE.get("test")

    return {
      props: {
        test,
      },
    }
  }

</script>

<script lang="ts">
  export let test = "asd";
</script>

<h1>Welcome to {test}</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
