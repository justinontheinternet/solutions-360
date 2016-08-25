// DEFINE VARIABLES
var yearlyRevenues = [];
var branchPercents = [];
var barSvgWidth = 100;
var barSvgHeight = 275;
var barPadding = 1;

// DEFINE FUNCTIONS
// take each row from the query result and store it as an entry in an array
function encodeYearlyRevenues(branch) {
  yearlyRevenues.push(branch);
}

function encodeBranchPercent(branch) {
  branchPercents.push(branch);
}

function appendBar(svg, ele, stat, colour, xPos) {
  svg.append('rect')
  .attr('x', function(d, i) {
    // determing x position of bar by dividing width of svg by how many elements in the array (minus 2 not represented by bars)
    // ensures bars will not overlap
    return xPos * (barSvgWidth / (Object.keys(ele).length - 2));
  })
  .attr('y', function(d, i) {
    // because svg y-axis begins from top, we must offset each bar towards the bottom
    return barSvgHeight - ele[stat] / 100000;
  })
  // width is determined by dividing <svg> width by number of bars, then making space for padding
  .attr('width', barSvgWidth / (Object.keys(ele).length - 2) - barPadding)
  .attr('height', function(d, i) {
    // height of bar is determined by data, scaled down to fit bars in <svg>
    return ele[stat] / 100000;
  })
  .attr('fill', colour);
}


function appendForecast(ele, ind, yearlyRevenues) {
  // creating a <div> and an <h5> to be appended after <svg> charts
  var div = document.getElementById(ele.branch_name.replace(" ", "-"));
  var h5 = document.createElement('h5');
  
  // for each <div> created by each row of the query result, place an <svg> inside
  var svg = d3.select('#' + ele.branch_name.replace(" ", "-")) // remove space and add dash to match id from div
    .append('svg')
    .attr('width', barSvgWidth)
    .attr('height', barSvgHeight);

  // append a bar/<rect> for each stat inside the <svg>
  appendBar(svg, ele, 'yearly_forecast', 'red', 0);
  appendBar(svg, ele, 'current_fiscal_year', 'blue', 1);
  appendBar(svg, ele, 'last_fiscal_year', 'yellow', 2);

  // Append the <h5> last to place it under each chart
  h5.innerHTML = ele.branch_name;
  div.appendChild(h5);
}

function appendPieChart() {
  var pie = d3.pie()
    .value(function(d) {
      return d.current_fiscal_year;
    });
  var slices = pie(branchPercents);

  var arc = d3.arc().innerRadius(0).outerRadius(170);
  var colour = d3.schemeCategory10;

  var svg = d3.select('svg.pie');
  var g = svg.append('g')
    .attr('transform', 'translate(400, 200)');

  g.selectAll('path.slice')
    .data(slices)
    .enter()
    .append('path')
    .attr('class', 'slice')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return colour[i];
    });

  svg.append('g')
    .attr('class', 'pie-legend')
    .selectAll('text')
    .data(slices)
    .enter()
    .append('text')
    .text(function(d) {
      return d.data.branch_name + " - " + d.data.pct_of_total + "%";
    })
    .attr('fill', function(d, i) {
      return colour[i];
    })
    .attr('y', function(d, i) {
      return 20 * (i + 1);
    });
}

// after the DOM has loaded, initiate functions to place content
document.addEventListener('DOMContentLoaded', function() {

  yearlyRevenues.forEach(appendForecast);
  appendPieChart()


});