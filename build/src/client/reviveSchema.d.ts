/**
 * Schema describe the structure of a node inside the whole JSON tree
 *
 * a Schema can include two kind of infomation
 * 1. the type of the node: `primitive`(number, string, null, undefined), and `compound`(mixed with `primitive` and Object)
 * 2. the value if it's a primitive node, or the inner structure if it's a compound node
 */
import { SimplifiedSchema, Path, FullSchema } from './types';
export default function reviveSchema(schema: SimplifiedSchema, targetPath?: Path): FullSchema;
