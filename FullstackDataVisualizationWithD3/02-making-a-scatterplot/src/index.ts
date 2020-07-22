import { axisLeft, axisBottom, min, select, scaleLinear, extent } from "d3";

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

  const xAccessor = (d: WeatherData) => d.dewPoint;
  const yAccessor = (d: WeatherData) => d.humidity;

  const len = min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

  const dimensions: Dimensions = {
    width: len,
    height: len,
    margin: {
      top: 10,
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
    .domain(extent(dataSet, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();
  const yScale = scaleLinear()
    .domain(extent(dataSet, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  /*
  dataSet.forEach((d) => {
    bounds
      .append("circle")
      .attr("cx", xScale(xAccessor(d)))
      .attr("cy", yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", "cornflowerblue");
  });
   */
  const drawDots = (dataSet: Array<WeatherData>, color: string) => {
    const dots = bounds.selectAll("circle").data(dataSet);

    dots
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", color);
  };
  setTimeout(() => {
    drawDots(dataSet, "darkgrey");
  }, 1000);

  const xAxisGenerator = axisBottom(xScale);
  const yAxisGenerator = axisLeft(yScale).ticks(4);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);
  const yAxis = bounds.append("g").call(yAxisGenerator);

  // todo 寻找使用latex代替text的方法
  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point (&deg;F)");
  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");
};

drawChart();
