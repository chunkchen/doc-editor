import React, { Component } from 'react';
import Container from '../../components/Container';
import { FullEditor } from '../../library';

export default class BlankPage extends Component {
  static displayName = 'BlankPage';

  cropImgRef = undefined

  constructor(props) {
    super(props);
    this.state = {
      type: null,
      content: '',
    };
  }

  onEditorLoaded = (engine) => {
    this.engine = engine;
    engine.focusToEnd();
    const { type } = this.state;
    console.log(`${type} loaded `);
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
