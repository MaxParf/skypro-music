export type ApiCollection = {
  _id: number;
  name?: string;
  items: number[];
  owner: number[];
  __v: number;
};

export type CollectionSummary = {
  id: number;
  title: string;
  trackIds: number[];
};

export type Collection = CollectionSummary;
