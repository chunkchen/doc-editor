import React, { Component } from 'react'
import { MobileEditor } from '../../library'

import tempContent from './tempContent'

export default class MobileEdit extends Component {
  static displayName = 'MobileEdit';

  cropImgRef = undefined;

  constructor(props) {
    super(props)
    this.state = {
      type: null,
      content: tempContent,
    }
  }

  onEditorLoaded = (engine) => {
    this.engine = engine
    engine.focusToEnd()
  };

  onEditorChange = (content) => {
    this.setState({
      content,
    })
  };

  onEditorSave = () => {
    const { type } = this.state
    console.log(`${type} save`)
  };

  render() {
    const { content } = this.state
    return (
      <MobileEditor
        value={content}
        defaultValue={content}
        onLoad={this.onEditorLoaded}
        onChange={this.onEditorChange}
        onSave={this.onEditorSave}
        ot={false}
      />
    )
  }
}
