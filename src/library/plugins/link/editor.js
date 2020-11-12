import React from 'react';
import { sanitizeUrl } from '@hicooper/doc-engine/lib/utils/string';
import { Button, Input, Tooltip } from 'antd';
import languages from './lang';

class LinkEditor extends React.Component {
  constructor(props) {
    super(props);
    const { type, target, lang } = props;
    this.locale = languages[lang];
    this.nativeEvents = [];
    this.rect = target.getBoundingClientRect();
    this.link = target.getAttribute('href');

    this.state = {
      type,
      invalidLink: this.isInvalidLink(this.link),
    };
    this.preventScrollCancel = false;
    this.setContainerPosition();
  }

  setContainerPosition() {
    const { container, target } = this.props;
    const { bottom } = target.getBoundingClientRect();
    container.className = 'lake-prevent-section-activated';
    container.style.top = ''.concat(+window.pageYOffset + bottom + 4, 'px');
    container.style.left = ''.concat(window.pageXOffset, 'px');
    container.style.position = 'absolute';
    container.style['z-index'] = '1400';
  }

  adjustPosition() {
    const { container, target } = this.props;
    const { top, left, bottom } = target.getBoundingClientRect();
    const { height, width } = container.getBoundingClientRect();
    const styleLeft = (left + width) > window.innerWidth - 20
      ? window.pageXOffset + window.innerWidth - width - 20
      : left - window.pageXOffset < 20
        ? window.pageXOffset + 20
        : window.pageXOffset + left;
    const styleTop = bottom + height > window.innerHeight - 20
      ? window.pageYOffset + top - height - 4
      : window.pageYOffset + bottom + 4;
    container.style.top = `${styleTop}px`;
    container.style.left = `${styleLeft}px`;
  }

  componentDidMount() {
    this.bindNativeEvents();
    this.adjustPosition();
  }

  componentDidUpdate() {
    this.adjustPosition();
  }

  componentWillUnmount() {
    this.removeNativeEvents();
  }

  bindNativeEvents() {
    const { container } = this.props;
    let isMouseDown = false;
    this.addNativeEvent(
      window,
      'scroll',
      (event) => {
        const { target } = event;
        if (this.preventScrollCancel) {
          event.preventDefault();
        } else if (!target.className || target.className.indexOf('lake-link') === -1) {
          this.cancel();
        }
      },
      true,
    );

    this.addNativeEvent(
      window,
      'resize',
      () => {
        this.cancel();
      },
      true,
    );

    this.addNativeEvent(
      window,
      'mousedown',
      (event) => {
        if (!container.contains(event.target)) {
          isMouseDown = true;
        }
      },
      true,
    );

    this.addNativeEvent(
      window,
      'mouseup',
      (event) => {
        if (isMouseDown && !container.contains(event.target)) {
          this.cancel();
        }
        isMouseDown = false;
      },
      true,
    );

    this.addNativeEvent(container, 'keydown', (event) => {
      const { keyCode } = event;

      if (keyCode === 13 && !this.state.invalidLink) {
        this.confirm();
      }
      if (keyCode === 27) {
        this.cancel();
      }
    });
  }

  cancel() {
    const { target, onCancel } = this.props;
    onCancel({
      link: target ? target.getAttribute('href') : null,
    });
  }

  addNativeEvent(dom, name, callback, useCapture) {
    dom.addEventListener(name, callback, useCapture);
    this.nativeEvents.push({
      dom,
      name,
      callback,
      useCapture,
    });
  }

  removeNativeEvents() {
    this.nativeEvents.forEach((nativeEvent) => {
      const { dom, name, callback, useCapture } = nativeEvent;
      dom.removeEventListener(name, callback, useCapture);
    });
    this.nativeEvents = [];
  }

  confirm() {
    const { onConfirm } = this.props;
    const { invalidLink } = this.state;
    const text = this.getText();
    const link = this.getLink();

    if (!invalidLink) {
      onConfirm(text, link);
    }
  }

  renderPreview() {
    const { onDeleteLink, shouldTargetBlank } = this.props;
    const link = this.getLink();
    const locale = this.locale;
    const text = link || locale.emptyLink;

    const linkContainer = link ? (
      shouldTargetBlank(link) ? (
        <a className="lake-link-editor-link-container"
           href={sanitizeUrl(link)}
           target="_blank"
           rel="noopener noreferrer"
        >
          {text}
        </a>
      ) : (
        <a className="lake-link-editor-link-container" href={sanitizeUrl(link)}>
          {text}
        </a>
      )
    ) : (
      <span className="lake-link-editor-link-empty">{text}</span>
    );

    return (
      <div
        className="lake-link-editor lake-link-editor-preview"
        ref={ref => (this.containerDom = ref)}
      >
        <span className="lake-icon lake-icon-link"/>
        {linkContainer}
        <span className="lake-link-editor-slash"/>
        <Tooltip title={locale.editLink}>
          <span
            className="lake-icon lake-icon-edit lake-link-editor-button"
            onClick={() => {
              this.setState({
                type: 'edit',
              });
            }}
          />
        </Tooltip>
        <Tooltip title={locale.deleteLink}>
          <span
            className="lake-icon lake-icon-unlink lake-link-editor-button"
            onClick={onDeleteLink}
          />
        </Tooltip>
      </div>
    );
  }

  isInvalidLink = (link) => {
    return !link || (link && !link.match(/^[\x00-\x7F]/)) || link.startsWith('javascript:');
  };

  renderEditor() {
    const { invalidLink } = this.state;
    const text = this.getText();
    const link = this.getLink();
    const locale = this.locale;

    return (
      <div
        className="lake-link-editor lake-link-editor-edit"
        ref={element => (this.containerDom = element)}
      >
        <p>{locale.text}</p>
        <p>
          <Input
            className="lake-link-text-input"
            defaultValue={text}
            ref={(element) => {
              this.preventScrollCancel = true;
              if (element) element.focus();
              this.textInputDom = element;
              setTimeout(() => {
                this.preventScrollCancel = false;
              }, 32);
            }}
            placeholder={locale.addDescription}
            onChange={(event) => {
              this.text = event.target.value;
            }}
          />
        </p>
        <p>{locale.link}</p>
        <p>
          <Input
            className="lake-link-text-input"
            defaultValue={link}
            ref={(element) => {
              if (element) {
                element.focus();
              }
              this.linkInputDom = element;
            }}
            placeholder={locale.linkAddress}
            onChange={(event) => {
              this.link = event.target.value;
              this.setState({
                invalidLink: this.isInvalidLink(this.link),
              });
            }}
          />
        </p>
        {invalidLink && link !== '' ? (
          <p className="lake-link-invalid-link">{locale.pleaseEnterCorrectLink}</p>
        ) : (
          ''
        )}
        <p>
          <Button
            className="lake-link-confirm-button"
            onClick={() => {
              this.confirm();
            }}
            disabled={!this.link || invalidLink}
          >
            确定
          </Button>
        </p>
      </div>
    );
  }

  getLink() {
    const { target, getLink } = this.props;
    return (this.link && getLink(this.link)) || target.getAttribute('href') || '';
  }

  getText() {
    return this.text || this.props.target.innerText;
  }

  render() {
    return this.state.type === 'edit' ? this.renderEditor() : this.renderPreview();
  }
}

LinkEditor.defaultProps = {
  container: {},
  target: {},
  type: 'preview',
  lang: 'zh-cn',
  onDeleteLink: () => {
  },
  onConfirm: () => {
  },
  onCancel: () => {
  },
  shouldTargetBlank: () => {
  },
  getLink: e => e,
};

export default LinkEditor;
