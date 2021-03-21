import { Subscriber } from 'rxjs';

export const unsubscribeComponent = (subscriptions) => {
    Object.values(subscriptions).forEach(value =>
        (value instanceof Subscriber ? value.unsubscribe() : ''));
}

export default unsubscribeComponent;
