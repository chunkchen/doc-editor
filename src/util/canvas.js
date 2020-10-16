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
 * height canvas 高 ，默认 875
 * offsetX 画图 x 轴偏移，默认 0
 * offsetY 画图 y 轴偏移，默认 0
 * rectBorderColor 矩形表框颜色， 默认 'red'
 * rectBackgroundColor 矩形背景色, 默认 'rgba(252,180,180,.2)'
 * center 是否图片居中， 默认居中
 */

export function renderCanvas(canvasId, imageUrl, coordinates, config) {
  config = handleConfig(config);
  // 检查坐标数据是否正确
  if (coordinates) {
    coordinates = coordinates.filter(s => !!s);
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      if (coordinate && coordinate.length !== 2) {
        console.error('坐标数据格式不正确，每个矩形点，有两个点坐标');
        return;
      }
      for (let j = 0; j < coordinate.length; j++) {
        const point = coordinate[j];
        if (point.length !== 2) {
          console.error('每个点坐标必须为：x,y两个数字');
          return;
        }
        if (typeof point[0] !== 'number' || typeof point[1] !== 'number') {
          point[0] = Number(point[0]);
          point[1] = Number(point[1]);
          // console.error('坐标x,y应为数字类型')
          // return
        }
      }
    }
  }

  const canvas = document.getElementById(canvasId);
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');

    const ratio = window.devicePixelRatio || 1;
    if (!imageUrl) {
      // 图片url为空
      const showWidth = 300;
      const showHeight = 150;
      canvas.width = showWidth * ratio;
      canvas.height = showHeight * ratio;
      canvas.style.width = `${showWidth}px`;
      canvas.style.height = `${showHeight}px`;
      ctx.textBaseline = 'middle';
      ctx.font = '18px bold 黑体';
      ctx.fillStyle = '#b3c1bd';
      ctx.scale(ratio, ratio);
      ctx.fillText('图片URL为空或截图坐标为空', 30, 75);
      return;
    }

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // 实际宽高，以及 宽高比
      const imageRealWidth = img.width;
      const imgRealHeight = img.height;

      // 画布 宽 高
      canvas.width = imageRealWidth;
      canvas.height = imgRealHeight;

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 如果设置了显示高度，优先 根据 高度进行缩放,
      let showHeight;
      let showWidth;
      // 显示高度
      showHeight = config.height;
      // 高度缩放
      const heightZoom = showHeight / imgRealHeight;
      // 显示宽读
      showWidth = imageRealWidth * heightZoom;
      // 显示宽度 大于设定宽度， 再次按宽度缩放
      if (showWidth > config.width) {
        showWidth = config.width;
        // 宽度缩放
        const widthZoom = showWidth / imageRealWidth;
        // 显示高度
        showHeight = imgRealHeight * widthZoom;
      }

      // 1. 锁定显示宽高， 标准化画布宽高
      canvas.style.width = `${showWidth}px`;
      canvas.style.height = `${showHeight}px`;

      // 绘画图片
      ctx.drawImage(img, config.offsetX, config.offsetY, canvas.width, canvas.height);
      if (coordinates) {
        coordinates.forEach((coordinate) => {
          // 绘制矩形
          const pos = {
            leftTopX: coordinate[0][0],
            leftTopY: coordinate[0][1],
            rightBottomX: coordinate[1][0],
            rightBottomY: coordinate[1][1],
          };
          const y = pos.leftTopX + config.offsetY;
          const x = pos.leftTopY + config.offsetX;
          let recH = pos.rightBottomX - pos.leftTopX;
          let recW = pos.rightBottomY - pos.leftTopY;
          // 防止矩形越出绘图边界
          if (x + recW > (img.width + config.offsetX)) {
            recW = img.width - 2;
          }
          if (y + recH > img.height + config.offsetY) {
            recH = img.height - 2;
          }
          ctx.strokeStyle = config.rectBorderColor;
          ctx.strokeRect(x, y, recW, recH);
          ctx.fillStyle = config.rectBackgroundColor;
          ctx.fillRect(x, y, recW, recH);
          ctx.stroke();
        });
      }
    };
  } else {
    console.error('cannot find dom with id=', canvasId);
  }
}

// 处理配置参数
function handleConfig(config) {
  if (!config) {
    return {
      width: 675,
      height: 400,
      offsetX: 0,
      offsetY: 0,
      rectBorderColor: 'blue',
      rectBackgroundColor: 'rgba(28,165,255,0.2)',
      // 默认居中
      center: true,
    };
  }
  const width = config.width;
  const height = config.height;
  const offsetX = config.offsetX;
  const offsetY = config.offsetY;
  const rectBorderColor = config.rectBorderColor;
  const rectBackgroundColor = config.rectBackgroundColor;
  const center = config.center;
  return {
    width: width && typeof width === 'number' ? width : 675,
    height: height && typeof height === 'number' ? height : 400,
    offsetX: offsetX && typeof offsetX === 'number' ? offsetX : 0,
    offsetY: offsetY && typeof offsetY === 'number' ? offsetY : 0,
    rectBorderColor: rectBorderColor && typeof rectBorderColor === 'string' ? rectBorderColor : 'blue',
    rectBackgroundColor: rectBackgroundColor && typeof rectBackgroundColor === 'string' ? rectBackgroundColor : 'rgba(28,165,255,0.2)',
    center: center && typeof center === 'boolean' ? center : true,
  };
}
