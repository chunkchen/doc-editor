import Util from '../util';

const Mixin = {};
Mixin.CFG = {
  labelEditable: false,
};
Mixin.INIT = '_initLabelEditor';
Mixin.AUGMENT = {
  _initLabelEditor() {
    const labelEditable = this.get('labelEditable');
    if (labelEditable) {
      const graph = this.getGraph();
      const labelTextArea = Util.createDOM(
        '<div contenteditable="true" role="textbox" tabindex="1" class="g6-label-editor"></div>',
        {
          position: 'absolute',
          visibility: 'hidden',
          'z-index': '2',
          padding: '0px 2px 0px 0px',
          resize: 'none',
          width: 'auto',
          height: 'auto',
          outline: 'none',
          top: '0',
          left: '0',
          border: '1px solid #1890FF',
          'transform-origin': 'left top',
          'max-width': '320px',
          background: 'white',
          'box-sizing': 'content-box',
        },
      );
      graph.getGraphContainer().appendChild(labelTextArea);
      this.isCompositing = false;
      labelTextArea.on('compositionstart', () => {
        this.isCompositing = true;
      });
      labelTextArea.on('compositionend', () => {
        this.isCompositing = false;
      });
      labelTextArea.on('blur', (ev) => {
        ev.stopPropagation();
        if (!graph.destroyed) {
          this.endEditLabel();
        }
      });
      labelTextArea.on('keydown', (ev) => {
        ev.stopPropagation();
        const key = Util.getKeyboradKey(ev);
        if ((ev.metaKey && key === 's') || (ev.ctrlKey && key === 's')) {
          ev.preventDefault();
        }
        if ((key === 'Enter' || key === 'Escape') && !this.isCompositing) {
          this.endEditLabel();
        }
      });
      this.set('labelTextArea', labelTextArea);
      graph.on('beforeviewportchange', () => {
        if (labelTextArea.focusItem) {
          this.setLabelEditorBeginPosition(labelTextArea.focusItem);
        }
      });
    }
  },
  _getLabelTextAreaBox(labelShape, labelText) {
    const padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];

    if (labelText) {
      labelShape.attr('text', labelText);
    }

    const graph = this.getGraph();
    const rootGroup = graph.getRootGroup();
    const labelBox = Util.getBBox(labelShape, rootGroup);
    return {
      minX: labelBox.minX - padding[1],
      minY: labelBox.minY - padding[0],
      maxX: labelBox.maxX + padding[1],
      maxY: labelBox.maxY + padding[0],
    };
  },
  setLabelEditorBeginPosition(item) {
    const labelTextArea = this.get('labelTextArea');
    const labelShape = item.getLabel();

    if (labelShape) {
      const labelBox = this._getLabelTextAreaBox(labelShape);

      const lineHeight = labelShape.attr('lineHeight');
      const fontSize = labelShape.attr('fontSize');
      const labelPoint = {
        x: labelBox.minX,
        y: labelBox.minY - lineHeight / 4 + fontSize / 4 - 1,
        width: labelBox.maxX - labelBox.minX,
        height: labelBox.maxY - labelBox.minY,
      };
      labelTextArea.css({
        top: `${labelPoint.y}px`,
        left: `${labelPoint.x}px`,
      });
      labelTextArea.labelPoint = labelPoint;
    } else {
      const graph = this.getGraph();
      const rootGroup = graph.getRootGroup();
      const keyShape = item.getKeyShape();
      const keyShapeBox = Util.getBBox(keyShape, rootGroup);
      const _labelPoint = {
        x: keyShapeBox.minY + (keyShapeBox.maxY - keyShapeBox.minY - labelTextArea.height()) / 2,
        y: (keyShapeBox.minX + keyShapeBox.maxX) / 2,
      };
      labelTextArea.css({
        top: `${_labelPoint.x}px`,
        left: `${_labelPoint.y}px`,
      });
      labelTextArea.labelPoint = _labelPoint;
    }
  },
  beginEditLabel(item) {
    const labelTextArea = this.get('labelTextArea');
    const graph = this.getGraph();

    if (Util.isString(item)) {
      item = graph.find(item);
    }

    if (item && !item.destroyed && labelTextArea) {
      this.setSignal('preventWheelPan', true);
      const model = item.getModel();
      const labelShape = item.getLabel();
      const zoom = graph.getZoom();
      labelTextArea.focusItem = item;

      if (labelShape) {
        const lineHeight = labelShape.attr('lineHeight');
        const labelBox = this._getLabelTextAreaBox(labelShape);
        const minWidth = (labelBox.maxX - labelBox.minX) / zoom;
        const minHeight = (labelBox.maxY - labelBox.minY + lineHeight / 4) / zoom;
        labelTextArea.innerHTML = model.label;
        labelTextArea.css({
          'min-width': `${minWidth}px`,
          'min-height': `${minHeight}px`,
          visibility: 'visible',
          'font-family': labelShape.attr('fontFamily'),
          'line-height': `${lineHeight}px`,
          'font-size': `${labelShape.attr('fontSize')}px`,
          transform: `scale(${zoom})`,
        });
      } else {
        labelTextArea.innerHTML = '';
        labelTextArea.css({
          'min-width': 'auto',
          'min-height': 'auto',
        });
      }

      this.setLabelEditorBeginPosition(item);
      labelTextArea.css({
        visibility: 'visible',
      });
      labelTextArea.focus();
      document.execCommand('selectAll', false, null);
    }
  },
  endEditLabel() {
    const labelTextArea = this.get('labelTextArea');
    this.setSignal('preventWheelPan', false);

    if (labelTextArea) {
      const item = labelTextArea.focusItem;

      if (item && !item.destroyed) {
        const model = item.getModel();
        const editor = this.editor;

        if (model.label !== labelTextArea.textContent) {
          editor.executeCommand('update', {
            action: 'updateLabel',
            itemId: item.id,
            updateModel: {
              label: labelTextArea.textContent,
            },
          });
        }

        labelTextArea.hide();
        labelTextArea.focusItem = undefined;
        this.focusGraphWrapper();
      }
    }
  },
  cancelEditLabel() {
    const labelTextArea = this.get('labelTextArea');
    labelTextArea.focusItem = undefined;
    labelTextArea.hide();
  },
};
export default Mixin;
