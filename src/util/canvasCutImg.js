/**
 * 根据给定的 坐标信息 coordinates， 显示剪裁部分 图片
 * @param canvasId 被渲染 canvas dom id
 * @param imageUrl 图片url
 * @param coordinate 截图区域坐标
 * @param width 显示宽
 */
export function drawCutImg(canvasId, imageUrl, coordinate, width) {
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
  const canvas = document.getElementById(canvasId);
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');

    const ratio = window.devicePixelRatio || 1;

    if (!imageUrl || !coordinate) {
      // 图片url为空
      const showHeight = 80;
      canvas.width = width * ratio;
      canvas.height = showHeight * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${showHeight}px`;
      ctx.textBaseline = 'middle';
      ctx.font = '18px bold 黑体';
      ctx.fillStyle = '#b3c1bd';
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(ratio, ratio);
      ctx.fillText('图片URL为空或截图坐标为空', (width - 240) / 2, 38);
      return;
    }

    canvas.width = coordinate[1][1] - coordinate[0][1];
    canvas.height = coordinate[1][0] - coordinate[0][0];

    // x 轴偏移（横轴向右）
    const sx = coordinate[0][1];
    // y 轴偏移（竖轴乡下）
    const sy = coordinate[0][0];

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const realWidth = img.width;
      const realHeight = img.height;
      // 防止越界
      canvas.width = Math.min(realWidth - sx, canvas.width);
      canvas.height = Math.min(realHeight - sy, canvas.height);

      // 显示 宽度缩放比
      const widthZoom = width / (canvas.width);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${canvas.height * widthZoom}px`;

      // 清空画布
      ctx.clearRect(0, 0, canvas.width * ratio, canvas.height * ratio);
      ctx.drawImage(img, sx, sy, canvas.width * ratio, canvas.height * ratio, 0, 0, canvas.width * ratio, canvas.height * ratio);
    };
  }
}
