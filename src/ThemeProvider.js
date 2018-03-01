/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/8
 *
 * @flow
 **/

import React from 'react';
import PropTypes from 'prop-types';
import Theme from './Theme';

export default class ThemeProvider extends React.PureComponent<*, *> {
    static childContextTypes = {
        theme: PropTypes.object.isRequired
    };

    static propTypes = {
        theme: PropTypes.object.isRequired
    };

    constructor(props: any, context: any) {
        super(props, context);

        Theme.setTheme(this.props.theme);
    }

    getChildContext() {
        return {
            theme: this.state.theme
        };
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.theme !== this.props.theme) {
            Theme.setTheme(nextProps.theme);
            this.forceUpdate();
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
