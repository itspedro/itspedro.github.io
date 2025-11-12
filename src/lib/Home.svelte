<script lang="ts">
    import MainSection from "./MainSection.svelte";
    let { articles = [], introHtml = "" } = $props();
</script>

<svelte:head>
    <title>Pedro's playground</title>
    <meta name="description" content="This is where I put my things :p" />
</svelte:head>

<MainSection {articles} {introHtml} />
