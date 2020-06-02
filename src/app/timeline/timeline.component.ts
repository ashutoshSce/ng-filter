import { Component, OnChanges, ElementRef, Input, HostListener, AfterViewInit, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { debounce } from './../utils';

type ChartTypes = 'area' | 'bar';

interface TimelineGraphConfig {
    dateFormat: string;
    chartType: ChartTypes;
}

const DefaultChartConfig = {
    dateFormat: '%b %Y',
    chartType: 'bar'
};

@Component({
    selector: 'app-timeline-graph',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TimelineComponent),
        multi: true
    }]
})
export class TimelineComponent implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {
    @Input() data: any[] = [];
    @Input() config: TimelineGraphConfig = {
        dateFormat: '%b %Y',
        chartType: 'bar'
    };
    public dateParser = window['d3'].timeParse(this.config.dateFormat);
    public parsedData: any[] = [];

    public svg: any;
    public x = window['d3'].scaleTime();
    public xScaleBand = window['d3'].scaleBand().padding(0.2);
    public y = window['d3'].scaleLinear();
    public xAxis = window['d3'].axisBottom(this.x);

    public area = window['d3'].area()
        .curve(window['d3'].curveMonotoneX)
        .x((d) => this.x(d.date))
        .y1((d) => this.y(d.data));
    public brush = window['d3'].brushX().handleSize(10);
    public previousBrushDomain = [0, 1];

    public innerValue: any[] = [];

    /**
     *  Placeholders for the callbacks which are later providesd
     * by the Control Value Accessor
     */
    public onTouchedCallback: () => void = () => { };
    public onChangeCallback: (_: any) => void = () => { };

    constructor(public elRef: ElementRef) {
        this.brushed = this.brushed.bind(this);
        this.brushStarted = this.brushStarted.bind(this);
        console.log(this);
    }

    public ngOnInit() {
        this.brush
            .on('start', this.brushStarted)
            .on('brush end', this.brushed);
    }

    public ngAfterViewInit() {
        this.svg = window['d3'].select(this.elRef.nativeElement.querySelector('svg'));
        this.refresh();
    }

    public ngOnChanges() {
        this.config = Object.assign({}, DefaultChartConfig, this.config);
        this.dateParser = window['d3'].timeParse(this.config.dateFormat);
        this.parsedData = this.data.map((d) => ({ date: this.dateParser(d.date), data: +d.data}));
        this.refresh();
    }

    @HostListener('window:resize')
    public handleResize() {
        this.refresh(false);
    }

    @debounce(200)
    public refresh(reset = true) {
        const boundingRect = this.elRef.nativeElement.getBoundingClientRect();

        this.x
            .range([0, boundingRect.width])
            .domain([this.parsedData[0].date, this.parsedData[this.parsedData.length - 1].date]);
        this.xScaleBand
            .rangeRound([0, boundingRect.width])
            .domain(this.parsedData.map((d) => d.date));
            // .domain([this.parsedData[0].date, this.parsedData[this.parsedData.length - 1].date]);
        this.y
            .range([boundingRect.height, 0])
            .domain(window['d3'].extent(this.parsedData, (d) => d.data));
        this.brush
            .extent([[0, 0], [boundingRect.width, boundingRect.height]]);
        this.area
            .y0(boundingRect.height);

        if (this.config.chartType === 'area') {
            const area = this.svg
                .select('.area-chart')
                .selectAll('.area')
                .data([this.parsedData]);

            area
                .enter()
                    .append('path')
                    .attr('class', 'area')
                .merge(area)
                    .attr('d', this.area);

            this.svg.select('.bar-chart').selectAll('.bar').remove();
        } else if (this.config.chartType === 'bar') {
            const bars = this.svg
                .select('.bar-chart')
                .selectAll('.bar')
                .data(this.parsedData);
            bars
                .enter()
                    .append('rect')
                    .attr('class', 'bar')
                .merge(bars)
                    .attr('x', (d) => this.xScaleBand(d.date))
                    .attr('y', (d) => this.y(d.data))
                    .attr('width' , this.xScaleBand.bandwidth())
                    .attr('height' , (d) => (boundingRect.height - this.y(d.data)));
            bars.exit().remove();

            this.svg.select('.area-chart .area').remove();
        }

        this.svg
            .select('.axis.axis--x')
            // .attr('transform', `translate(0, ${boundingRect.height})`)
            .call(this.xAxis);

        this.svg
            .select('g.brush')
            .call(this.brush)
            .call(this.brush.move, reset ? this.x.range() : this.previousBrushDomain.map(d => this.x(d)));
    }

    public brushStarted() {
        const selection = window['d3'].brushSelection(this.svg.select('g.brush').node());
        if (selection[0] !== selection[1]) {
            this.previousBrushDomain = selection.map(this.x.invert, this.x);
        }
    }

    public brushed() {
        const eventSelection = window['d3'].event.selection;
        if (eventSelection) {
            const selectedDomain = eventSelection.map(this.x.invert, this.x);
            this.previousBrushDomain = selectedDomain;
        } else {
            this.svg.select('g.brush').call(this.brush.move, this.previousBrushDomain.map(d => this.x(d)));
        }
        this.checkForValueChange(this.previousBrushDomain);
    }

    @debounce(200)
    public checkForValueChange(value: any[]) {
        if ((this.value[0] === undefined) ||
            (this.value[1] === undefined) ||
            (this.value[0].toString() !== value[0].toString()) ||
            (this.value[1].toString() !== value[1].toString())) {
            this.value = value;
            const timeFormat = window['d3'].timeFormat(this.config.dateFormat);
            console.log(value.map(d => timeFormat(d)));
        }
    }

    get value(): any {
        return this.innerValue;
    }

    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            if (this.onChangeCallback) {
                this.onChangeCallback(v);
            }
        }
    }

    // From ControlValueAccessor interface
    public writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    // From ControlValueAccessor interface
    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
