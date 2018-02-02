/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/1
 *
 * @flow
 **/

export type StyleConfig = Array<StyleConfig> | Object | string;

export type ComponentStyle = {[string]: StyleConfig};

export type Watcher = () => void;

export type Disposer = () => void;

export type VarGetter = {
    get: (name: string) => any,
    has: (name: string) => boolean
}

export type VarsOrInitializer = Object | (GlobalVars: Object) => Object

export type Vars = () => {__prefix: string}
