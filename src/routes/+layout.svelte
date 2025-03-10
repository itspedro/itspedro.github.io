<script lang="ts">
    import "../app.css";
    let { children } = $props();
</script>

{@render children()}

<style lang="postcss">
    :global(body) {
        background: #000000;
        color: #f6f6f6;
    }
</style>
