import { Component, Input, Output, EventEmitter, ViewChild, HostListener, ElementRef } from '@angular/core';

import { FilterQueryInfo, QueryPart, ProcessedData, ProcessedOperator } from './../interfaces';
import { SingleFilterModel } from '../models/single-filter.model';
import { debounce } from './../../utils';

@Component({
    selector: 'app-single-filter-query',
    templateUrl: './single-filter-query.component.html',
    styleUrls: ['./single-filter-query.component.scss']
})
export class SingleFilterQueryComponent {
    @Input() query: FilterQueryInfo = {};
    @Input() availableFilters: SingleFilterModel[] = [];
    @Input() availableFiltersCache: { [key: string]: SingleFilterModel } = {};

    @Output() removeQuery = new EventEmitter<FilterQueryInfo>();
    @Output() queryUpdated = new EventEmitter<FilterQueryInfo>();

    @ViewChild('keyInput') keyInput: { nativeElement: HTMLInputElement };
    @ViewChild('valueInput') valueInput: { nativeElement: HTMLInputElement };

    public defaultInputSize = 3;

    public key = '';
    public value = '';
    public suggestionsList = [];

    public loading = false;
    public focusKeyInput = false;
    public focusValueInput = false;
    public showSuggestionsContainer = false;
    public activeQueryPart: QueryPart = 'key';

    constructor(public elRef: ElementRef) { }

    public focusInput(queryPart: QueryPart = 'key') {
        if (queryPart === 'key') {
            this.focusKeyInput = true;
            setTimeout(() => this.keyInput.nativeElement.focus());
        } else if (queryPart === 'value') {
            this.focusValueInput = true;
            setTimeout(() => this.valueInput.nativeElement.focus());
        } else if (queryPart === 'condition') {
            setTimeout(() => this.showSuggestions(this[queryPart], queryPart));
        }
    }

    public onFocus(queryPart: QueryPart = 'key') {
        if (queryPart === 'key') {
            this.key = '';
            this.showSuggestions(this.key, queryPart);
        } else if (queryPart === 'value') {
            this.value = '';
            this.showSuggestions(this.value, queryPart);
        }
    }

    public onBlur(queryPart: QueryPart = 'key') {
        this.focusKeyInput = false;
        this.focusValueInput = false;
    }

    public showSuggestions(searchText = '', queryPart: QueryPart = 'key') {
        this.showSuggestionsContainer = true;
        this.activeQueryPart = queryPart;
        const searchTextLC = searchText.toLowerCase();

        if (queryPart === 'key') {
            this.suggestionsList = this.availableFilters
                .filter((filter) => filter.processedData.displayStrLC.indexOf(searchTextLC) >= 0)
                .map((filter) => filter.processedData);
        } else if (queryPart === 'value' && this.availableFiltersCache[this.query.keyDisplayStr]) {
            this.availableFiltersCache[this.query.keyDisplayStr].searchText = searchText;
            this.suggestionsList = this.availableFiltersCache[this.query.keyDisplayStr].filteredSuggestions;
        } else if (queryPart === 'condition' && this.availableFiltersCache[this.query.keyDisplayStr]) {
            this.suggestionsList = this.availableFiltersCache[this.query.keyDisplayStr].conditions;
        } else {
            // Invalid queryPart type
            this.suggestionsList = [];
        }
    }

    @HostListener('document:click', ['$event'])
    public hideSuggestions(event?: MouseEvent) {
        if (!event || !this.elRef.nativeElement.contains(event.target) || event.target['tagName'] !== 'INPUT') {
            this.showSuggestionsContainer = false;
        }
    }

    public selectItem(data: ProcessedData | ProcessedOperator) {
        if (this.activeQueryPart === 'key') {
            // Process only if query key has changed
            if (this.query.keyDisplayStr !== data.displayStr) {
                this.query.keyDisplayStr = data.displayStr;
                this.query.keyData = this.availableFiltersCache[data.displayStr].processedData.value;
                this.query.valueDisplayStr = '';
                this.query.valueData = '';
                this.query.condition = this.availableFiltersCache[data.displayStr].conditions[0];
                this.processForValueChange();
            }
        } else if (this.activeQueryPart === 'value') {
            // Process only if the query value has changed and valid query key
            if (this.query.valueDisplayStr !== data.displayStr && this.availableFiltersCache[this.query.keyDisplayStr]) {
                this.query.valueDisplayStr = data.displayStr;
                this.query.valueData = this.availableFiltersCache[this.query.keyDisplayStr].processedSuggestions[data.displayStr].value;
                this.processForValueChange();
            }
        } else if (this.activeQueryPart === 'condition') {
            // Process only if the query condition has changed
            if (this.query.condition.displayStr !== data.displayStr) {
                this.query.condition = <ProcessedOperator>data;

                if (this.query.condition.unary) {
                    this.query.valueDisplayStr = '';
                    this.query.valueData = '';
                }
                this.processForValueChange();
            }
        }
    }

    @debounce(200)
    public handleSuggestionsScroll(event) {
        const container = <HTMLElement>event.target;
        const liElement = <HTMLLIElement>container.querySelector('li');
        const filterModel = this.availableFiltersCache[this.query.keyDisplayStr];
        if (liElement && this.activeQueryPart === 'value' &&
            filterModel && filterModel.asyncLoad) {
            if (((container.scrollHeight - (container.scrollTop + container.clientHeight)) / liElement.clientHeight) < 5) {
                filterModel.loadMoreSuggestions();
            }
        }
    }

    public setCustomQueryValue(event: KeyboardEvent) {
        if ((event.keyCode === 13) && this.value) {
            const processedCustomValue = this.availableFiltersCache[this.query.keyDisplayStr].processCustomValue(this.value);
            this.query.valueDisplayStr = processedCustomValue.displayStr;
            this.query.valueData = processedCustomValue.value;
            this.valueInput.nativeElement.blur();
            this.processForValueChange();
        }
    }

    public processForValueChange() {
        this.query.isValid = !!(this.query.keyDisplayStr && this.query.condition &&
            (this.query.condition.unary || this.query.valueDisplayStr));
        this.queryUpdated.next(this.query);
    }

    public triggerRemoveQuery() {
        this.removeQuery.emit(this.query);
    }

    public checkAndUpdatedQueryValue(event: KeyboardEvent) {
        if ((event.keyCode === 13) && this.value) {
            this.query.valueDisplayStr = this.value;
            this.query.valueData = this.value;
            this.showSuggestionsContainer = false;
            this.processForValueChange();
            this.valueInput.nativeElement.blur();
        }
    }
}
