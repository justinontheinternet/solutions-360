// DEFINE VARIABLES
var yearlyRevenues = [];
var branchPercents = [];
var barSvgWidth = 100;
var barSvgHeight = 275;
var barPadding = 1;

// DEFINE FUNCTIONS
function encodeYearlyRevenues(branch) {
  yearlyRevenues.push(branch);
}

function encodeBranchPercent(branch) {
  branchPercents.push(branch);
}

function appendBar(svg, element, stat, colour, yPos) {
  svg.append('rect')
  .attr('x', function(d, i) {
    return yPos * (barSvgWidth / (Object.keys(element[0]).length - 2)); // width of svg divided by how many elements in the array
  })
  .attr('y', function(d, i) {
    return barSvgHeight - element[0][stat] / 100000; // because svg y-axis begins from top, we must offset each bar towards the bottom
  })
  .attr('width', barSvgWidth / (Object.keys(element[0]).length - 2) - barPadding)
  .attr('height', function(d, i) {
    return element[0][stat] / 100000; // height of bar is determined by data, scaled down to fit bars in <svg>
  })
  .attr('fill', colour);
}


function appendForecast(ele, ind, yearlyRevenues) {
  var div = document.getElementById(ele.branch_name.replace(" ", "-"));
  var h5 = document.createElement('h5');
  var element = [ ele ]; // grab only the current element to bind as data
  var index = ind;
  
  var svg = d3.select('#' + ele.branch_name.replace(" ", "-")) // remove space and add dash to match id from div
    .append('svg')
    .attr('width', barSvgWidth)
    .attr('height', barSvgHeight);

  appendBar(svg, element, 'yearly_forecast', 'red', 0);
  appendBar(svg, element, 'current_fiscal_year', 'blue', 1);
  appendBar(svg, element, 'last_fiscal_year', 'yellow', 2);

  // svg.selectAll('rect')
  //   .data(element)
  //   .enter()
  //   .call(function(svg) {
  //     svg.append('rect')
  //     .attr('x', 0)
  //     .attr('y', function(d, i) {
  //       return barSvgHeight - d.yearly_forecast / 100000; // because svg y-axis begins from top, we must offset each bar towards the bottom
  //     })
  //     .attr('width', barSvgWidth / (Object.keys(ele).length - 2) - barPadding)
  //     .attr('height', function(d, i) {
  //       return d.yearly_forecast / 100000; // height of bar is determined by data, scaled down to fit bars in <svg>
  //     })
  //     .attr('fill', 'red');
  //   })
  //   .call(function(svg) {
  //     svg.append('rect')
  //     .attr('x', function(d, i) {
  //       return barSvgWidth / (Object.keys(d).length - 2); // width of svg divided by how many elements in the array
  //     })
  //     .attr('y', function(d, i) {
  //       return barSvgHeight - d.current_fiscal_year / 100000;
  //     })
  //     .attr('width', barSvgWidth / (Object.keys(ele).length - 2) - barPadding)
  //     .attr('height', function(d, i) {
  //       return d.current_fiscal_year / 100000;
  //     })
  //     .attr('fill', 'blue');
  //   })
  //   .call(function(svg) {
  //     svg.append('rect')
  //     .attr('x', function(d, i) {
  //       return 2 * (barSvgWidth / (Object.keys(d).length - 2)); // multiplied by 2 to place 3rd bar
  //     })
  //     .attr('y', function(d, i) {
  //       return barSvgHeight - d.last_fiscal_year / 100000;
  //     })
  //     .attr('width', barSvgWidth / (Object.keys(ele).length - 2) - barPadding)
  //     .attr('height', function(d, i) {
  //       return d.last_fiscal_year / 100000;
  //     })
  //     .attr('fill', 'yellow');
  //   })
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