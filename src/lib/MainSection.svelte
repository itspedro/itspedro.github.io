<script lang="ts">
    import { browser } from "$app/environment";
    import { marked } from "marked";
    import { load as parseYaml } from "js-yaml";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    type Article = {
        title: string;
        slug: string;
        download_url: string;
        path: string;
    };

    type ArticleMeta = {
        title?: string;
        date?: string;
        description?: string;
        lang?: string;
        tags?: string[];
    };

    let { articles = [] as Article[], introHtml = "" } = $props();
    let activeSlug = $state<string | null>(null);
    let renderedHtml = $state("");
    let isLoading = $state(false);
    let errorMessage = $state("");
    let currentRequest = $state(0);
    let activeMeta = $state<ArticleMeta | null>(null);

    const FRONT_MATTER_PATTERN = /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*(?:[\r\n]+|$)/;

    const hasArticles = () => articles.length > 0;
    const activeArticle = $derived(activeSlug ? articles.find((article) => article.slug === activeSlug) ?? null : null);

    const formatDate = (value?: string) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: value.includes(":") ? "short" : undefined
        }).format(date);
    };

    const toMeta = (data: Record<string, unknown> | undefined): ArticleMeta | null => {
        if (!data) {
            return null;
        }
        const meta: ArticleMeta = {};
        if (typeof data.title === "string") meta.title = data.title;
        if (typeof data.date === "string") meta.date = data.date;
        if (typeof data.description === "string") meta.description = data.description;
        if (typeof data.lang === "string") meta.lang = data.lang;
        if (Array.isArray(data.tags)) {
            meta.tags = data.tags.map((tag) => String(tag)).filter(Boolean);
        }
        return Object.keys(meta).length ? meta : null;
    };

    const parseFrontMatter = (markdown: string) => {
        if (!markdown.trimStart().startsWith("---")) {
            return { content: markdown, data: undefined };
        }

        const match = markdown.match(FRONT_MATTER_PATTERN);
        if (!match) {
            return { content: markdown, data: undefined };
        }

        const [fullMatch, rawFrontMatter] = match;
        const content = markdown.slice(fullMatch.length);

        try {
            const data = parseYaml(rawFrontMatter);
            return {
                content: content?.trimStart() ?? "",
                data: typeof data === "object" && data ? (data as Record<string, unknown>) : undefined
            };
        } catch (error) {
            console.error("Could not parse front matter", error);
            return { content: markdown, data: undefined };
        }
    };

    async function selectArticle(article: Article) {
        if (!browser || !article?.download_url) {
            return;
        }

        currentRequest += 1;
        const requestId = currentRequest;

        isLoading = true;
        errorMessage = "";
        activeSlug = article.slug;
        activeMeta = null;

        try {
            const response = await fetch(article.download_url);
            if (!response.ok) {
                throw new Error("Unable to fetch the selected article.");
            }

            const markdown = await response.text();
            const parsed = parseFrontMatter(markdown);
            const html = await marked.parse(parsed.content || markdown);
            const meta = toMeta(parsed.data);

            if (requestId !== currentRequest) {
                return;
            }

            renderedHtml = html;
            activeMeta = meta;
        } catch (error) {
            errorMessage =
                error instanceof Error ? error.message : "An unexpected error occurred while loading.";
        } finally {
            if (requestId === currentRequest) {
                isLoading = false;
            }
        }
    }

    onMount(() => {
        if (articles.length) {
            selectArticle(articles[0]);
        }
    });

    $effect(() => {
        if (browser && articles.length && !activeSlug && !isLoading) {
            selectArticle(articles[0]);
        }
    });

    $effect(() => {
        if (activeSlug && !articles.some((article) => article.slug === activeSlug)) {
            activeSlug = null;
            renderedHtml = "";
            activeMeta = null;
        }
    });
</script>

<section class="w-11/12 md:w-4/5 mx-auto mt-10 flex flex-col gap-8">
    {#if introHtml}
        <article class="prose prose-sm md:prose-base prose-invert md:max-w-4/5 mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10">
            {@html introHtml}
        </article>
    {/if}

    <section class="flex flex-col gap-6">
        <header class="text-center space-y-3">
            <p class="text-sm uppercase tracking-[0.3em] text-neutral-400">
                Notes
            </p>
            <h2 class="text-2xl md:text-3xl font-semibold">
                Personal notes
            </h2>
        </header>

        <div class="flex flex-col md:flex-row gap-6">
            <aside
                class="md:w-64 shrink-0 border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-sm space-y-4"
            >
                <div>
                    <h3 class="text-lg font-semibold">List</h3>
                </div>

                {#if hasArticles()}
                    <ul class="space-y-2">
                        {#each articles as article}
                            <li>
                                <button
                                    class={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                        activeSlug === article.slug
                                            ? "bg-white/90 text-black font-semibold"
                                            : "bg-white/10 hover:bg-white/20 text-white"
                                    }`}
                                    onclick={() => selectArticle(article)}
                                    aria-current={activeSlug === article.slug}
                                >
                                    {article.title}
                                </button>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="text-sm text-neutral-400">No markdown files were found in the repo.</p>
                {/if}
            </aside>

            <div class="flex-1 min-h-[24rem] border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm p-5 overflow-auto space-y-4">
                {#if !hasArticles()}
                    <p class="text-sm text-neutral-400">Add markdown files to the Notes repo to see them here.</p>
                {:else if isLoading}
                    <p class="text-sm text-neutral-300 animate-pulse">Loading article...</p>
                {:else if errorMessage}
                    <p class="text-sm text-red-300">{errorMessage}</p>
                {:else if renderedHtml}
                    {#if activeMeta || activeArticle}
                        <div
                            class="border border-white/10 rounded-lg p-4 bg-white/5 transition-all duration-300"
                            transition:fade|local={{ duration: 200 }}
                        >
                            <div class="flex flex-wrap gap-6 text-sm">
                                <div>
                                    <p class="text-neutral-400 uppercase tracking-[0.2em] text-[0.65rem]">Title</p>
                                    <p class="font-semibold">
                                        {activeMeta?.title ?? activeArticle?.title ?? "Untitled"}
                                    </p>
                                </div>
                                {#if activeMeta?.date}
                                    <div>
                                        <p class="text-neutral-400 uppercase tracking-[0.2em] text-[0.65rem]">Date</p>
                                        <p class="font-semibold">{formatDate(activeMeta.date)}</p>
                                    </div>
                                {/if}
                                {#if activeMeta?.lang}
                                    <div>
                                        <p class="text-neutral-400 uppercase tracking-[0.2em] text-[0.65rem]">Language</p>
                                        <p class="font-semibold uppercase">{activeMeta.lang}</p>
                                    </div>
                                {/if}
                            </div>

                            {#if activeMeta?.description}
                                <p class="mt-4 text-sm text-neutral-200 leading-relaxed">{activeMeta.description}</p>
                            {/if}

                            {#if activeMeta?.tags?.length}
                                <ul class="mt-4 flex flex-wrap gap-2 text-xs">
                                    {#each activeMeta.tags as tag}
                                        <li class="px-2 py-1 rounded-full bg-white/10 border border-white/20 uppercase tracking-[0.2em]">
                                            {tag}
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/if}

                    <article class="prose prose-invert prose-neutral max-w-none" transition:fade|local={{ duration: 200 }}>
                        {@html renderedHtml}
                    </article>
                {:else}
                    <p class="text-sm text-neutral-300">
                        Select an article on the left to display its markdown content.
                    </p>
                {/if}
            </div>
        </div>
    </section>
</section>
