<script lang="ts">
    import Home from "$lib/Home.svelte";
    let { data } = $props();
    const articles = data?.articles ?? [];
    const introHtml = data?.introHtml ?? "";
</script>

<Home {articles} {introHtml} />
