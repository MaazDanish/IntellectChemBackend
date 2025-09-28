
export interface ISearchHistory {
    userId: string;
    searchKeywords: { field: string | any; value: string | number | boolean | any }[]; // array of objects
    searchType: number;
    ipAddress: string;
    fullName: string;
    emailId: string;
    totalRecords: number;
    totalFilteredRecords: number;
    searchedDatabase: number,
    searchedOn: Date
}

