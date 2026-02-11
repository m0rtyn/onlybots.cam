/** Category of a statistic card */
export type StatisticCategory =
  | 'mental-health'
  | 'financial'
  | 'exploitation'
  | 'trafficking'
  | 'violence';

/** A single bait→reveal stat card pairing */
export interface Statistic {
  id: string;
  baitLabel: string;
  baitValue: string;
  revealStat: string;
  revealDetail: string;
  source: string;
  sourceUrl: string;
  category: StatisticCategory;
}

/** An anonymized testimony from a former webcam worker or expert */
export interface Testimony {
  id: string;
  quote: string;
  attribution: string;
  source: string;
  sourceUrl: string;
}

/** Category of an external resource link */
export type ResourceCategory =
  | 'anti-trafficking'
  | 'research'
  | 'support'
  | 'reporting';

/** An anti-trafficking / support organization or resource */
export interface Resource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ResourceCategory;
}
