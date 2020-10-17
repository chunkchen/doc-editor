import ReactDOM from 'react-dom';
import { message } from 'antd';
import SectionBase from '../base';
import 'antd/lib/message/style';
import { getHeight } from '../../utils/dom';
import local from './local';

class Embed extends SectionBase {
  constructor(cfg) {
    super(cfg);
    this.options = {
      minHeight: 80,
      defaultHeight: 136,
      transition: 'all 0.3s linear',
      resize: true,
      ...cfg,
    };
    return this;
  }

  isError() {
    return false;
  }

  getHeight() {
    return this.value.height || this.options.defaultHeight;
  }

  renderError() {
  }

  addIframeItem() {
    const iframeHelper = this.getViewEngine().iframeHelper;
    this.iframeItem = {};
    return !iframeHelper || iframeHelper.add(this.iframeItem);
  }

  renderIframe(iframe, url, width) {
    const engine = this.getViewEngine();
    if (engine.iframeHelper) {
      this.iframeItem.iframe = iframe;
      this.iframeItem.url = url;
      engine.iframeHelper.render(this.iframeItem, width, this.state.readonly);
    } else {
      iframe.attr('src', url);
    }
  }

  hitBlack = () => {
    return true;
  }

  activate() {
    this.showRisizeController();
    this.hideMask();
  }

  unactivate() {
    this.hideRisizeController();
    this.showMask();
    if (this.engine) {
      this.engine.sidebar.restore();
    }
  }

  renderResizeController() {
    let height; let moveHeight; let
      dragBegin;
    const { minHeight } = this.options;
    this.resizeController = this.createResizeController({
      container: this.root,
      dragstart: () => {
        height = getHeight(this.iframe[0]);
        this.iframe.css('transition', 'none');
        this.showMask();
        dragBegin = true;
      },
      dragmove: (currentHeight) => {
        moveHeight = height + currentHeight;
        moveHeight = moveHeight >= minHeight ? moveHeight : minHeight;
        this.iframe.css('height', `${moveHeight}px`);
        this.iframe.attr('data-height', moveHeight);
      },
      dragend: () => {
        this.iframe.css('transition', this.transition);
        if (dragBegin) {
          this.hideMask();
          dragBegin = undefined;
          this.setValue({
            height: getHeight(this.iframe[0]),
          });
        }
        moveHeight = undefined;
      },
    });
    if (this.state.activated !== true) this.hideRisizeController();
  }

  showMask() {
    if (this.mask) this.mask.show();
  }

  hideMask() {
    if (this.mask) this.mask.hide();
  }

  showRisizeController() {
    if (this.resizeController) this.resizeController.show();
  }

  hideRisizeController() {
    if (this.resizeController) this.resizeController.hide();
  }

  _removeIframe() {
    const engine = this.getViewEngine();
    if (this.iframeItem && engine.iframeHelper) {
      engine.iframeHelper.remove(this.iframeItem);
      this.iframeItem = undefined;
    }
  }

  destroy() {
    this._removeIframe();
    super.destroy.call(this);
  }

  clear() {
    this._removeIframe();
    ReactDOM.unmountComponentAtNode(this.container[0]);
    this.container.empty();
    this.removeEvent();
  }

  saveValue() {
    if (this.iframe) {
      this.setValue({
        height: getHeight(this.iframe[0]),
      });
    }
  }

  getEmbedEmbedTitle() {
    return '';
  }

  renderOverLimitView() {
    this.container.append(
      '<div style="\n      background: #fafafa; \n      border: 1px solid #d9d9d9; \n      color: rgba(0,0,0,0.45);\n      text-align: center;\n      padding: 0 12px;\n    ">\n      <p style="margin-bottom: 22px; padding-top: 4px; text-align: left; color: rgba(0,0,0,.65)">'
        .concat(
          this.getEmbedEmbedTitle(),
          '</p>\n      <p style="margin-bottom: 8px;"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjhweCIgaGVpZ2h0PSIyNnB4IiB2aWV3Qm94PSIwIDAgMjggMjYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5lcnJvci1maWxsPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IuaWsOe8lui+keWZqC0tLeesrOS4ieacny0tLeW1jOWFpeWNoeeJhyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgb3BhY2l0eT0iMC40NSI+CiAgICAgICAgPGcgaWQ9IjI4Yi3ltYzlhaXljaHniYct6K+t6ZuA5paH5qGjLWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MDAuMDAwMDAwLCAtODM5LjAwMDAwMCkiIGZpbGw9IiMwMDAwMDAiPgogICAgICAgICAgICA8ZyBpZD0iQml0bWFwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNDUuMDAwMDAwLCA3ODguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iZXJyb3ItZmlsbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzUzLjAwMDAwMCwgNDguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgb3BhY2l0eT0iMCIgeD0iMCIgeT0iMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI5Ljg2NTYyNSwyNi43NSBMMTYuODY1NjI1LDQuMjUgQzE2LjY3MTg3NSwzLjkxNTYyNSAxNi4zMzc1LDMuNzUgMTYsMy43NSBDMTUuNjYyNSwzLjc1IDE1LjMyNSwzLjkxNTYyNSAxNS4xMzQzNzUsNC4yNSBMMi4xMzQzNzUsMjYuNzUgQzEuNzUsMjcuNDE4NzUgMi4yMzEyNSwyOC4yNSAzLDI4LjI1IEwyOSwyOC4yNSBDMjkuNzY4NzUsMjguMjUgMzAuMjUsMjcuNDE4NzUgMjkuODY1NjI1LDI2Ljc1IFogTTE1LDEzIEMxNSwxMi44NjI1IDE1LjExMjUsMTIuNzUgMTUuMjUsMTIuNzUgTDE2Ljc1LDEyLjc1IEMxNi44ODc1LDEyLjc1IDE3LDEyLjg2MjUgMTcsMTMgTDE3LDE4Ljc1IEMxNywxOC44ODc1IDE2Ljg4NzUsMTkgMTYuNzUsMTkgTDE1LjI1LDE5IEMxNS4xMTI1LDE5IDE1LDE4Ljg4NzUgMTUsMTguNzUgTDE1LDEzIFogTTE2LDI0IEMxNS4xNzE4NzUsMjQgMTQuNSwyMy4zMjgxMjUgMTQuNSwyMi41IEMxNC41LDIxLjY3MTg3NSAxNS4xNzE4NzUsMjEgMTYsMjEgQzE2LjgyODEyNSwyMSAxNy41LDIxLjY3MTg3NSAxNy41LDIyLjUgQzE3LjUsMjMuMzI4MTI1IDE2LjgyODEyNSwyNCAxNiwyNCBaIiBpZD0iU2hhcGUiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="/></p>\n      <p>',
        )
        .concat(this.locale.canNotShowSection, '</p>\n      <p style="margin-bottom: 40px">')
        .concat(this.getiframeOverLimitSectionViewTips(), '</p>\n    </div>'),
    );
  }

  getUrl() {
  }

  getiframeOverLimitSectionViewTips() {
    const engine = this.getViewEngine();
    if (engine.iframeHelper) {
      return this.locale.iframeOverLimitSectionView.replace(
        '${limit}',
        engine.iframeHelper.options.limit,
      );
    }
  }

  getiframeOverLimitTips() {
    const engine = this.getViewEngine();
    if (engine.iframeHelper) {
      return this.locale.iframeOverLimit.replace('${limit}', engine.iframeHelper.options.limit);
    }
  }

  renderView() {
    const lang = this.getLang();
    this.locale = local[lang];
    const src = this.getUrl();
    this.clear();
    if (this.isError()) {
      this.renderError();
    } else if (this.addIframeItem()) {
      if (src && this.hitBlack(src)) {
        message.error(this.locale.validUrl);
      } else if (this.state.readonly) {
        this.renderReadView();
      } else {
        this.renderEditView();
        this.bindEvent(this.engine, 'save:before', () => {
          return this.saveValue();
        });
      }
    } else if (src) {
      this.renderOverLimitView();
    } else {
      message.error(this.getiframeOverLimitTips());
      this.remove();
    }
  }

  render() {
    const lang = this.getLang();
    this.locale = local[lang];
    this.value = this.value || {};
    this.renderView();
    this.container.css('border', '1px solid #d9d9d9');
  }
}

export default Embed;
