import { of } from "rxjs";
import { delay } from 'rxjs/operators';

import { ProcessedData, SearchTextCache, QueryDataType, QueryPart, ProcessedOperator } from './../interfaces';

const Config = {
  errorHandler: (err: any) => console.log(err),
  httpService: <any>{},
  pageSize: 10
};

const NumberOnlySupport = { number: true, any: true };
const StringOnlySupport = { string: true, any: true };

const AllConditions: ProcessedOperator[] = [
  { displayStr: '=', displayStrLC: '=', value: '=', supportedDataTypes: NumberOnlySupport },
  { displayStr: '!=', displayStrLC: '!=', value: '!=', supportedDataTypes: NumberOnlySupport },
  { displayStr: '>', displayStrLC: '>', value: '>', supportedDataTypes: NumberOnlySupport },
  { displayStr: '>=', displayStrLC: '>=', value: '>=', supportedDataTypes: NumberOnlySupport },
  { displayStr: '<', displayStrLC: '<', value: '<', supportedDataTypes: NumberOnlySupport },
  { displayStr: '<=', displayStrLC: '<=', value: '<=', supportedDataTypes: NumberOnlySupport },

  { displayStr: 'Equal', displayStrLC: 'equal', value: 'equal', supportedDataTypes: StringOnlySupport },
  { displayStr: 'Not Equal', displayStrLC: 'not equal', value: 'not equal', supportedDataTypes: StringOnlySupport },
  { displayStr: 'Contains', displayStrLC: 'contains', value: 'contains', supportedDataTypes: StringOnlySupport },
  { displayStr: 'Startswith', displayStrLC: 'startswith', value: 'startswith', supportedDataTypes: StringOnlySupport },
  { displayStr: 'Endswith', displayStrLC: 'endswith', value: 'endswith', supportedDataTypes: StringOnlySupport },
  { displayStr: 'Not Empty', displayStrLC: 'not empty', value: 'not empty', supportedDataTypes: StringOnlySupport, unary: true },
];

const NumberOnlyConditions = AllConditions.filter((c) => c.supportedDataTypes['number']);
const StringOnlyConditions = AllConditions.filter((c) => c.supportedDataTypes['string']);

export class SingleFilterModel {
  public processedData: ProcessedData;
  public processedSuggestions: { [suggestion: string]: ProcessedData };
  public conditions: ProcessedOperator[];

  public filteredSuggestions: ProcessedData[];
  public suggestionsCacheBySearchText: { [searchText: string]: SearchTextCache } = {};

  public loading = false;
  public loadingSearchText: { [searchText: string]: boolean } = {};

  private _searchText = '';

  constructor(public name: string, public data: any, public suggestions: any[], public dataType: QueryDataType = 'any',
    public config = Config, public asyncLoad = false) {
    this.processedData = {
      data: this.data,
      displayStr: this.processForDisplay(this.data, 'key'),
      displayStrLC: this.processForDisplay(this.data, 'key').toLowerCase(),
      value: this.processForValue(this.data, 'key')
    };

    this.processedSuggestions = {};
    this.processSuggestions(this.suggestions);

    this.config = Object.assign({}, Config, this.config);
    if (this.dataType === 'number') {
      this.conditions = NumberOnlyConditions;
    } else if (this.dataType === 'string') {
      this.conditions = StringOnlyConditions;
    } else if (this.dataType === 'any') {
      this.conditions = AllConditions;
    }
  }

  get searchText() {
    return this._searchText;
  }

  set searchText(searchText) {
    searchText = searchText.toLowerCase();
    this._searchText = searchText;

    if (this.suggestionsCacheBySearchText[searchText]) {
      this.filteredSuggestions = this.suggestionsCacheBySearchText[searchText].suggestions;
      this.loading = false;
    } else {
      this.suggestionsCacheBySearchText[searchText] = {
        pageIndex: 0,
        suggestions: [],
        loadMoreAvailable: true
      };
      this.filteredSuggestions = this.suggestionsCacheBySearchText[searchText].suggestions;
      this.loadMoreSuggestions(searchText);
    }
  }

  public processForDisplay(data, type: QueryPart): string {
    return data;
  }

  public processForValue(data, type: QueryPart): any {
    return data;
  }

  public processSuggestions(suggestions) {
    return suggestions.map((data) => {
      const displayStr = this.processForDisplay(data, 'value');

      if (!this.processedSuggestions[displayStr]) {
        // Process for new suggestion item
        const displayStrLC = displayStr.toLowerCase();
        const value = this.processForValue(data, 'value');

        this.processedSuggestions[displayStr] = { data, displayStr, displayStrLC, value };
      }

      return this.processedSuggestions[displayStr];
    });
  }

  public loadFromApi(searchText: string) {
    // throw new Error('loadFromApi is not implemented.');
    return of(Array(this.config.pageSize).fill('').map(() => searchText + (Math.random() * 100).toString()))
      .pipe(delay(100));
  }

  public processApiResponse(response: any): any[] {
    // throw new Error('Process API response is not implemented.');
    return response;
  }

  public processCustomValue(value: string): ProcessedData {
    return {
      data: value,
      displayStr: value,
      displayStrLC: value.toLowerCase(),
      value,
    };
  }

  public filterOfflineSuggestion(searchText: string, suggestion: ProcessedData): boolean {
    return (suggestion.displayStrLC.indexOf(searchText) >= 0);
  }

  public loadMoreSuggestions(searchText = this.searchText) {
    searchText = searchText.toLowerCase();
    this.searchText = searchText;

    if (this.asyncLoad) {
      // Process for async type loading of suggestions

      if (this.loadingSearchText[searchText]) {
        // Already loading for this searchText
        this.loading = true;
      } else if (this.suggestionsCacheBySearchText[searchText].loadMoreAvailable) {
        // More options available for this searchText
        this.loading = true;
        this.loadingSearchText[searchText] = true;

        this.loadFromApi(searchText)
          .subscribe(
            (response) => {
              const newSuggestions = this.processApiResponse(response);
              const suggestionCache = this.suggestionsCacheBySearchText[searchText];
              suggestionCache.pageIndex += 1;
              suggestionCache.loadMoreAvailable = (newSuggestions.length === this.config.pageSize);
              suggestionCache.suggestions.push.apply(suggestionCache.suggestions, this.processSuggestions(newSuggestions));

              this.loadingSearchText[searchText] = false;
              this.loading = (searchText === this.searchText);
            },
            (err) => {
              this.loadingSearchText[searchText] = false;
              this.loading = (searchText === this.searchText);
              this.config.errorHandler(err);
            }
          );
      }
    } else if (this.suggestionsCacheBySearchText[searchText].loadMoreAvailable) {
      const suggestionsCacheArr = this.suggestionsCacheBySearchText[searchText].suggestions;
      Object.values(this.processedSuggestions)
        .filter((suggestion) => this.filterOfflineSuggestion(searchText, suggestion))
        .map((suggestion) => suggestionsCacheArr.push(suggestion));
      // TODO: Sort `suggestionsCacheArr` items by displayStr
      this.suggestionsCacheBySearchText[searchText].loadMoreAvailable = false;
    }
  }
}
