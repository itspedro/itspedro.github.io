<script>
    import GitHub from "./icons/GitHub.svelte";

    import LinkedIn from "./icons/LinkedIn.svelte";
</script>

<header
    class="flex flex-row items-center justify-between w-11/12 mx-auto px-4 py-7"
>
    <a href="/">
        <p class="font-bold hover:opacity-50">:p</p>
    </a>

    <a
        href="https://itspedro.github.io/age/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="My age"
    >
        <iframe
            title="my age"
            src="https://itspedro.github.io/age/age-badge.svg"
            width="50%"
            height="30"
            class="mx-auto"
        ></iframe>
    </a>

    <nav class="flex flex-row gap-5">
        <a
            class="hover:opacity-50"
            href="https://linkedin.com/in/itspedro"
            target="_blank"
            rel="noopener noreferrer"
        >
            <LinkedIn />
        </a>
        <a
            class="hover:opacity-50"
            href="https://github.com/itspedro"
            target="_blank"
            rel="noopener noreferrer"
        >
            <GitHub />
        </a>
    </nav>
</header>
