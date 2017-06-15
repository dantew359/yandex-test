window.onload = init;
function init () {
//Задаем переменные
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 2960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);
    

    
//Создаем SVG и G(transform)
var svg = d3.select("body").append("svg")
    .attr("width", 600 + margin.left + margin.right)
    .attr("height", 3000 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "g_rotate");
  //my rotate  
    d3.select(".g_rotate").attr('transform', 'translate(500,100)rotate(90)')
 
    
    
    
//Получаем данные из STV
d3.tsv("data.tsv", function(error, data) {

  data.forEach(function(d) {
    d.frequency = +d.frequency;
  });

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
//Добовляем группу шкала A B C
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
//Добовляем группу шкала 1 2 3
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });
    
    //COLOR SCROLL
    
    var colorRed = 50;
    var colorGreen = 250;
    svg.selectAll(".bar").style("fill","rgb("+colorRed+","+ colorGreen+", 31)")
 
    
//   var scrollPos = 0;
//    $(window).scroll(function(){
//       var st = $(this).scrollTop();
//       if (st > scrollPos){
//           colorRed=colorRed+2 ;
//           colorGreen=colorGreen-2;
//           svg.selectAll(".bar").style("fill","rgb("+colorRed+","+ colorGreen+", 31)");
//           if(colorGreen<0){
//               colorGreen=0;
//           }
//           if(colorRed>255){
//               colorRed=255;
//           }
//           console.log(colorRed,colorGreen)
//       } else {
//           colorGreen=colorGreen+2;
//           colorRed=colorRed-2 ;
//           svg.selectAll(".bar").style("fill","rgb("+colorRed+","+ colorGreen+", 31)");
//           if(colorGreen>255){
//               colorGreen=255;
//           }
//           if(colorRed<0){
//               colorRed=0;
//           }
//           console.log(colorRed,colorGreen)
//       }
//       scrollPos = st;
//});

    
       var scrollPos = 0;
        $(window).scroll(function(){
       var st = $(this).scrollTop();
            //console.log(st)
       if (st >= 100 && st <300){
           svg.selectAll(".bar").style("fill","rgb(60, 240, 31)");
       } else if (st >= 300 && st <500){
            svg.selectAll(".bar").style("fill","rgb(80, 220, 31)");
            } else if (st >= 500 && st <700){
                svg.selectAll(".bar").style("fill","rgb(100, 200, 31)");
            }else if (st >= 700 && st <900){
                svg.selectAll(".bar").style("fill","rgb(120, 180, 31)");
            }else if (st >= 900 && st <1100){
                svg.selectAll(".bar").style("fill","rgb(140, 160, 31)"); 
            }else if (st >= 1100 && st <1300){
                svg.selectAll(".bar").style("fill","rgb(160, 120, 31)"); 
            }else if (st >= 1300 && st <1500){
                svg.selectAll(".bar").style("fill","rgb(180, 100, 31)");
            }else if (st >= 1500 && st <1700){
                svg.selectAll(".bar").style("fill","rgb(200, 80, 31)");
            }else if (st >= 1700 && st <1900){
                svg.selectAll(".bar").style("fill","rgb(240, 40, 31)");
            }

        });

    
    

    //Фильтрация при Checkbox
    
  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 500);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
});
    
  

    
    }

