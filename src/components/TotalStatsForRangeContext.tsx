import { createContext } from "react";

export type TotalStatsType = {
  totalInserts: number;
  totalUpdates: number;
  totalDeletes: number;
};

export const TotalStatsForRangeContext = createContext<TotalStatsType>({
  totalInserts: 0,
  totalUpdates: 0,
  totalDeletes: 0,
});
