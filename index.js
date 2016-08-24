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

// function barChart(yearlyRevenues) {
//   var svg1 = d3.select('.svg-1');
//   var rects = svg1.selectAll('rect').data(yearlyRevenues);
//   var newRects = rects.enter();

//   var maxCount = d3.max(yearlyRevenues, function(d, i) {
//     return parseInt(d.yearly_forecast);
//   });

//   console.log(d3);

//   var x = d3.scaleLinear()
//     .range([0, 500])
//     .domain([0, maxCount]);
//   var y = d3.scaleBand()
//     // .rangeRound([0, 50])
//     .domain(yearlyRevenues.map(function(d,i) {
//       return d.branch_name;
//     }));
//   // console.log("max is", maxCount);

//   newRects.append('rect')
//     .attr('x', x(0))
//     .attr('y', function(d,i) {
//       return d.branch_name;
//     })
//     .attr('height', 25)
//     .attr('width', function(d,i) {
//       return x(d.yearly_forecast);
//     })
//     .attr('fill', 'red');
// }

document.addEventListener('DOMContentLoaded', function() {

  // barChart(yearlyRevenues);
  var svg = d3.select('body')
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



});