import { Injectable } from '@angular/core';
import { ChartOptionsService } from './chart-options.service';
declare let fc:any;
declare let d3:any;
@Injectable()
export class ChartVolumeService {
  private volumeContainer:any;

  constructor(private chartOptionsService:ChartOptionsService) {
  }

  init(data:any, container:any) {
    this.volumeContainer = container.selectAll('g.volume').data([data]);
    this.volumeContainer.enter()
      .append('g')
      .attr({
        'class': 'volume',
      })
      .layout({
        position: 'absolute',
        top: 150,
        bottom: this.chartOptionsService.options.xAxisHeight,
        right: this.chartOptionsService.options.yAxisWidth,
        left: 0
      });

    fc.layout();
    container.layout();
  }

  render(data:any, xScale:number) {
    let volumeScale:any = d3.scale.linear()
      .domain([0, d3.max(data, (d:any) => {
        return Number(d.volume);
      })])
      .range([this.volumeContainer.layout('height'), 0]);

    let volume:any = fc.series.bar()
      .xScale(xScale)
      .yScale(volumeScale)
      .yValue((d:any) => {
        return d.volume;
      })
      .decorate((sel:any) => {
        sel.select('path')
          .style('stroke', (d:any) => {
            return d.close > d.open ? 'red' : 'green';
          });
      });

    this.volumeContainer
      .datum(data)
      .call(volume);
  }
}
