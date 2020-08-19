import { ChartData } from './../../../models/chart-data';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from 'd3';
import { Quota } from 'kypo-sandbox-model';

@Component({
  selector: 'kypo-quota-pie-chart',
  templateUrl: './quota-pie-chart.component.html',
  styleUrls: ['./quota-pie-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotaPieChartComponent implements OnInit, AfterViewInit {
  @ViewChild('containerPieChart') element: ElementRef;

  @Input() quota: Quota;

  private width: number;
  private height: number;
  private margin: number;
  private radius: number;
  private svg;

  private data: ChartData;

  constructor() {}

  ngOnInit(): void {
    console.log(this.quota);
  }

  ngAfterViewInit() {
    this.setup();
    this.buildSvg();
    this.buildPie();
  }

  private setup(): void {
    this.height = 100;
    this.width = 100;
    this.margin = 10;
    this.radius = Math.min(this.width, this.height) / 2 - this.margin;
    this.data = this.prepareChartData();
  }

  private buildSvg(): void {
    this.svg = d3
      .select(this.element.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
  }

  private buildPie(): void {
    const pie = d3
      .pie()
      .value((d) => {
        return d.value;
      })
      .sort(null);
    const color = d3.scaleOrdinal().domain(this.data).range(['#3D54AF', '#DDDDDD']);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(this.radius);
    const data_ready = pie(d3.entries(this.data));

    this.svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => {
        return color(d.data.key);
      });
  }

  private prepareChartData() {
    return new ChartData(this.quota.inUse, this.quota.limit - this.quota.inUse);
  }
}
