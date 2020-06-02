import { Component, forwardRef, Input, ViewChildren, QueryList, OnChanges, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FilterQueryInfo, ProcessedData } from './interfaces';
import { SingleFilterModel } from './models/single-filter.model';

type Condition = 'and' | 'or';

@Component({
    selector: 'app-filter-query',
    templateUrl: './filter-query.component.html',
    styleUrls: ['./filter-query.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FilterQueryComponent),
        multi: true
    }]
})
export class FilterQueryComponent implements ControlValueAccessor, OnChanges {
    @Input() manualUpdateOnly = true;
    @Input() availableFilters: SingleFilterModel[] = [];
    public availableFiltersCache: { [key: string]: SingleFilterModel } = {};

    @ViewChild('tempQueryInput') tempQueryInput: { nativeElement: HTMLInputElement };
    @ViewChild('filterQueryContainer') filterQueryContainer: { nativeElement: HTMLDivElement };
    @ViewChild('suggestionsContainer') suggestionsContainer: { nativeElement: HTMLUListElement };

    public isValidQuery = true;
    public queries: FilterQueryInfo[] = [];
    public conditions: Condition[] = [];

    public showSuggestionsContainer = false;
    public suggestionsList: ProcessedData[] = [];

    public showTempInput = false;
    public tempInputKey = '';

    public innerValue: any[] = [];

    /**
     *  Placeholders for the callbacks which are later providesd
     * by the Control Value Accessor
     */
    public onTouchedCallback: () => void = () => { };
    public onChangeCallback: (_: any) => void = () => { };

    constructor(public elRef: ElementRef) { }

    public ngOnChanges() {
        this.availableFiltersCache = {};
        this.availableFilters.map((filter) => this.availableFiltersCache[filter.processedData.displayStr] = filter);
    }

    @HostListener('document:click', ['$event'])
    public hideSuggestions(event) {
        if ((event.target !== this.elRef.nativeElement.querySelector('.filter-query.temp-input')) &&
            (event.target !== this.elRef.nativeElement.querySelector('.filter-query.suggestion-container'))) {
            // If user not clicked the tempInput or suggestionsList, hide suggestionsContainer
            this.showSuggestionsContainer = false;
        }
    }

    public showSuggestions(searchText = '') {
        const searchTextLC = searchText.toLowerCase();

        this.showSuggestionsContainer = true;
        this.suggestionsList = this.availableFilters
            .filter((filter) => filter.processedData.displayStrLC.indexOf(searchTextLC) >= 0)
            .map((filter) => filter.processedData);
        setTimeout(() => this.positionSuggestionsContainer());
    }

    public positionSuggestionsContainer() {
        const tempInputPosition = this.tempQueryInput.nativeElement.getBoundingClientRect();
        const filterQueryPosition = this.filterQueryContainer.nativeElement.getBoundingClientRect();
        const suggestionsContainerPosition = this.suggestionsContainer.nativeElement.getBoundingClientRect();

        if ((tempInputPosition.left + suggestionsContainerPosition.width - filterQueryPosition.left) >
            (filterQueryPosition.left + filterQueryPosition.width)) {
            this.suggestionsContainer.nativeElement.style.left = 'initial';
            this.suggestionsContainer.nativeElement.style.right = '0%';
        } else {
            this.suggestionsContainer.nativeElement.style.left = (tempInputPosition.left - filterQueryPosition.left) + 'px';
            this.suggestionsContainer.nativeElement.style.right = 'initial';
        }
    }

    public checkAndFocusTempInput(event) {
        if (event.target === event.currentTarget) {
            this.tempInputKey = '';
            this.showTempInput = true;
            setTimeout(() => this.tempQueryInput.nativeElement.focus());
        }
    }

    public changeCondition(index) {
        if (this.conditions[index] === 'and') {
            this.conditions[index] = 'or';
        } else {
            this.conditions[index] = 'and';
        }
        this.processForValueChange();
    }

    public selectItem(displayStr) {
        this.queries.push({
            keyDisplayStr: displayStr,
            keyData: this.availableFiltersCache[displayStr].processedData.value,
            valueDisplayStr: '',
            valueData: '',
            condition: this.availableFiltersCache[displayStr].conditions[0],
            isValid: false
        });
        this.conditions.push('or');
        this.showSuggestionsContainer = false;
        this.processForValueChange();
    }

    public removeQuery(query: FilterQueryInfo) {
        const index = this.queries.findIndex((q) => q === query);

        if (index >= 0) {
            this.queries.splice(index, 1);
            this.conditions.splice(index, 1);
            this.processForValueChange();
        }
    }

    public clearAll() {
        this.queries.length = 0;
        this.processForValueChange();
    }

    public processForValueChange(force = false) {
        const newValue = [];
        const queriesLen = this.queries.length;
        this.isValidQuery = this.queries.every(q => q.isValid);

        if (this.isValidQuery) {
            if (!this.manualUpdateOnly || (this.manualUpdateOnly && force)) {
                this.queries.map((q, i) => {
                    newValue.push({ key: q.keyData, value: q.valueData, condition: q.condition.value });
                    if (i < queriesLen - 1) {
                        newValue.push(this.conditions[i]);
                    }
                });
                this.value = newValue;
            }
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
