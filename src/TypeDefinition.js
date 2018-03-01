/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/8
 *
 * @flow
 **/

export type ReactComponent = Class<React$Component<*, *>>;

export type StyleSheetGetter = () => Object;

export type Disposer = () => void;

export type Watcher = () => void;

export type VarsOrInitializer = Object | (GlobalVars: Object) => Object;

export type Connecter = (styleSheetGetter: StyleSheetGetter) => ReactComponent;
