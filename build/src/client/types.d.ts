export declare type PrimitiveTypes = number | string | null | undefined;
export declare type CompoundTypes = Object | Array<any>;
export declare type DataTypes = PrimitiveTypes | CompoundTypes;
export declare type Path = Array<string | number>;
export interface Getter {
    (any: any): DataTypes;
}
export interface LeafSchema {
    name: string;
    value: (context: any, dataset: DataTypes, sourcePath: Path) => DataTypes;
    [extraPropName: string]: any;
}
export interface BaseCompoundSchema {
    name: string;
    [extraPropName: string]: any;
}
export interface ObjectSchema extends BaseCompoundSchema {
    properties?: {
        [targetPropName: string]: CompoundSchema | LeafSchema;
    };
}
export interface ArraySchema extends BaseCompoundSchema {
    children?: {
        [targetPropName: string]: CompoundSchema | LeafSchema;
    };
}
export declare type CompoundSchema = ObjectSchema | ArraySchema;
/**
 * Simplified schemas are tolerant, will be revived into FullSchema
 */
export declare type SimplifiedLeafSchema = '=' | string | Getter | {
    name?: string;
    value?: (context: any, dataset: DataTypes, sourcePath: Path) => DataTypes;
    [extraPropName: string]: any;
};
export interface SimplifiedCompoundSchema {
    name?: string | '=';
    properties?: {
        [targetPropName: string]: SimplifiedSchema;
    };
    children?: {
        [targetPropName: string]: SimplifiedSchema;
    };
    [extraPropName: string]: any;
}
export declare type SimplifiedSchema = SimplifiedLeafSchema | SimplifiedCompoundSchema;
export declare type FullSchema = LeafSchema | CompoundSchema;
