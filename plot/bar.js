/*
 * @param {string} canvasID  -ID of canvas
 * @param {string[]} categories  -Array of category labels
 * @param {Arrray<Array<number>>} data - Array of data upto 3
 * @param {Object} [options = {}]  -Additional options
 * @param {string[]} options.colors  - Array of colours
 * @param {string} options.backgroundColor - background colour
 * @param {number} options.barwidth  - width of bars as fractions of available space
 * @param {number} options.padding - padding around the graph
 * @param {string} options.gridColor - colour of the grid lines
 * @param {string} options.title - title of the graph
 * @param {string} options.xlab  - label of x-axis
 * @param {string} options.ylab  - label of y-axis
 * @param {boolean} options.gridLines  - to make grid lines visible
 * @param {string[]} options.legend  - Array of labels for the legend
 * @param {boolean} options.showLegend - whether to show the legend
 * @param {boolean} options.showValues - whether to show the values on bars
 */

export function plotBarGraph(canvasID, categories, data, options = {}) {
  const canvas = document.getElementById(canvasID);
  if (!canvas) {
    console.log('canvas with ID "${canvasID}" not found.');
    return;
  }

  //validate data(upto 3 series)
  if (!Array.isArray(data) || data.length === 0 || data.length > 3) {
    console.error("Data must be array of 1-3 data series.");
    return;
  }

  //make sure all data have same length as categories
  for (const series of data) {
    if (!Array.isArray(series) || series.length !== categories.length) {
      console.error("Each data series must have same length.");
      return;
    }
  }

  const ctx = canvas.getContext("2d");

  const defaultOptions = {
    colors: ["#4285F4", "#EA4335", "#FBBC05"],
    backgroundColor: "#fff",
    barWidth: 0.7,
    padding: 60,
    gridColor: "#ccc",
    title: "",
    xlab: "",
    ylab: "",
    gridLines: false,
    legend: data.map((_, i) => "Series ${i+1}"), //default legend
    showLegend: data.length > 1,
    showValues: true,
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const {
    colors,
    backgroundColor,
    barWidth,
    padding,
    gridColor,
    title,
    xlab,
    ylab,
    gridLines,
    legend,
    showLegend,
    showValues,
  } = mergedOptions;

  //clear the canvasID
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //set backgroundColor
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //find the maximum value for scaling
  let allValues = [];
  for (let i = 0; i < data.length; i++) {
    allValues = allValues.concat(data[i]);
  }
  const yMin = 0;
  const yMax = Math.max(...allValues) * 1.1; //adding a little headroom

  const plotWidth = canvas.width - 2 * padding;
  const plotHeight = canvas.height - 2 * padding;

  //draw title if provided
  if (title) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, padding / 2);
  }

  //scale y-values to canvas coords
  const yScale = (value) =>
    canvas.height -
    padding -
    ((value - yMin) * plotHeight) / (yMax - yMin || 1);

  //drawing gridlines and labels for yAxis
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;

  const yStep = yMax / 5;
  for (let i = 0; i <= 5; i++) {
    const y = i * yStep;
    const canvasY = yScale(y);

    if (gridLines) {
      ctx.beginPath();
      ctx.moveTo(padding, canvasY);
      ctx.lineTo(canvas.width - padding, canvasY);
      ctx.stroke();
    }

    ctx.font = "12px Sans-Serif";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "right";
    ctx.fillText(y.toFixed(1), padding - 10, canvasY + 4);
  }

  //draw axes
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;

  //y-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.stroke();

  //x-axis
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.width - padding);
  ctx.stroke();

  //draw axis labels
  if (xlab) {
    ctx.font = "12px Sans-Serif";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "right";
    ctx.fillText(xlab, canvas.width / 2, canvas.height - padding / 3);
  }

  if (ylab) {
    ctx.save();
    ctx.font = "12px Sans-Serif";
    ctx.fillStyle = "#000000";
    ctx.translate(padding / 3, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(ylab, 0, 0);
    ctx.restore();
  }

  //calc bar dimensions
  const numBars = data.length;
  const categoryWidth = plotWidth / categories.length;
  const groupWidth = categoryWidth * barWidth;
  const singleBarWidth = groupWidth / numBars;

  //draw bars with borders
  for (let catIndex = 0; catIndex < categories.length; catIndex++) {
    const categoryX =
      padding + catIndex * categoryWidth + (categoryWidth - groupWidth) / 2;

    //draw each data series for each category
    for (let seriesIndex = 0; seriesIndex < data.length; seriesIndex++) {
      const value = data[seriesIndex][catIndex];
      const barHeight = ((value - yMin) * plotHeight) / (yMax - yMin || 1);
      const barX = categoryX + seriesIndex * singleBarWidth;

      ctx.fillStyle = colors[seriesIndex % colors.length];

      //draw the bar
      ctx.fillRect(
        barX,
        canvas.height - padding - barHeight,
        singleBarWidth,
        barHeight,
      );
      //border
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(
        barX,
        canvas.height - padding - barHeight,
        singleBarWidth,
        barHeight,
      );

      if (showValues) {
        ctx.font = "10px Sans-Serif";
        ctx.textAlign = "center";

        if (barHeight > 20) {
          //value on top
          ctx.fillStyle = "#000000";
          ctx.fillText(
            value.toFixed(1),
            barX + singleBarWidth / 2,
            canvas.height - padding - barHeight - 5,
          );
        } else if (barHeight > 10) {
          //for medium in middle
          ctx.fillStyle = "#ffffff";
          ctx.fillStyle(
            value.toFixed(1),
            barX + singleBarWidth / 2,
            canvas.height - padding - barHeight / 2 + 3,
          );
        }
      }
    }

    //draw category labels
    ctx.fillStyle = "#000000";
    ctx.font = "12px Sans-Serif";
    ctx.textAlign = "center";
    ctx.fillText(
      categories[catIndex],
      padding + catIndex * categoryWidth + categoryWidth / 2,
      canvas.height - padding + 15,
    );
  }

  //draw legend if enabled
  if (showLegend && data.length > 1) {
    const legendBoxSize = 15;
    const legendSpacing = 20;

    // Create a background for the legend
    const legendLabels = legend.slice(0, data.length);
    const longestLabel = legendLabels.reduce(
      (longest, current) =>
        current.length > longest.length ? current : longest,
      "",
    );

    ctx.font = "12px Arial";
    const textMetrics = ctx.measureText(longestLabel);
    const legendWidth = textMetrics.width + legendBoxSize + 15;
    const legendHeight = data.length * legendSpacing + 10;

    // Position legend in top right with some margin
    const legendStartX = canvas.width - padding - legendWidth;
    const legendStartY = padding + 10;

    // Draw legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(
      legendStartX - 5,
      legendStartY - 5,
      legendWidth + 10,
      legendHeight,
    );
    ctx.strokeStyle = "#999";
    ctx.strokeRect(
      legendStartX - 5,
      legendStartY - 5,
      legendWidth + 10,
      legendHeight,
    );

    let legendY = legendStartY + 5;

    for (let i = 0; i < data.length; i++) {
      // Draw legend color box
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(legendStartX, legendY, legendBoxSize, legendBoxSize);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(legendStartX, legendY, legendBoxSize, legendBoxSize);

      // Draw legend text
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      ctx.fillText(
        legendLabels[i] || `Series ${i + 1}`,
        legendStartX + legendBoxSize + 5,
        legendY + legendBoxSize - 3,
      );

      legendY += legendSpacing;
    }
  }
  return canvas;
}
