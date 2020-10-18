import React, { Component } from 'react';
import Container from '../../components/Container';
import { FullEditor } from '../../library';

import tempContent from './tempContent';

export default class BlankPage extends Component {
  static displayName = 'BlankPage';

  cropImgRef = undefined

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
    const { type } = this.state;
    console.log(`${type} change: ${content} `);
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
      <Container mode="full">
        <FullEditor
          value={content}
          defaultValue={content}
          onLoad={this.onEditorLoaded}
          onChange={this.onEditorChange}
          onSave={this.onEditorSave}
          ot={false}
        />
      </Container>
    );
  }
}
