import React, { Component } from 'react'
import { MultiPageEditor } from '../../library'
import template from './temp/docContentTemplate'

export default class MultiPageEdit extends Component {
  static displayName = 'MultiPageEdit';

  constructor(props) {
    super(props)
    this.state = {
      fileData: template,
    }
  }

  onEditorLoaded = () => {

  };

  onEditorChange = () => {

  };

  onEditorSave = () => {

  };

  render() {
    const { fileData } = this.state
    return (
      <MultiPageEditor
        header
        pageList={fileData.pageList}
        onLoad={this.onEditorLoaded}
        onChange={this.onEditorChange}
        onSave={this.onEditorSave}
        ot={false}
      />
    )
  }
}
