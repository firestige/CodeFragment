import {
  axisLeft,
  axisBottom,
  min,
  select,
  scaleLinear,
  extent,
  histogram,
  max,
  Bin,
  mean,
} from "d3";

interface WeatherData {
  time: number;
  summary: string;
  icon: string;
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;
  precipIntensity: number;
  precipIntensityMax: number;
  precipProbability: number;
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  apparentTemperatureHigh: number;
  apparentTemperatureHighTime: number;
  apparentTemperatureLow: number;
  apparentTemperatureLowTime: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windGustTime: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  uvIndexTime: number;
  visibility: number;
  temperatureMin: number;
  temperatureMinTime: number;
  temperatureMax: number;
  temperatureMaxTime: number;
  apparentTemperatureMin: number;
  apparentTemperatureMinTime: number;
  apparentTemperatureMax: number;
  apparentTemperatureMaxTime: number;
  date: string;
}

interface Dimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  boundedWidth?: number;
  boundedHeight?: number;
}

const drawChart = async () => {
  const dataSet: Array<WeatherData> = require("./my_weather_data.json");
  const metricAccessor = (d: WeatherData) => d.humidity;

  const dimensions: Dimensions = {
    width: 600,
    height: 600 * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  const wrapper = select("#app")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);
  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  const xScale = scaleLinear()
    .domain(extent(dataSet, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const binsGenerator = histogram<WeatherData, number>()
    .domain([min(xScale.domain()), max(xScale.domain())])
    .value(metricAccessor)
    .thresholds(12);

  const bins = binsGenerator(dataSet);

  const yAccessor = (d: Bin<WeatherData, number>) => d.length;

  const yScale = scaleLinear()
    .domain([0, max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const binsGroup = bounds.append("g");
  const binGroups = binsGroup.selectAll("g").data(bins).enter().append("g");

  const barPadding = 1;

  const barRects = binGroups
    .append("rect")
    .attr("x", (d) => xScale(d.x0) + barPadding / 2)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("width", (d) => max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr("fill", "cornflowerblue");

  const barText = binGroups
    .filter((d: Bin<WeatherData, number>) => yAccessor(d) > 0)
    .append("text")
    .attr(
      "x",
      (d: Bin<WeatherData, number>) =>
        xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2
    )
    .attr("y", (d) => yScale(yAccessor(d)) - 5)
    .text(yAccessor)
    .style("text-anchor", "middle")
    .style("fill", "darkgrey")
    .style("font-size", "12px")
    .style("font-family", "sans-serif");

  const _mean = mean(dataSet, metricAccessor);

  const meanLine = bounds
    .append("line")
    .attr("x1", xScale(_mean))
    .attr("x2", xScale(_mean))
    .attr("y1", -15)
    .attr("y2", dimensions.boundedHeight)
    .attr("stroke", "maroon")
    .attr("stroke-dasharray", "2px 4px");

  const meanLabel = bounds
    .append("text")
    .attr("x", xScale(_mean))
    .attr("y", -20)
    .text("mean")
    .attr("fill", "maroon")
    .style("font-size", "12px")
    .style("text-anchor", "middle");

  const xAxisGenerator = axisBottom(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Humidity");
};

drawChart();
