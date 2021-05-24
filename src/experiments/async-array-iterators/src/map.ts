type Callback<Entry, Output> = (entry: Entry, index: number) => Promise<Output>;

interface Meta<T> {
    entries: T,
    activeIndex: 0,
}

interface Options {
    concurrency?: number,
}

async function worker<Entry, Output>(
    meta: Meta<Entry[]>,
    callback: Callback<Entry, Output>,
    result?: Output[],
) {
    let index: number = null;

    while (meta.activeIndex < meta.entries.length) {
        index = meta.activeIndex;
        meta.activeIndex += 1;

        const callbackRes = await callback(meta.entries[index], index);

        result[index] = callbackRes;
    }
}

async function map<Entry, Output>(
    array: Entry[],
    callback: Callback<Entry, Output>,
    options: Options = { concurrency: 3 },
) {
    const workers: Promise<void>[] = [];
    const result: Output[] = [];

    const meta: Meta<Entry[]> = {
        entries: array,
        activeIndex: 0,
    };

    while (workers.length < options.concurrency) {
        workers.push(worker(meta, callback, result));
    }

    await Promise.all(workers);

    return result;
}

export default map;
