import {Path} from './types';

export default function getInPath(obj: Object, path: Path = []): any {
    if (path.length === 0) {
        return obj;
    }

    if (typeof obj !== 'object') {
        throw new Error(`could not get a property ${path.join('.')} from a primitive: ${obj}`);
    }

    return getInPath(obj[path[0]], path.slice(1));
}