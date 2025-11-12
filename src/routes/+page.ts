import type { PageLoad } from "./$types";
import introMarkdown from "$lib/content/home.md?raw";
import { marked } from "marked";

type GitHubFile = {
    name: string;
    path: string;
    type: string;
    download_url: string | null;
};

const NOTES_CONTENT_URL = "https://api.github.com/repos/itspedro-lab/Notes/contents";
const MARKDOWN_PATTERN = /\.(md|mdx)$/i;

const formatTitle = (filename: string) =>
    filename
        .replace(MARKDOWN_PATTERN, "")
        .split(/[-_]/)
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" ");

export const load: PageLoad = async ({ fetch }) => {
    try {
        const response = await fetch(NOTES_CONTENT_URL, {
            headers: {
                Accept: "application/vnd.github+json"
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch Notes repository contents", response.status);
            return { articles: [] };
        }

        const files = (await response.json()) as GitHubFile[];

        const articles = files
            .filter((file) => file.type === "file" && MARKDOWN_PATTERN.test(file.name))
            .map((file) => ({
                title: formatTitle(file.name),
                slug: file.name.replace(MARKDOWN_PATTERN, ""),
                download_url: file.download_url,
                path: file.path
            }))
            .filter((article) => Boolean(article.download_url));

        const introHtml = await marked.parse(introMarkdown);

        return { articles, introHtml };
    } catch (error) {
        console.error("Unexpected error while loading Notes articles", error);
        return { articles: [] };
    }
};
