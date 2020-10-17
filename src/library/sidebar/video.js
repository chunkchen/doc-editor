import React from 'react';
import { Checkbox } from 'antd';
import 'antd/lib/checkbox/style';

class Video extends React.Component {
  constructor(props) {
    super();
    this.state = {
      allowDownload: props.data.allowDownload,
    };
  }

  getActivatedComponent() {
    const { engine } = this.props;
    const section = engine.change.activeSection;
    if (section) {
      const component = engine.section.getComponent(section);
      if (component) return component;
    }
  }

  handleUpdateDownload(allowDownload) {
    const component = this.getActivatedComponent();
    if (component) {
      component.setValue(
        {
          allowDownload,
        },
        false,
      );
    }
  }

  render() {
    return (
      <div>
        <Checkbox
          className="lake-content-view-download"
          onChange={(event) => {
            this.handleUpdateDownload(event.target.checked);
          }}
          defaultChecked={this.props.data.allowDownload}
        >
          {this.props.engine.locale.localdoc.allowDownload}
        </Checkbox>
      </div>
    );
  }
}

export default Video;
