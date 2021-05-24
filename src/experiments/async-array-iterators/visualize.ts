import forEach from './src/forEach';
import { getUniqueColors } from '../../utils/colors';

const SAMPLE_ARRAY = [1,2,3,4,5,6,7,8,9,10];

const MAX_POSSIBLE_TIME = (SAMPLE_ARRAY.length * 2000) / 2;

const uniqueColors = getUniqueColors(SAMPLE_ARRAY.length);

const lanes: Record<string, HTMLElement> = {};

function getLane(el: HTMLElement, laneIndex: number): HTMLDivElement {
    return el.querySelector(`div.lane-${laneIndex}`);
}

function createLaneIfNotExists(el: HTMLElement, laneIndex: number) {
    if (getLane(el, laneIndex)) {
        return getLane(el, laneIndex);
    }

    const laneEl = document.createElement('div');
    laneEl.setAttribute('class', `lane-${laneIndex}`);
    laneEl.setAttribute('style', `width: 100%; height: 200px;`);

    el.appendChild(laneEl);

    return laneEl;
}

function createLaneChild(lane: HTMLDivElement, num: number) {
    const child = document.createElement('div');
    child.dataset.num = num.toString();
    child.setAttribute('style', `display: inline-block; width: 0%; height: inherit; background-color: ${uniqueColors[num - 1]}; border: 1px dotted black;`);

    lane.appendChild(child);

    return child;
}

function occupyLane(el: HTMLElement, num: number) {
    const firstEmptyLaneIndex = SAMPLE_ARRAY.findIndex((_, index) => {
        return !lanes.hasOwnProperty(index);
    });

    const laneEl = createLaneIfNotExists(el, firstEmptyLaneIndex);

    lanes[firstEmptyLaneIndex] = createLaneChild(laneEl, num);
}

function releaseLane(el: HTMLElement, num: number) {
    const laneToReleaseIndex = Object.keys(lanes).find((key) => lanes[key].dataset.num === num.toString());

    delete lanes[laneToReleaseIndex];
}

let isAnimating = true;
function animate(prevTime?: number) {
    if (!prevTime) {
        isAnimating = true;

        prevTime = Date.now();
    }

    window.requestAnimationFrame(() => {
        const now = Date.now();

        const deltaTime = now - prevTime;

        Object.keys(lanes).forEach((key) => {
            const { width } = lanes[key].style;
            const newWidth = parseFloat(width) + (deltaTime / MAX_POSSIBLE_TIME) * 100;

            lanes[key].style.width = newWidth + '%';
        });

        if (isAnimating) {
            window.requestAnimationFrame(() => animate(now));
        }
    });
}

const DEFAULT_SETTINGS = { workers: 3 };

async function visualize(el: HTMLElement, { workers } = DEFAULT_SETTINGS) {
    animate();

    await forEach(SAMPLE_ARRAY, async (num) => {
        occupyLane(el, num);

        await new Promise(resolve => {
            const timeoutMs = Math.random() * 1500 + 500;
            setTimeout(resolve, timeoutMs);
        });

        releaseLane(el, num);
    }, { concurrency: workers });

    isAnimating = false;
}

export default visualize;
