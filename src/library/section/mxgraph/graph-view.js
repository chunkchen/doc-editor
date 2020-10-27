import React from 'react';
import './graph-view.css';

class GraphView extends React.Component {
  state = {}

  componentDidMount() {
    this.instance = {
      setState: (state) => {
        this.onState(state);
      },
    };

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad({
        view: this.instance,
      });
    }
  }

  onState = (state) => {
    this.setState(state);
  }

  render() {
    const { maximize } = this.state;
    const { value, showGraphEditor } = this.props;
    return (
      <div className={`lake-mxgraph${maximize ? ' lake-mxgraph-maximize' : ''}`}>
        {
          showGraphEditor && (
            <div className="lake-mxgraph-nav">
              <div />
              <div className="mxgraph-actions">
                <button size="small" onClick={showGraphEditor}>编辑</button>
              </div>
            </div>
          )
        }
        <div className="lake-mxgraph-preview">
          {
            value.data && value.format === 'svg' && <img src={value.data} alt="" />
          }
        </div>
        <div className="lake-mxgraph-warp" />
      </div>
    );
  }
}

export default GraphView;
