<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // Grid configuration
    let cols: number = 100; // Default value before browser
    let rows: number = 60; // Default value before browser
    let cellSize: number = 15;
    let grid: boolean[][] = [];
    let nextGrid: boolean[][] = [];
    let animationTimer: number;
    let isRunning: boolean = true;
    let canvas: HTMLCanvasElement;
    let browser: boolean = false;

    // Speed control (milliseconds between updates)
    let updateInterval: number = 100; // Default: 100ms (10 updates per second)

    // Create initial random grid
    function initializeGrid(): void {
        // Create empty grid first
        grid = Array(rows)
            .fill(null)
            .map(() =>
                Array(cols)
                    .fill(null)
                    .map(() => false),
            );
        nextGrid = Array(rows)
            .fill(null)
            .map(() => Array(cols).fill(false));

        // Calculate center area to leave empty
        const leftColumnEnd = Math.floor(cols * 0.3); // Left 30% has cells
        const rightColumnStart = Math.floor(cols * 0.7); // Right 30% has cells

        // Fill only left and right portions with random cells
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // Only generate random cells on left and right sides
                if (j < leftColumnEnd || j >= rightColumnStart) {
                    grid[i][j] = Math.random() > 0.8; // 20% chance of a cell being alive
                }
                // Center remains empty (cells are already false from initialization)
            }
        }
    }

    // Count neighbors for a cell
    function countNeighbors(grid: boolean[][], x: number, y: number): number {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                // Skip the cell itself
                if (i === 0 && j === 0) continue;

                // Handle edge wrapping
                const col = (x + i + cols) % cols;
                const row = (y + j + rows) % rows;

                if (grid[row][col]) sum++;
            }
        }
        return sum;
    }

    // Compute the next generation
    function computeNextGeneration(): void {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const neighbors = countNeighbors(grid, j, i);
                const currentCell = grid[i][j];

                // Apply Conway's Game of Life rules
                if (currentCell && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[i][j] = false; // Dies from loneliness or overpopulation
                } else if (!currentCell && neighbors === 3) {
                    nextGrid[i][j] = true; // Reproduction
                } else {
                    nextGrid[i][j] = currentCell; // Stays the same
                }
            }
        }

        // Swap grids
        [grid, nextGrid] = [nextGrid, grid];
    }

    // Animation step with controlled timing
    function animate(): void {
        if (isRunning) {
            computeNextGeneration();
            drawGrid();
        }

        // Schedule next update with the specified interval
        animationTimer = setTimeout(animate, updateInterval);
    }

    // Draw the grid on canvas
    function drawGrid(): void {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw cells
        ctx.strokeStyle = "#b6b6b6cc";
        ctx.lineWidth = 1;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j]) {
                    ctx.beginPath();
                    ctx.rect(
                        j * cellSize,
                        i * cellSize,
                        cellSize - 1,
                        cellSize - 1,
                    );
                    ctx.stroke();
                }
            }
        }
    }

    // Handle window resize
    function handleResize(): void {
        if (!browser) return;

        cols = Math.floor(window.innerWidth / cellSize);
        rows = Math.floor(window.innerHeight / cellSize);

        if (canvas) {
            canvas.width = cols * cellSize;
            canvas.height = rows * cellSize;
        }

        initializeGrid();
    }

    onMount(() => {
        // Set browser flag when component is mounted (client-side only)
        browser = true;

        // Now we can use window
        cols = Math.floor(window.innerWidth / cellSize);
        rows = Math.floor(window.innerHeight / cellSize);

        if (canvas) {
            canvas.width = cols * cellSize;
            canvas.height = rows * cellSize;
        }

        initializeGrid();
        drawGrid();

        // Start animation with the specified interval
        animationTimer = setTimeout(animate, updateInterval);

        window.addEventListener("resize", handleResize);
    });

    onDestroy(() => {
        if (!browser) return;

        if (animationTimer) {
            clearTimeout(animationTimer);
        }
        window.removeEventListener("resize", handleResize);
    });
</script>

<canvas bind:this={canvas} class="backdrop-opacity-50"></canvas>

<!-- <div class="controls">
    <button on:click={toggleSimulation}>
        {isRunning ? "Pause" : "Play"}
    </button>
    <button on:click={resetGrid}>Reset</button>

    <div class="speed-control">
        <span>Speed:</span>
        <input
            type="range"
            min="16"
            max="3000"
            bind:value={updateInterval}
            on:change={() => setSpeed(updateInterval)}
        />
        <span>{updateInterval}ms</span>
    </div>
</div> -->

<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        background-color: #000000;
    }

    .controls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 5px;
        color: white;
    }

    button {
        margin: 0 5px;
        padding: 5px 10px;
        background: #4447a9;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }

    button:hover {
        background: #33358a;
    }
</style>
