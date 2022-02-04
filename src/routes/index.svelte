<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit"

  export const load: Load = async ({ params, fetch }) => {
    const response = await fetch("/api/test.json")

    return {
      props: {
        test: await response.json(),
      },
    }
  }
</script>

<script lang="ts">
  export let test
</script>

<h1>Welcome to {test.test}</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
