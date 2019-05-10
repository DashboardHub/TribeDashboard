export interface Youtube {
  etag: string;
  items: Array<string>;
  kind: string;
  pageInfo: {
    totalResults?: number,
    resultsPerPage?: number,
  };
}
