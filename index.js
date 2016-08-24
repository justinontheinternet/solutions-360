// DEFINE VARIABLES
var yearlyRevenues = [];
var branchPercents = [];
var svgWidth = 100;
var svgHeight = 300;
var barPadding = 1;

// DEFINE FUNCTIONS
function encodeYearlyRevenues(branch) {
  yearlyRevenues.push(branch);
  // console.log(yearlyRevenues);
}

function encodeBranchPercent(branch) {
  branchPercents.push(branch);
  // console.log(branchPercents);
}

function cbFunction(ele, ind, yearlyRevenues) {
  console.log("element:", ele);
  var svg = d3.select('#' + ele.branch_name.replace(" ", "-")) // remove space and add dash to match id from div
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  svg.selectAll('rect')
    .data(yearlyRevenues)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return i * (svgWidth / yearlyRevenues.length); // width of svg divided by how many elements in the array multiplied by index of element
    })
    .attr('y', function(d, i) {
      return svgHeight - d.yearly_forecast / 100000; // because svg y-axis begins from top, we must offset each bar towards the bottom
    })
    .attr('width', svgWidth / yearlyRevenues.length - barPadding)
    .attr('height', function(d, i) {
      return d.yearly_forecast / 100000; // scale down to fit bars in <svg>
    })
    .attr('fill', 'red');

  svg.selectAll('text')
    .data(yearlyRevenues)
    .enter()
    .append('text')
    .text(function(d, i) {
      return d.branch_name;
    })
    .attr('x', function(d, i) {
      return i * (svgWidth / yearlyRevenues.length);
    })
    .attr('y', svgHeight);
}

document.addEventListener('DOMContentLoaded', function() {

  yearlyRevenues.forEach(cbFunction);

  // var svg = d3.select('.svg-1')
  //   .append('svg')
  //   .attr('width', svgWidth)
  //   .attr('height', svgHeight);

  // svg.selectAll('rect')
  //   .data(yearlyRevenues)
  //   .enter()
  //   .append('rect')
  //   .attr('x', function(d, i) {
  //     return i * (svgWidth / yearlyRevenues.length); // width of svg divided by how many elements in the array multiplied by index of element
  //   })
  //   .attr('y', function(d, i) {
  //     return svgHeight - d.yearly_forecast / 100000; // because svg y-axis begins from top, we must offset each bar towards the bottom
  //   })
  //   .attr('width', svgWidth / yearlyRevenues.length - barPadding)
  //   .attr('height', function(d, i) {
  //     return d.yearly_forecast / 100000; // scale down to fit bars in <svg>
  //   })
  //   .attr('fill', 'red');

  // svg.selectAll('text')
  //   .data(yearlyRevenues)
  //   .enter()
  //   .append('text')
  //   .text(function(d, i) {
  //     return d.branch_name;
  //   })
  //   .attr('x', function(d, i) {
  //     return i * (svgWidth / yearlyRevenues.length);
  //   })
  //   .attr('y', svgHeight);



});