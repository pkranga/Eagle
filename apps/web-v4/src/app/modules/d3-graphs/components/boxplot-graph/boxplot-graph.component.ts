/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { randomUniform, randomNormal } from 'd3-random';
import { scaleOrdinal, scaleLinear, scalePoint } from 'd3-scale';
// import { schemeCategory20 } from 'd3-color';
import { axisLeft, axisTop } from 'd3-axis';
@Component({
  selector: 'ws-boxplot-graph',
  templateUrl: './boxplot-graph.component.html',
  styleUrls: ['./boxplot-graph.component.scss']
})
export class BoxplotGraphComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    let width = 900;
    let height = 400;
    const barWidth = 30;

    const margin = { top: 20, right: 10, bottom: 40, left: 10 };

    (width = width - margin.left - margin.right), (height = height - margin.top - margin.bottom);

    const totalWidth = width + margin.left + margin.right;
    const totalheight = height + margin.top + margin.bottom;

    // Generate five 100 count, normal distributions with random means
    const groupCounts = {};
    const globalCounts = [];
    const meanGenerator = randomUniform(10);
    for (let i = 0; i < 7; i++) {
      const randomMean = meanGenerator();
      const generator = randomNormal(randomMean);
      const key = i.toString();
      groupCounts[key] = [];

      for (let j = 0; j < 100; j++) {
        const entry = generator();
        groupCounts[key].push(entry);
        globalCounts.push(entry);
      }
    }

    // Sort group counts so quantile methods work
    for (const key in groupCounts) {
      if (key) {
        const groupCount = groupCounts[key];
        groupCounts[key] = groupCount.sort(sortNumber);
      }
    }

    // Setup a color scale for filling each box
    const colorScale = scaleOrdinal(['gray', 'lightgreen', 'orange', 'red', 'green', 'yellow']).domain(Object.keys(groupCounts));

    // Prepare the data for the box plots
    const boxPlotData = [];
    for (const [key, groupCount] of Object.entries(groupCounts)) {
      const record: any = {};
      // const localMin = d3.min(groupCounts);
      // const localMax = d3.max(groupCounts);

      record.key = key;
      record.counts = groupCount;
      record.quartile = boxQuartiles(groupCount);
      record.whiskers = [0, 20];
      record.color = colorScale(key);

      boxPlotData.push(record);
    }

    // Compute an ordinal xScale for the keys in boxPlotData
    const xScale = scalePoint()
      .domain(Object.keys(groupCounts))
      .rangeRound([0, width])
      .padding([0.5]);

    // Compute a global y scale based on the global counts
    const min = d3.min(globalCounts);
    const max = d3.max(globalCounts);
    const yScale = scaleLinear()
      .domain([min, max])
      .range([0, height]);

    // Setup the svg and group we will draw the box plot in
    const svg = d3
      .select('#boxPlotGraph')
      .attr('width', totalWidth)
      .attr('height', totalheight)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Move the left axis over 25 pixels, and the top axis over 35 pixels
    const axisG = svg.append('g').attr('transform', 'translate(25,0)');
    const axisTopG = svg.append('g').attr('transform', 'translate(35,0)');

    // Setup the group the box plot elements will render in
    const g = svg.append('g').attr('transform', 'translate(20,5)');

    // Draw the box plot vertical lines
    const verticalLines = g
      .selectAll('.verticalLines')
      .data(boxPlotData)
      .enter()
      .append('line')
      .attr('x1', datum => {
        return xScale(datum.key) + barWidth / 2;
      })
      .attr('y1', datum => {
        const whisker = datum.whiskers[0];
        return yScale(whisker);
      })
      .attr('x2', datum => {
        return xScale(datum.key) + barWidth / 2;
      })
      .attr('y2', datum => {
        const whisker = datum.whiskers[1];
        return yScale(whisker);
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    // Draw the boxes of the box plot, filled in white and on top of vertical lines
    const rects = g
      .selectAll('rect')
      .data(boxPlotData)
      .enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', datum => {
        const quartiles = datum.quartile;
        const height1 = yScale(quartiles[2]) - yScale(quartiles[0]);
        return height1;
      })
      .attr('x', datum => {
        return xScale(datum.key);
      })
      .attr('y', datum => {
        return yScale(datum.quartile[0]);
      })
      .attr('fill', datum => {
        return datum.color;
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // Now render all the horizontal lines at once - the whiskers and the median
    const horizontalLineConfigs = [
      // Top whisker
      {
        x1(datum) {
          return xScale(datum.key);
        },
        y1(datum) {
          return yScale(datum.whiskers[0]);
        },
        x2(datum) {
          return xScale(datum.key) + barWidth;
        },
        y2(datum) {
          return yScale(datum.whiskers[0]);
        }
      },
      // Median line
      {
        x1(datum) {
          return xScale(datum.key);
        },
        y1(datum) {
          return yScale(datum.quartile[1]);
        },
        x2(datum) {
          return xScale(datum.key) + barWidth;
        },
        y2(datum) {
          return yScale(datum.quartile[1]);
        }
      },
      // Bottom whisker
      {
        x1(datum) {
          return xScale(datum.key);
        },
        y1(datum) {
          return yScale(datum.whiskers[1]);
        },
        x2(datum) {
          return xScale(datum.key) + barWidth;
        },
        y2(datum) {
          return yScale(datum.whiskers[1]);
        }
      }
    ];

    // for (let i = 0; i < horizontalLineConfigs.length; i++) {
    for (const i of horizontalLineConfigs) {
      const lineConfig = i;

      // Draw the whiskers at the min for this series
      const horizontalLine = g
        .selectAll('.whiskers')
        .data(boxPlotData)
        .enter()
        .append('line')
        .attr('x1', lineConfig.x1)
        .attr('y1', lineConfig.y1)
        .attr('x2', lineConfig.x2)
        .attr('y2', lineConfig.y2)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
    }

    // Setup a scale on the left
    const axisLeft1 = axisLeft(yScale);
    axisG.append('g').call(axisLeft);

    // Setup a series axis on the top
    const axisTop1 = axisTop(xScale);
    axisTopG.append('g').call(axisTop);

    function boxQuartiles(d) {
      return [d3.quantile(d, 0.45), d3.quantile(d, 0.5), d3.quantile(d, 0.55)];
    }

    // Perform a numeric sort on an array
    function sortNumber(a, b) {
      return a - b;
    }
  }
}
