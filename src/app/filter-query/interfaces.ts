export type QueryPart = 'key' | 'value' | 'condition';

export type QueryDataType = 'string' | 'number' | 'any';

export interface FilterQueryInfo {
    keyDisplayStr?: string;
    keyData?: any;
    valueDisplayStr?: string;
    valueData?: any;
    condition?: ProcessedOperator;
    isValid?: boolean;
}

export interface ProcessedData {
    data?: any;
    displayStr: string;
    displayStrLC: string;
    value?: any;
}

export interface ProcessedOperator extends ProcessedData {
    icon?: string;      // Operator image URL - For future use
    supportedDataTypes: { [dataType: string]: boolean };
    unary?: boolean;
    value: string;
}

export interface SearchTextCache {
    pageIndex: number;
    loadMoreAvailable: boolean;
    suggestions: ProcessedData[];
}
