import React, { Component } from 'react';
import { LineEditor } from '../../library';

import tempContent from './tempContent';

export default class InlineEdit extends Component {
  static displayName = 'InlineEdit';

  cropImgRef = undefined;

  constructor(props) {
    super(props);
    this.state = {
      type: null,
      content: tempContent,
    };
  }

  onEditorLoaded = (engine) => {
    this.engine = engine;
    engine.focusToEnd();
  };

  onEditorChange = (content) => {
    this.setState({
      content,
    });
  };

  onEditorSave = () => {
    const { type } = this.state;
    console.log(`${type} save`);
  };

  render() {
    const { content } = this.state;
    return (
      <LineEditor
        value={content}
        defaultValue={content}
        onLoad={this.onEditorLoaded}
        onChange={this.onEditorChange}
        onSave={this.onEditorSave}
        ot={false}
      />
    );
  }
}
