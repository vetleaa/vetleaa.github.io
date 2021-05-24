// src/experiments/async-array-iterators/src/forEach.ts
async function worker(meta2, callback) {
  let index = null;
  while (meta2.activeIndex < meta2.entries.length) {
    index = meta2.activeIndex;
    meta2.activeIndex += 1;
    await callback(meta2.entries[index], index);
  }
}
async function forEach(array, callback, options = {concurrency: 3}) {
  const workers = [];
  const meta2 = {
    entries: array,
    activeIndex: 0
  };
  while (workers.length < options.concurrency) {
    workers.push(worker(meta2, callback));
  }
  await Promise.all(workers);
}
var forEach_default = forEach;

// src/experiments/async-array-iterators/src/map.ts
async function worker2(meta2, callback, result) {
  let index = null;
  while (meta2.activeIndex < meta2.entries.length) {
    index = meta2.activeIndex;
    meta2.activeIndex += 1;
    const callbackRes = await callback(meta2.entries[index], index);
    result[index] = callbackRes;
  }
}
async function map(array, callback, options = {concurrency: 3}) {
  const workers = [];
  const result = [];
  const meta2 = {
    entries: array,
    activeIndex: 0
  };
  while (workers.length < options.concurrency) {
    workers.push(worker2(meta2, callback, result));
  }
  await Promise.all(workers);
  return result;
}
var map_default = map;

// src/utils/colors.ts
var MAX_COLOR = 16777215;
function getUniqueColors(num) {
  const step = Math.floor(MAX_COLOR / (num - 1));
  return Array(num).fill(null).map((_, index) => `#${(step * index).toString(16).padStart(6, "0")}`);
}

// src/utils/timeout.ts
function asyncTimeout(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

// src/experiments/async-array-iterators/visualize.ts
var SAMPLE_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var MAX_POSSIBLE_TIME = SAMPLE_ARRAY.length * 2e3 / 2;
var uniqueColors = getUniqueColors(SAMPLE_ARRAY.length);
var lanes = {};
function getLane(el, laneIndex) {
  return el.querySelector(`div.lane-${laneIndex}`);
}
function createLaneIfNotExists(el, laneIndex) {
  if (getLane(el, laneIndex)) {
    return getLane(el, laneIndex);
  }
  const laneEl = document.createElement("div");
  laneEl.setAttribute("class", `lane-${laneIndex}`);
  laneEl.setAttribute("style", `width: 100%; height: 200px;`);
  el.appendChild(laneEl);
  return laneEl;
}
function createLaneChild(lane, num) {
  const child = document.createElement("div");
  child.dataset.num = num.toString();
  child.setAttribute("style", `display: inline-block; width: 0%; height: inherit; background-color: ${uniqueColors[num - 1]}; border: 1px dotted black;`);
  lane.appendChild(child);
  return child;
}
function occupyLane(el, num) {
  const firstEmptyLaneIndex = SAMPLE_ARRAY.findIndex((_, index) => {
    return !lanes.hasOwnProperty(index);
  });
  const laneEl = createLaneIfNotExists(el, firstEmptyLaneIndex);
  lanes[firstEmptyLaneIndex] = createLaneChild(laneEl, num);
}
function releaseLane(el, num) {
  const laneToReleaseIndex = Object.keys(lanes).find((key) => lanes[key].dataset.num === num.toString());
  delete lanes[laneToReleaseIndex];
}
var isAnimating = true;
function animate(prevTime) {
  if (!prevTime) {
    isAnimating = true;
    prevTime = Date.now();
  }
  window.requestAnimationFrame(() => {
    const now = Date.now();
    const deltaTime = now - prevTime;
    Object.keys(lanes).forEach((key) => {
      const {width} = lanes[key].style;
      const newWidth = parseFloat(width) + deltaTime / MAX_POSSIBLE_TIME * 100;
      lanes[key].style.width = newWidth + "%";
    });
    if (isAnimating) {
      animate(now);
    }
  });
}
var DEFAULT_SETTINGS = {workers: 3};
async function visualize(el, {workers} = DEFAULT_SETTINGS) {
  animate();
  await forEach_default(SAMPLE_ARRAY, async (num) => {
    occupyLane(el, num);
    await asyncTimeout(Math.random() * 1500 + 500);
    releaseLane(el, num);
  }, {concurrency: workers});
  isAnimating = false;
}
var visualize_default = visualize;

// src/experiments/async-array-iterators/index.ts
var meta = {
  title: "Async map & forEach with concurrency limits",
  settings: {}
};
export {
  forEach_default as forEach,
  map_default as map,
  meta,
  visualize_default as visualize
};
