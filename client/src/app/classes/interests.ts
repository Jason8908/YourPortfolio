export interface Interest {
  id: number;
  interest: string;
}

export interface InterestList {
  totalCount: number;
  interests: Array<Interest>;
}
