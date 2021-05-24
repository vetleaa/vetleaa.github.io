async function main() {
    const { visualize } = await import('./experiments/async-array-iterators');

    const el1 = document.getElementById('experiment1');

    visualize(el1);

    // 1. Create lazyload import (visualizeOnLazy('.exp-async-iterators', () => import('./experiment/async-array-iterators')))
    // 2. Create a experiment template with content, a standardized settings sidebar and CSS per experiment
    // 3. ???
    // 4. !
}

main();
