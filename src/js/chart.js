(function () {

  'strict';

  (function init() {

    d3.queue()
      .defer(d3.csv, 'data/results.csv')
      .defer(d3.csv, 'data/demographics.csv')
      .await(function (error, results, demographics) {

        var correlations;

        if (error) { throw error; }

        results = transform(results);
        demographics = transform(demographics);

        correlations = correlate(results, demographics);

        draw(correlations);
      });
  })();

  function transform(data) {

    var map = {};

    data.forEach(function (row) {

      data.columns.forEach(function (column) {

        var value = isNaN(row[column]) ? row[column] : parseFloat(row[column]);

        map[column] = map[column] || [];
        map[column].push(value);
      });
    });

    return map;
  }

  function correlate(results, demographics) {

    var correlations = [];

    Object.keys(results).forEach(function (res) {

      Object.keys(demographics).forEach(function (dem) {

        // @todo: Could be nicer
        if (res !== 'id' && res !== 'name' && res !== 'state' &&
          dem !== 'id' && dem !== 'name' && dem !== 'state') {

          var correlation = ss.sampleCorrelation(results[res],demographics[dem]);
          var regression = ss.linearRegression([results[res],demographics[dem]]);
          var regressionLine = ss.linearRegressionLine(regression);

          correlations.push({
            correlation: correlation,
            regression: regression,
            line: regressionLine,
            xName: res,
            xValues: results[res],
            xDomain: d3.extent(results[res]),
            yName: dem,
            yValues: demographics[dem],
            yDomain: d3.extent(demographics[dem])
          });
        }
      });
    });

    correlations.sort(function (a, b) {

      return d3.descending(Math.abs(a.correlation), Math.abs(b.correlation));
    });

    return correlations;
  }

  function draw(correlations) {

    correlations.length = 4;

    var width, height, margin,
      vis, x, y, xAxis, yAxis,
      div, svg;

    width = 150;
    height = 150;

    margin = {
      top: 20,
      right: 30,
      bottom: 20,
      left: 40
    };

    vis = d3.select('#vis');

    div = vis.selectAll('.chart')
        .data(correlations)
        .enter()
      .append('div')
        .attr('class', 'chart');

    svg = div.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .each(handleEach);

    function handleEach(d) {

      var parent = d3.select(this);

      x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d.xDomain[1]]);

      y = d3.scaleLinear()
        .range([height, 0])
        .domain(d.yDomain);

      xAxis = d3.axisBottom(x)
          .ticks(4);

      yAxis = d3.axisLeft(y)
          .ticks(4);

      parent.append('g')
          .call(yAxis);

      parent.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

      parent.append('g')
        .append('line')
        .attr('x1', x(d.xDomain[d.correlation < 0 ? 1 : 0]))
        .attr('y1', y(d.line(d.yDomain[0])))
        .attr('x2', x(d.xDomain[d.correlation < 0 ? 0 : 1]))
        .attr('y2', y(d.line(d.yDomain[1])))
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

      parent.append('g')
          .attr('fill', function (e) {

            return getColor(e.xName) || 'black';
          })
        .selectAll('circle')
          .data(function () {
            return d.xValues.map(function (x, i) {
              return {
                x: x,
                y: d.yValues[i]
              };
            });
          })
          .enter()
        .append('circle')
          .attr('r', 3)
          .attr('fill-opacity', .5)
          .attr('cx', function (e) { return x(e.x); })
          .attr('cy', function (e) { return y(e.y); });
    }
  }

  function getColor(party) {

    party = party.replace(' (%)', '');

    var colors = {

      'AfD': '#129ee6',
      'Union': '#121212',
      'FDP': '#ffdd00',
      'SPD': '#d71f1d',
      'Grüne': '#0a8000',
      'Linke': '#be3075'
    };

    return colors[party];
  }
})();
