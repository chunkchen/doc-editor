const Mixin = {};
Mixin.AUGMENT = {
  updateStatus() {
    const selectedItems = this.getSelected();
    let status;

    if (selectedItems.length === 0) {
      status = 'canvas-selected';
    } else if (selectedItems.length === 1) {
      if (selectedItems[0].isNode) {
        status = 'node-selected';
      } else if (selectedItems[0].isEdge) {
        status = 'edge-selected';
      } else if (selectedItems[0].isGroup) {
        status = 'group-selected';
      }
    } else {
      status = 'multi-selected';
    }

    this.emit('statuschange', {
      status,
    });
  },
};
export default Mixin;
