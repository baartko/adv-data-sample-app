import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';
import Spinner from './spinner';
import withSubscription from '../hocs/withSubscriptions';

export class SpinResolverComponent extends Component {
  static defaultProps = {
    className: '',
    classes: {},
    setSubscriptions() {},
  };

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(PropTypes.func).isRequired,
    setSubscriptions: PropTypes.func,
  };

  state = {
    loading: true,
    results: [],
    lastSync: null,
    reloads: [],
    syncTimes: [],
  };

  componentDidMount() {
    this.fetchAllServices();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.services, prevProps.services)) {
      this.refetchAllServices({});
    }
  }

  fetchService = (service, serviceIndex) => (props, loading) => {
    const service$ = service(props).pipe(take(1));

    this.setState(
      {
        loading: Boolean(loading),
      },
      () => {
        const reserviceSub = service$.subscribe((newResult) => {
          this.setState(state => ({
            results: state.results.map((result, index) =>
              (serviceIndex === index ? newResult : result)),
            syncTimes: state.syncTimes.map((time, index) =>
              (serviceIndex === index ? moment() : time)),
            lastSync: moment(),

            loading: false,
          }));
        });
        this.props.setSubscriptions({ reserviceSub });
      },
    );

    return service$;
  };

  fetchAllServices = () => {
    const allServicesSub = zip(...this.props.services.map(service => service()))
      .pipe(take(1))
      .subscribe(
        results =>
          this.setState({
            results,
            loading: false,
            lastSync: moment(),
            reloads: this.props.services.map((service, index) =>
              this.fetchService(service, index)),
            syncTimes: this.props.services.map(() => moment()),
          }),
        // needs to be cancelled
        err => this.setState({ loading: false, results: [err] }),
      );

    this.props.setSubscriptions({ allServicesSub });
  };

  refetchAllServices = ({ loading }) => {
    this.setState(
      {
        loading: Boolean(loading),
      },
      this.fetchAllServices,
    );
  };

  render() {
    const {
      loading, results, lastSync, reloads, syncTimes,
    } = this.state;
    const {
      className,
    } = this.props;
    return (
      <Fragment>
        <div className={classnames({ 'hidden': !loading }, className)}>
          <Spinner />
        </div>
        <div className={classnames({ 'hidden': loading }, className)}>
          {results.length
            ? this.props.children({
              lastSync,
              reload: this.refetchAllServices,
              reloads,
              results,
              syncTimes,
            })
            : null}
        </div>
      </Fragment>
    );
  }
}

// const Styled = withStyles(styles)(SpinResolverComponent);
const Subbed = withSubscription(SpinResolverComponent);
export default Subbed;
