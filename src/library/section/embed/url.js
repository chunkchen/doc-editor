import Engine from '@hicooper/doc-engine/lib';
import Upload from './upload';

class Url extends Upload {
  handleInputKeydown = (e) => {
    if (Engine.isHotkey('enter', e)) this.handleSubmit();
  };

  handleSubmit = () => {
    const url = this.find('url')[0].value.trim();
    const options = this.getOptions();
    const embedUrl = options.getDocEmbedURL
      ? options.getDocEmbedURL(url)
      : this.getDocEmbedURL(url);
    if (embedUrl) {
      this.setValue({
        url: embedUrl,
        src: url,
        name: url,
        size: undefined,
        ext: 'html',
      });
      this.render();
    } else {
      this.engine.messageError(this.locale.addressInvalid);
    }
  };

  getDocEmbedURL() {
    return false;
  }

  getUrl() {
    const {src, url} = this.value;
    return url || src;
  }

  embedToolbar() {
    let toolbarExtends = [];
    if (this.engine.options.type === 'max') {
      toolbarExtends = toolbarExtends.concat([
        {
          type: 'dnd',
        },
      ]);
    }
    toolbarExtends = toolbarExtends.concat([
      {
        type: 'copy',
      },
      {
        type: 'delete',
      },
      {
        type: 'separator',
      },
      {
        type: 'expand',
      },
      {
        type: 'collapse',
      },
    ]);
    return toolbarExtends;
  }

  unactivate() {
    super.unactivate.call(this);
    this.container.find('.lake-embed-content').removeClass('lake-embed-content-active');
  }

  find(role) {
    return this.container.find('[data-role='.concat(role, ']'));
  }

  focusInput() {
    setTimeout(() => {
      const urlElement = this.find('url');
      if (urlElement.length > 0) {
        urlElement[0].focus();
      }
    }, 50);
  }

  getPlaceHolder() {
    return Engine.StringUtils.escape(this.locale.placeholder);
  }

  renderInput() {
    const embedNode = Engine.$(
      '\n    <div class="lake-embed lake-embed-active">\n      <div class="lake-embed-form">\n        <span class="lake-embed-editor">\n          <input data-role="url" placeholder="'
        .concat(
          this.getPlaceHolder(),
          '" spellcheck="false" class="lake-embed-input" value="" autocomplete="off"/>\n        </span>\n        <span class="lake-embed-button"><button class="lake-ui-button" data-role="submit"><span>',
        )
        .concat(
          Engine.StringUtils.escape(this.locale.submit),
          '</span></button></span>\n      </div>\n    </div>\n    ',
        ),
    );
    this.container.append(embedNode);
    this.find('url').on('keydown', this.handleInputKeydown);
    this.find('submit').on('click', this.handleSubmit);
  }

  renderEditView() {
    if (this.value.url) {
      super.renderEditView();
    } else this.renderInput();
  }
}

Url.type = 'block';
export default Url;
