/**
 * 绘制图片，矩形
 * @param canvasId
 * @param imageUrl
 * @param coordinates 矩形点信息（采用向右水平Y轴，垂直向下X轴的坐标系(反人类坐标系！！！，数据如此)， 左上右下对角点坐标）如：
 * [
 * [[0, 0], [10, 10]],
 * [[15, 15], [20, 20]],
 * ]
 * @param config 配置参数 ：
 * width canvas 宽 ，默认 675
 * height canvas 高 ，默认 875，优先 根据 高度进行缩放
 * offsetX 画图 x 轴偏移，默认 0
 * offsetY 画图 y 轴偏移，默认 0
 * rectBorderColor 矩形表框颜色， 默认 'red'
 * rectBackgroundColor 矩形背景色, 默认 'rgba(252,180,180,.2)'
 * center 是否图片居中， 默认居中
 */
import { getRgbStr } from './index';
import {
  checkSelectBoundary,
  getAnewXY,
  getCursorStyle,
  getDashPosition,
  getDotPosition,
  getMousePosition,
  handleMouseInfo,
} from './canvasUtil';

export class CanvasBox {
  // 绘制 矩形选框使用的变量
  // 是否可改变选框大小
  canChangeSelect = false

  // 重置选框
  resetSelect = false

  tempCursorIndex = null

  // 鼠标左键按下时起始位置
  initMousePosition = {}

  // 当前 鼠标位置的 标记值，默认选框外
  cursorIndex = 9

  selectPosition = { x: 0, y: 0, w: 0, h: 0 }

  mousePosition = []

  // canvas 使用的元素
  canvas

  img

  ctx

  ratio

  imageRealWidth

  imgRealHeight

  // 缩放比例
  zoom = 1

  constructor(canvasId, imageUrl, coordinates, config, useWidth, callback) {
    this.canvasId = canvasId;
    this.imageUrl = imageUrl;
    this.coordinates = coordinates;
    this.config = config;
    this.useWidth = useWidth;
    this.renderImg();
    this.resetSelectData();
    if (typeof callback === 'function') {
      this.finishedCallback = callback;
    }
  }

  resetSelectData() {
    this.canChangeSelect = false;
    this.resetSelect = false;
    this.tempCursorIndex = null;
    this.selectPosition = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    this.mousePosition = [];
    this.cursorIndex = 9;
    this.initMousePosition = {};
  }

  onMouseUp() {
    if (this.selectPosition.w < 0 || this.selectPosition.h < 0) {
      this.selectPosition = getAnewXY(this.selectPosition);
    }
    this.canChangeSelect = false;
    this.tempCursorIndex = null;
    if (this.selectPosition) {
      this.finishedCallback(this.selectPosition, this.zoom);
    }
  }

  omMouseDown(e) {
    if (this.cursorIndex === 9) {
      // 鼠标在选框外，重置选框
      this.resetSelect = true;
    }
    this.canChangeSelect = true;
    this.initMousePosition = {
      x: e.offsetX,
      y: e.offsetY,
    };
  }

  onMouseMove(e) {
    if (!this.ctx || !this.canvas) {
      return;
    }
    const { offsetX, offsetY } = e;
    const pathX = offsetX * this.ratio;
    const pathY = offsetY * this.ratio;
    let cursor = 'crosshair';
    this.cursorIndex = 9;

    for (let i = 0; i < this.mousePosition.length; i++) {
      if (checkInPath(this.ctx, pathX, pathY, this.mousePosition[i])) {
        cursor = getCursorStyle(i);
        this.cursorIndex = i;
        break;
      }
    }

    this.canvas.style.cursor = cursor;

    if (!this.canChangeSelect) {
      return;
    }

    if (this.resetSelect) {
      this.selectPosition = {
        x: this.initMousePosition.x,
        y: this.initMousePosition.y,
        w: 4,
        h: 4,
      };
      this.tempCursorIndex = 2;
      this.resetSelect = false;
    }

    const distanceX = offsetX - this.initMousePosition.x;
    const distanceY = offsetY - this.initMousePosition.y;

    this.selectPosition = handleMouseInfo(
      this.tempCursorIndex !== null ? this.tempCursorIndex : this.cursorIndex,
      this.selectPosition,
      { x: distanceX, y: distanceY }
    );
    this.selectPosition = checkSelectBoundary(this.canvas.width, this.canvas.height, this.selectPosition);

    this.mousePosition = drawSelect(this.selectPosition, this.ctx, this.img, this.canvas, this.mousePosition);

    if (this.tempCursorIndex === null) {
      this.tempCursorIndex = this.cursorIndex;
    }

    this.initMousePosition = {
      x: offsetX,
      y: offsetY,
    };
  }

  mousemove = e => this.onMouseMove(e)

  mouseup = e => this.onMouseUp(e)

  mousedown = e => this.omMouseDown(e)

  registerListener() {
    this.canvas.addEventListener('mousemove', this.mousemove);

    this.canvas.addEventListener('mouseup', this.mouseup);

    this.canvas.addEventListener('mousedown', this.mousedown);
  }

  unRegisterListener() {
    this.canvas.removeEventListener('mousemove', this.mousemove);
    this.canvas.removeEventListener('mouseup', this.mouseup);
    this.canvas.removeEventListener('mousedown', this.mousedown);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.resetSelectData();
    this.canvas.style.cursor = 'default';
    this.ctx.restore();
  }

  renderImg() {
    const config = handleConfig(this.config);
    // 检查坐标数据是否正确
    if (this.coordinates) {
      this.coordinates = this.checkCoordinates(this.coordinates);
    }

    this.canvas = document.getElementById(this.canvasId);
    if (this.canvas && this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');

      this.ratio = getPixelRatio(this.ctx);
      if (!this.imageUrl) {
        // 图片url为空
        const showWidth = 300;
        const showHeight = 150;
        this.canvas.width = showWidth * this.ratio;
        this.canvas.height = showHeight * this.ratio;
        this.canvas.style.width = `${showWidth}px`;
        this.canvas.style.height = `${showHeight}px`;
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '18px bold 黑体';
        this.ctx.fillStyle = config.rectBackgroundColor;
        this.ctx.scale(this.ratio, this.ratio);
        this.ctx.fillText('图片URL为空或截图坐标为空', 30, 75);
        return;
      }

      this.img = new Image();
      this.img.src = this.imageUrl;
      this.img.onload = () => {
        // 实际宽高，以及 宽高比
        this.imageRealWidth = this.img.width;

        this.imgRealHeight = this.img.height;

        // 如果设置了显示高度，优先 根据 高度进行缩放,
        let showHeight;
        let showWidth;
        if (!this.useWidth) {
          // 显示高度
          showHeight = config.height;
          // 显示/实际 缩放比
          this.zoom = showHeight / this.imgRealHeight;
          // 显示宽度
          showWidth = this.imageRealWidth * this.zoom;
          // 显示宽度 大于设定宽度， 再次按宽度缩放
          if (showWidth > config.width) {
            showWidth = config.width;
            // 宽度缩放
            this.zoom = showWidth / this.imageRealWidth;
            // 显示高度
            showHeight = this.imgRealHeight * this.zoom;
          }
        } else {
          // 显示高度
          showWidth = config.width;
          this.zoom = showWidth / this.imageRealWidth;
          showHeight = this.imgRealHeight * this.zoom;
          if (showHeight > config.height) {
            showHeight = config.height;
            this.zoom = showHeight / this.imgRealHeight;
            showWidth = this.imageRealWidth * this.zoom;
          }
        }

        // 1. 锁定显示宽高， 标准化画布宽高
        this.canvas.style.width = `${showWidth}px`;
        this.canvas.style.height = `${showHeight}px`;

        // 画布 宽 高
        this.canvas.width = showWidth * 2;
        this.canvas.height = showHeight * 2;

        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 绘画图片 不够清晰，使用原图
        this.ctx.drawImage(this.img, config.offsetX, config.offsetY, this.canvas.width, this.canvas.height);
        // 绘制矩形
        if (this.coordinates) {
          this.drawRect(this.coordinates, config);
        }
      };
    } else {
      console.error('cannot find dom with id=', this.canvasId);
    }
  }

  checkCoordinates(customCoordinates) {
    return customCoordinates.map((coordinate) => {
      if (coordinate && coordinate.length !== 2) {
        console.error('坐标数据格式不正确，每个矩形点，有两个点坐标');
        return null;
      }
      for (let j = 0; j < coordinate.length; j++) {
        const point = coordinate[j];
        if (point.length !== 2) {
          console.error('每个点坐标必须为：x,y两个数字');
          return null;
        }
        if (typeof point[0] !== 'number' || typeof point[1] !== 'number') {
          try {
            point[0] = Number(point[0]);
            point[1] = Number(point[1]);
          } catch (e) {
            console.error(e);
            return null;
          }
        }
      }
      return coordinate;
    }).filter(s => !!s);
  }

  drawRect(coordinates, config) {
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      const pos = {
        leftTopX: coordinate[0][0],
        leftTopY: coordinate[0][1],
        rightBottomX: coordinate[1][0],
        rightBottomY: coordinate[1][1],
      };
      let x = (pos.leftTopY + config.offsetX) * this.zoom;
      let y = (pos.leftTopX + config.offsetY) * this.zoom;
      let recH = (pos.rightBottomX - pos.leftTopX) * this.zoom;
      let recW = (pos.rightBottomY - pos.leftTopY) * this.zoom;
      // 防止矩形越出绘图边界
      if (x + recW >= (this.imageRealWidth + config.offsetX - 10)) {
        x += 10;
        recW = this.imageRealWidth - 22;
      } else if (x <= 0) {
        x += 10;
        recW -= 10;
      }
      if (y + recH >= this.imgRealHeight + config.offsetY - 10) {
        y += 10;
        recH = this.imgRealHeight - 22;
      } else if (y <= 0) {
        y += 10;
        recH -= 10;
      }
      this.ctx.save();
      this.ctx.scale(2, 2);
      this.ctx.strokeStyle = config.rectBorderColor;
      this.ctx.strokeRect(x, y, recW, recH);
      this.ctx.fillStyle = config.rectBackgroundColor;
      this.ctx.fillRect(x, y, recW, recH);
      this.ctx.restore();
    }
  }
}

/**
 * 绘制矩形选择框
 * @param selectPosition
 * @param ctx
 * @param img
 * @param canvas
 * @param mousePosition
 */
const drawSelect = (selectPosition, ctx, img, canvas, mousePosition) => {
  const { x, y, w, h } = selectPosition;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 绘制 蒙层
  drawCover(ctx, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(2, 2);
  ctx.clearRect(x, y, w, h);
  ctx.strokeStyle = '#5696f8';
  // 画选中框
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = '#5696f8';
  const dots = getDotPosition(x, y, w, h);
  dots.map(v => ctx.fillRect(...v));

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(86, 150, 246, .75)';
  const dashs = getDashPosition(x, y, w, h);
  dashs.forEach((v) => {
    ctx.beginPath();
    ctx.setLineDash([2, 4]);
    ctx.moveTo(v[0], v[1]);
    ctx.lineTo(v[2], v[3]);
    ctx.closePath();
    ctx.stroke();
  });
  ctx.restore();
  drawImage(ctx, img, canvas.width, canvas.height);

  mousePosition = getMousePosition(x, y, w, h);
  mousePosition.push([selectPosition.x, selectPosition.y, selectPosition.w, selectPosition.h]);
  return mousePosition;
};

/**
 * 判断x,y是否在select路径上
 * @param ctx
 * @param pathX
 * @param pathY
 * @param rectPosition
 */
const checkInPath = (ctx, pathX, pathY, rectPosition) => {
  ctx.beginPath();
  ctx.rect(...rectPosition);
  const result = ctx.isPointInPath(pathX, pathY);
  ctx.closePath();
  return result;
};

/**
 * 绘制图片
 * @param ctx
 * @param img
 * @param dw
 * @param dh
 */
const drawImage = (ctx, img, dw, dh) => {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(img, 0, 0, dw, dh);
  ctx.restore();
};

/**
 * 获取 设备物理像素分辨率比 / 渲染canvas之前会用几个像素来存储画布
 * @param ctx
 * @returns {number}
 */
const getPixelRatio = (ctx) => {
  const backingStore = ctx.backingStorePixelRatio
    || ctx.webkitBackingStorePixelRatio
    || ctx.mozBackingStorePixelRatio
    || ctx.msBackingStorePixelRatio
    || ctx.oBackingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};

/**
 * 绘制 蒙层
 * @param ctx
 * @param width
 * @param height
 */
const drawCover = (ctx, width, height) => {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-atop';
  ctx.restore();
};

// 处理配置参数
const handleConfig = (config) => {
  if (!config) {
    return {
      width: 675,
      height: 400,
      offsetX: 0,
      offsetY: 0,
      rectBorderColor: '#7d7fff',
      rectBackgroundColor: 'rgba(28,165,255,0.2)',
      // 默认居中
      center: true,
    };
  }
  const width = config.width && typeof config.width === 'number' ? config.width : 675;
  const height = config.height && typeof config.height === 'number' ? config.height : 400;
  const offsetX = config.offsetX && typeof config.offsetX === 'number' ? config.offsetX : 0;
  const offsetY = config.offsetY && typeof config.offsetY === 'number' ? config.offsetY : 0;
  const rectBorderColor = config.color && typeof config.color === 'string' ? config.color : 'blue';
  let rectBackgroundColor = 'rgba(28,165,255,0.2)';
  if (config.rectBackgroundColor && config.rectBackgroundColor.startsWith('#')) {
    rectBackgroundColor = `rgba(${getRgbStr(config.rectBackgroundColor)},0.2)`;
  } else if (rectBorderColor.startsWith('#')) {
    rectBackgroundColor = `rgba(${getRgbStr(rectBorderColor)},0.2)`;
  }
  const center = typeof config.center === 'boolean' ? config.center : true;
  return {
    width,
    height,
    offsetX,
    offsetY,
    rectBorderColor,
    rectBackgroundColor,
    center,
  };
};
