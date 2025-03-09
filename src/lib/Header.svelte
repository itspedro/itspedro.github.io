<script>
    import GitHub from "./icons/GitHub.svelte";

    import LinkedIn from "./icons/LinkedIn.svelte";
</script>

<header
    class="flex flex-row items-center justify-between w-11/12 md:w-1/2 mx-auto px-4 py-7 border-b border-b-white"
>
    <a href="/">
        <p class="font-bold hover:opacity-50">@itspedro</p>
        <span class="font-thin text-gray-300"> dev </span>
    </a>

    <iframe
        title="my age"
        src="https://itspedro.github.io/age"
        width="50%"
        height="50"
        class="mx-auto"
    ></iframe>

    <nav class="flex flex-row gap-5">
        <a
            class="hover:opacity-50"
            href="https://linkedin.com/in/itspedro"
            target="_blank"
        >
            <LinkedIn />
        </a>
        <a
            class="hover:opacity-50"
            href="https://github.com/itspedro"
            target="_blank"
        >
            <GitHub />
        </a>
    </nav>
</header>
