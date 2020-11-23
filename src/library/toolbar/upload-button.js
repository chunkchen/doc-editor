import React from 'react'
import Button from './button'
import Upload from './upload'

class UploadButton extends React.Component {
  render() {
    const disabled = this.props.disabled

    if (disabled) {
      return <Button {...this.props} />
    }

    return (
      <Upload {...this.props}>
        <Button {...this.props} />
      </Upload>
    )
  }
}

export default UploadButton
