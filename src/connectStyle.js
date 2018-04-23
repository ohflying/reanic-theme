/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/7
 *
 * @flow
 **/

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Theme from './Theme';
import mergeReactStatic from './mergeReactStatic';
import type {Connecter, ReactComponent, StyleSheetGetter} from './TypeDefinition';

export default function connectStyle(WrapComponent: ReactComponent): Connecter {
    return function connect(styleSheetGetter: StyleSheetGetter): ReactComponent {
        class StyleComponent extends React.PureComponent<*, *> {
            static propTypes = {
                styles: PropTypes.object
            };

            static defaultProps = {
                styles: {}
            };

            constructor(props, context) {
                super(props, context);

                this.state = {
                    styles: Theme.style(styleSheetGetter, props)
                };
            }

            componentWillReceiveProps(nextProps, nextContext) {
                let nextStyles = Theme.style(styleSheetGetter, nextProps);
                if (!_.isEqual(this.state.styles, nextStyles)) {
                    this.setState({
                        styles: nextStyles
                    });
                }
            }

            render() {
                let styles = _.merge(this.state.styles, this.props.styles);
                return (
                    <WrapComponent
                        {...this.props}
                        styles={styles}
                    />
                );
            }
        }

        return mergeReactStatic(StyleComponent, WrapComponent);
    };
}
