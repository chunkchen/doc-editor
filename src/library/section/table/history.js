const MAX_UNDO_COUNT = 100;

class History {
  constructor(section) {
    this.section = section;
    this.data = [];
    this.index = 0;
  }

  undo() {
    if (this.index === 0) return;
    this.index--;
    this.section.reRender(this.data[this.index]);
  }

  redo() {
    if (!this.data[this.index + 1]) return;
    this.index++;
    this.section.reRender(this.data[this.index]);
  }

  isEnd() {
    return this.index >= this.data.length - 1;
  }

  clear() {
    this.data = [];
    this.index = 0;
  }

  save(value) {
    if (this.data[this.index]) {
      this.index++;
    }
    this.data = this.data.slice(0, this.index);
    if (this.data.length >= MAX_UNDO_COUNT) {
      this.data.shift();
      this.index--;
    }
    this.data[this.index] = value;
    this.index++;
  }
}

export default History;
