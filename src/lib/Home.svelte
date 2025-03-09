<script>
    import Footer from "./Footer.svelte";
    import Header from "./Header.svelte";
    import MainSection from "./MainSection.svelte";
</script>

<svelte:head>
    <title>Pedro's playground</title>
    <meta name="description" content="This is where I put my things :p" />
</svelte:head>

<main
    class="flex flex-col justify-between relative w-full h-svh mx-auto bg-[linear-gradient(to_right,transparent_0%,#000000E6_20%,#000000E6_80%,transparent_100%)] md:bg-[linear-gradient(to_right,transparent_0%,#000000E6_30%,#000000E6_70%,transparent_100%)]"
>
    <div>
        <Header />
        <MainSection />
    </div>
    <Footer />
</main>
