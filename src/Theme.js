/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/7
 *
 * @flow
 **/

import _ from 'lodash';
import resolveStyle from './resolveStyle';
import type {Disposer, StyleSheetGetter, VarsOrInitializer, Watcher} from './TypeDefinition';

let _vars: Object = {};
let _watchers: Array<Watcher> = [];

export default class Theme {
    static setTheme(theme: Object) {
        _vars = theme;

        _watchers.forEach(watcher => watcher());
    }

    static watch(watcher: Watcher): Disposer {
        if (!_watchers.includes(watcher)) {
            _watchers.push(watcher);
        }

        return function dispose(): void {
            let index = _watchers.indexOf(watcher);
            if (index >= 0) {
                _watchers.splice(index, 1);
            }
        };
    }

    static vars(varsOrInitializer: VarsOrInitializer, prefix: string): StyleSheetGetter {
        let tempVars: ?Object = null;

        Theme.watch(() => {
            tempVars = null;
        });

        return () => {
            if (!tempVars) {
                tempVars = typeof varsOrInitializer === 'function'
                    ? varsOrInitializer(_vars)
                    : varsOrInitializer;

                if (_vars[prefix] && tempVars) {
                    let vars = _vars[prefix];
                    Object.keys(tempVars).forEach((key: string) => {
                        //$FlowIgnore
                        tempVars[key] = _.merge(tempVars[key], vars[key]);
                    });
                }
            }

            return tempVars;
        };
    }

    static style(styleSheetGetter: StyleSheetGetter, props: Object): Object {
        return resolveStyle(styleSheetGetter(), props);
    }
}
