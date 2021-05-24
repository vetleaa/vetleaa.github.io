const MAX_COLOR = 16777215;

export function getUniqueColors(num: number) {
    const step = Math.floor(MAX_COLOR / (num - 1));

    return Array(num).fill(null).map((_, index) => `#${(step * index).toString(16).padStart(6, '0')}`);
}
