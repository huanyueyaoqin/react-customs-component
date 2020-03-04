import React, { Component } from "react";
import "./index.less";
import { createThrottle } from "../../util/throttle";

interface IBackTopProps {
  visibilityHeight?: number;
  callbackBeforescrolling?: Function;
  callbackAfterscrolling?: Function;
  content?: any;
  style?: React.CSSProperties;
}

interface IBackTopState {
  visiable: boolean;
}
class BackTop extends Component<IBackTopProps, IBackTopState> {
  static defaultProps = {
    visibilityHeight: 400,
    content: "Top"
  };
  scrollEvent: any;
  constructor(props: IBackTopProps) {
    super(props);
    this.state = {
      visiable: false
    };
  }

  getScroll = () => {};

  handleScroll = createThrottle(() => {
    const { visibilityHeight } = this.props;
    this.setState({
      visiable: window.pageYOffset > (visibilityHeight as number)
    });
  }, 200);

  componentDidMount() {
    // eslint-disable-next-line no-restricted-globals
    this.scrollEvent = addEventListener("scroll", this.handleScroll as EventListener);
  }
  componentWillUnmount() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  }
  handleToTop = () => {
    const { callbackBeforescrolling, callbackAfterscrolling } = this.props;
    if (callbackBeforescrolling) {
      callbackBeforescrolling();
    }

    window.scrollTo(0, 0);

    if (callbackAfterscrolling) {
      callbackAfterscrolling();
    }
  };

  renderBackTop = () => {
    const { visiable } = this.state;
    return visiable ? (
      <div className="backtop" onClick={this.handleToTop}>
        {this.props.content}
      </div>
    ) : null;
  };

  render() {
    return <div>{this.renderBackTop()}</div>;
  }
}

export default BackTop;
