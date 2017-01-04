export type PrimitiveTypes = number | string | null | undefined;
export type CompoundTypes = Object | Array<any>;

export type DataTypes = PrimitiveTypes | CompoundTypes;

export type Path = Array<string | number>;

export interface Getter {
    (any): DataTypes
}

export interface LeafSchema {
    name: string; // the name of the original (e.g. from server) property, i.e. sourceName
    value: (context: any, dataset: DataTypes, sourcePath: Path) => DataTypes; // the getter of the new property
    [extraPropName: string]: any; // for plugins
}

export interface BaseCompoundSchema {
    name: string; // the name of the original property, sourceName
    [extraPropName: string]: any; // the structure of an Array
}

export interface ObjectSchema extends BaseCompoundSchema {
    properties?: {
        [targetPropName: string]: CompoundSchema | LeafSchema
    }; // the structure of an Object
}

export interface ArraySchema extends BaseCompoundSchema {
    children?: {
        [targetPropName: string]: CompoundSchema | LeafSchema
    };
}

export type CompoundSchema = ObjectSchema | ArraySchema;

/**
 * Simplified schemas are tolerant, will be revived into FullSchema
 */
export type SimplifiedLeafSchema = '=' | string | Getter | {
    name?: string;
    value?: (context: any, dataset: DataTypes, sourcePath: Path) => DataTypes; // the getter of the new property
    [extraPropName: string]: any; // for plugins
};

export interface SimplifiedCompoundSchema {
    name?: string | '=';
    properties?: {
        [targetPropName: string]: SimplifiedSchema
    }; // the structure of an Object
    children?: {
        [targetPropName: string]: SimplifiedSchema
    };
    [extraPropName: string]: any; // the structure of an Array
};

export type SimplifiedSchema = SimplifiedLeafSchema | SimplifiedCompoundSchema;

export type FullSchema = LeafSchema | CompoundSchema;