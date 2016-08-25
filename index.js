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
  // console.log(branchPercents);
}

function appendForecast(ele, ind, yearlyRevenues) {
  var element = [ ele ]; // grab only the current element to bind as data
  var index = ind;
  
  var svg = d3.select('#' + ele.branch_name.replace(" ", "-")) // remove space and add dash to match id from div
    .append('svg')
    .attr('width', barSvgWidth)
    .attr('height', barSvgHeight);

  svg.selectAll('rect')
    .data(element)
    .enter()
    .call(function(svg) {
      svg.append('rect')
      .attr('x', 0)
      .attr('y', function(d, i) {
        return barSvgHeight - d.yearly_forecast / 100000; // because svg y-axis begins from top, we must offset each bar towards the bottom
      })
      .attr('width', barSvgWidth / (Object.keys(ele).length - 2) - barPadding)
      .attr('height', function(d, i) {
        return d.yearly_forecast / 100000; // height of bar is determined by data, scaled down to fit bars in <svg>
      })
      .attr('fill', 'red');
    })
    .call(function(svg) {
      svg.append('rect')
      .attr('x', function(d, i) {
        return barSvgWidth / (Object.keys(d).length - 2); // width of svg divided by how many elements in the array multiplied by index of element
      })
      .attr('y', function(d, i) {
        return barSvgHeight - d.current_fiscal_year / 100000;
      })
      .attr('width', barSvgWidth / (Object.keys(ele).length - 2) - barPadding)
      .attr('height', function(d, i) {
        return d.current_fiscal_year / 100000;
      })
      .attr('fill', 'blue');
    })
    .call(function(svg) {
      svg.append('rect')
      .attr('x', function(d, i) {
        return 2 * (barSvgWidth / (Object.keys(d).length - 2)); // width of svg divided by how many elements in the array multiplied by index of element
      })
      .attr('y', function(d, i) {
        return barSvgHeight - d.last_fiscal_year / 100000;
      })
      .attr('width', barSvgWidth / (Object.keys(ele).length - 2) - barPadding)
      .attr('height', function(d, i) {
        return d.last_fiscal_year / 100000;
      })
      .attr('fill', 'yellow');
    })
}

function appendPieChart() {
  var pie = d3.pie()
    .value(function(d) {
      return d.current_fiscal_year;
    });
  var slices = pie(branchPercents);

  var arc = d3.arc().innerRadius(0).outerRadius(100);
  var colour = d3.schemeCategory10;

  var svg = d3.select('svg.pie');
  var g = svg.append('g')
    .attr('transform', 'translate(200, 200)');

  g.selectAll('path.slice')
    .data(slices)
    .enter()
    .append('path')
    .attr('class', 'slice')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return colour[i];
    });

  // svg.append('g')
  //   .attr('class', 'legend')
  //   .selectAll('text')
  //   .data(slices)
  //   .enter()
  //   .append('text')
  //   .text(function(d) {
  //     return d.data.branch_name + " " + d.data.total_pct;
  //   })
  //   .attr('fill', function(d, i) {
  //     return colour[i];
  //   })
  //   .atty('y', function(d, i) {
  //     return 20 * (i + 1);
  //   });
}

document.addEventListener('DOMContentLoaded', function() {

  yearlyRevenues.forEach(appendForecast);
  appendPieChart()


});