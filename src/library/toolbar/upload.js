import React from 'react'

export default class extends React.Component {
  render() {
    const { onBeforeUpload, onAfterUpload, getEngine, children } = this.props
    let { engine, name } = this.props
    name = name || ''
    if (name.indexOf(':') >= 0) {
      name = name.split(':')[1]
    }
    engine = getEngine() || engine
    const accept = engine.uploader.getAccept(name)
    return (
      <span onClick={() => {
        this.fileInput.click()
      }}
      >
        <input
          type="file"
          accept={accept}
          ref={(e) => this.fileInput = e}
          onChange={() => {
            engine.uploader.post(name, [...this.fileInput.files], {
              onBeforeUpload,
              onAfterUpload,
            })
          }}
          style={{
            display: 'none',
          }}
          multiple="multiple"
        />
        {children}
      </span>
    )
  }
}
