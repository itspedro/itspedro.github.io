<script lang="ts">
    import Footer from "$lib/Footer.svelte";
    import Header from "$lib/Header.svelte";
    import GameOfLife from "$lib/Game.svelte";
    import "../app.css";
    let { children } = $props();
</script>

<main
    class="flex flex-col justify-between relative w-full h-svh mx-auto bg-[linear-gradient(to_right,transparent_0%,#000000E6_20%,#000000E6_80%,transparent_100%)] md:bg-[linear-gradient(to_right,transparent_0%,#000000E6_30%,#000000E6_70%,transparent_100%)]"
>
    <div>
        <Header />
        {@render children()}
    </div>
    <Footer />
</main>
<GameOfLife />

<style lang="postcss">
    :global(body) {
        background: #000000;
        color: #f6f6f6;
    }
</style>
