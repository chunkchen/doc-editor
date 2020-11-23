import React from 'react'
import { message as antdMessage, Popover } from 'antd'
import 'antd/lib/popover/style'
import 'antd/lib/message/style'
import Engine from '@hicooper/doc-engine'
import './index.css'

const msgTip = {
  'zh-cn': {
    copyMessage: '\u590d\u5236\u9519\u8bef\u4fe1\u606f',
    copySuccess: '\u590d\u5236\u6210\u529f\uff01',
  },
  en: {
    copyMessage: 'Copy error information',
    copySuccess: 'Successful copy!',
  },
}

const copyMessage = msgTip[window.appData && window.appData.locale !== 'zh-cn' ? 'en' : 'zh-cn']

class Error extends React.Component {
  render() {
    const { variableContent, fixedContent, message, block, docWidth, sectionIcon } = this.props
    return (
      <div className="lake-error-tips" style={{ width: block ? '100%' : 'auto' }}>
        <div className="lake-error-tips-section-icon"
          dangerouslySetInnerHTML={{
            __html: sectionIcon,
          }}
        />
        <div className="lake-error-tips-info">
          <span className="lake-error-tips-variable-content"
            style={{ maxWidth: block ? ''.concat(docWidth - 200, 'px') : '220px' }}
          >
            {variableContent}
          </span>
          <span className="lake-error-tips-fixed-content">{fixedContent}</span>
        </div>
        {
          message ? (
            <Popover
              title={copyMessage.copyMessage}
              placement="bottom"
            >
              <span
                className="lake-svg-icon lake-svg-icon-alert"
                onClick={() => {
                  const e = {
                    mode: 'json',
                    code: JSON.stringify(message, null, '  '),
                    id: 'Yf9WB',
                  }
                  Engine.ClipboardUtils.copyNode('<div data-section-type="block" data-section-key="codeblock" data-section-value="'.concat(Engine.StringUtils.encodeSectionValue(e), '"></div>'))
                  antdMessage.success(copyMessage.copySuccess)
                }}
              />
            </Popover>
          ) : ''
        }
      </div>
    )
  }
}

export default Error
