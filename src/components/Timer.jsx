import React from 'react';
import PropTypes from 'prop-types';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: props.seconds,
    };
  }

  componentDidMount() {
    if (this.props.autoStart) {
      this.start();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.seconds !== this.props.seconds) {
      this.stop();
      this.setState({ seconds: this.props.seconds });
      if (this.props.autoStart) {
        this.start();
      }
    }
  }

  start = () => {
    this.interval = setInterval(() => {
      this.setState(
        ({ seconds }) => ({ seconds: seconds - 1 }),
        () => {
          if (this.state.seconds <= 0) {
            clearInterval(this.interval);
            this.interval = null;
            if (this.props.onFinished) {
              this.props.onFinished();
            }
          }
        }
      );
    }, 1000);
  };

  stop = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  componentWillUnmount() {
    this.stop();
  }

  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {String(Math.floor(this.state.seconds / 60)).padStart(2, '0')}:
        {String(this.state.seconds % 60).padStart(2, '0')}
      </div>
    );
  }
}

Timer.propTypes = {
  seconds: PropTypes.number.isRequired,
  onFinished: PropTypes.func,
  autoStart: PropTypes.bool,
};

export default Timer;
