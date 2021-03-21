import React, { Component } from 'react';
import { unsubscribeComponent } from '../components/unsubscribeComponent';

export default function withSubscription(WrappedComponent) {
  return class extends Component {
    static displayName = `WithSubscription(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    state = {
      subscriptions: {},
    };

    componentWillUnmount() {
      unsubscribeComponent(this.state.subscriptions);
    }

    setSubscriptions = (updates) => {
      this.setState(state => ({
        subscriptions: {
          ...state.subscription,
          ...updates,
        },
      }));
    };

    render() {
      return (
        <WrappedComponent
          subscriptions={this.state.subscriptions}
          setSubscriptions={this.setSubscriptions}
          {...this.props}
        />
      );
    }
  };
}
