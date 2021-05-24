export { default as forEach } from './src/forEach';
export { default as map } from './src/map';
export { default as visualize } from './visualize';

export const meta = {
    title: 'Async map & forEach with concurrency limits',
    settings: {
        //'workers': settings.range({ from: 0, to: 4, default: 3}),
    }
};
