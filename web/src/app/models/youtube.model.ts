export interface Youtube {
  etag: string;
  items: string[];
  kind: string;
  pageInfo: {
    totalResults?: number,
    resultsPerPage?: number,
  };
}
