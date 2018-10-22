// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the mojoData.csv file
// =================================
var file = "https://raw.githubusercontent.com/the-Coding-Boot-Camp-at-UT/UTAUS201804DATA2-Class-Repository-DATA/master/16-D3/3/Activities/01-Evr_Multiline/Solved/mojoData.csv?token=ACYEAbJrhJOfTaK4EmrSePuu8zV4zfnxks5bag3BwA%3D%3D"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw error;
}

function successHandle(mojoData) {

  // Step 4: Parse the data
  // Format the data and convert to numerical and date values
  // =================================
  // Create a function to parse date and time
  // https://github.com/d3/d3-time-format
  var parseTime = d3.timeParse("%d-%b");

  // Format the data
  mojoData.forEach(function(data) {
    data.date = parseTime(data.date);
    data.morning = +data.morning;
    data.evening = +data.evening;
  });

  // Step 5: Create the scales for the chart
  // Resources: 
  // https://github.com/d3/d3-array#extent
  // =================================
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(mojoData, d => d.date))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear().range([height, 0]);

  // Step 6: Set up the y-axis domain
  // ==============================================
  // @NEW! determine the max y value
  // find the max of the morning data
  var morningMax = d3.max(mojoData, d => d.morning);

  // find the max of the evening data
  var eveningMax = d3.max(mojoData, d => d.evening);

  var yMax;
  if (morningMax > eveningMax) {
    yMax = morningMax;
  }
  else {
    yMax = eveningMax;
  }

  // var yMax = morningMax > eveningMax ? morningMax : eveningMax;

  // Use the yMax value to set the yLinearScale domain
  yLinearScale.domain([0, yMax]);


  // Step 7: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b"));
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 8: Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g").call(leftAxis);

  // Step 9: Set up two line generators and append two SVG paths
  // ==============================================

  // Line generator for morning data
  var line1 = d3.line()
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale(d.morning));

  // Line generator for evening data
  var line2 = d3.line()
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale(d.evening));

  // Append a path for line1
  chartGroup
    .append("path")
    .attr("d", line1(mojoData))
    .classed("line green", true);

  // Append a path for line2
  chartGroup
    .data([mojoData])
    .append("path")
    .attr("d", line2)
    .classed("line orange", true);

}
