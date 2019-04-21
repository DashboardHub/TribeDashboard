export interface SocialStatsHistory {
  provider: string;
  userId: string;
  followers: number;
  following: number;
  repos?: number;
  tweets?: number;
  createdAt: string;
}
