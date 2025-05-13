/*
 * @param {string} canvasID - ID of canvas element
 * @param {number[]} yAxis - Array of y-axis values to plot
 * @param {Object} [options = {}] - Additional options for the graph
 * @param {number[]} options.xAxis - Array of x-axis values
 * @param {string} options.color - Color of the line
 * @param {string} options.backgroundColor - Background color of the graph
 * @param {number} options.lineWidth - Width of the line
 * @param {number} options.pointRadius - Radius of the points
 * @param {boolean} options.showPoint - Whether to show points
 * @param {number} options.padding - Padding around the graph
 * @param {string} options.gridColor - Color of the grid lines
 * @param {string} options.title - Title of the graph
 * @param {string} options.xlab - label of x-axis
 * @param {string} options.ylab - label of y-axis
 */

export function plotLineGraph(canvasID, yAxis, options = {}) {
  const canvas = document.getElementById(canvasID);
  if (!canvas) {
    console.error('Canvas with ID "${ canvasId }" not found.');
    return;
  }

  const ctx = canvas.getContext("2d");

  const defaultOptions = {
    xAxis: Array.from({ length: yAxis.length }, (_, i) => i + 1),
    color: "blue",
    backgroundColor: "#fff",
    lineWidth: 2,
    pointRadius: 4,
    showPoint: true,
    padding: 20,
    gridColor: "#ccc",
    title: "",
    xlab: "",
    ylab: "",
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const {
    xAxis,
    color,
    backgroundColor,
    lineWidth,
    pointRadius,
    showPoint,
    padding,
    gridColor,
    title,
    xlab,
    ylab,
  } = mergedOptions;

  if (xAxis.length != yAxis.length) {
    console.error("x-axis and y-axis must have same length");
    return;
  }

  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const xMin = Math.min(...xAxis);
  const xMax = Math.max(...xAxis);
  const yMin = Math.min(...yAxis);
  const yMax = Math.max(...yAxis);

  const plotWidth = canvas.width - 2 * padding;
  const plotHeight = canvas.height - 2 * padding;

  if (title) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(title, canvas.width / 2, padding / 2);
  }

  // Implementation of plotLineGraph function
  const xScale = (value) =>
    padding + ((value - xMin) * plotWidth) / (xMax - xMin || 1);
  const yScale = (value) =>
    canvas.height -
    padding -
    ((value - yMin) * plotHeight) / (yMax - yMin || 1);

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;

  const yStep = (yMax - yMin) / 5;
  for (let i = 0; i <= 5; i++) {
    const y = yMin + i * yStep;
    const canvasY = yScale(y);

    ctx.beginPath();
    ctx.moveTo(padding, canvasY);
    ctx.lineTo(canvas.width - padding, canvasY);
    ctx.stroke();

    //draw label for y axis
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(y.toFixed(1), padding - 5, canvasY + 4);
  }

  const xStep = (xMax - xMin) / 5;
  for (let i = 0; i <= 5; i++) {
    const x = xMin + i * xStep;
    const canvasX = xScale(x);

    ctx.beginPath();
    ctx.moveTo(canvasX, canvas.height - padding);
    ctx.lineTo(canvasX, padding);
    ctx.stroke();

    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(x.toFixed(1), canvasX, canvas.height - padding + 15);
  }

  //axis
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;

  //yaxis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.stroke();

  //xaxis
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  if (xlab) {
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(xlab, canvas.width / 2, canvas.height - padding / 2);
  }

  if (ylab) {
    ctx.save();
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(ylab, 0, 0);
    ctx.restore();
  }

  //plot the point and connect them
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  for (let i = 0; i < xAxis.length; i++) {
    const canvasX = xScale(xAxis[i]);
    const canvasY = yScale(yAxis[i]);

    if (i === 0) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }

    ctx.stroke();
  }

  if (showPoint) {
    ctx.fillStyle = color;

    for (let i = 0; i < xAxis.length; i++) {
      const canvasX = xScale(xAxis[i]);
      const canvasY = yScale(yAxis[i]);

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  return canvas;
}
