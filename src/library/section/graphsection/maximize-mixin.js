export default {
  maximize() {
    this.activate();
    const page = this.page;
    this.restoreWidth = page.getWidth();
    this.restoreHeight = page.getHeight();
    this.restoreMatrix = page.getMatrix();
    page.forceFit();
    page.setFitView('cc');
    this.state.maximize = true;
  },
  restore() {
    const page = this.page;
    page.changeSize(this.restoreWidth, this.restoreHeight);
    page.updateMatrix(this.restoreMatrix);
    this.value.width = this.restoreWidth;
    this.value.width = this.restoreHeight;
    this.value.matrix = this.restoreMatrix;
    this.state.maximize = false;
  },
};
