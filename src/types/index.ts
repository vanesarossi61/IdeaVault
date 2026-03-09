import type {
  Idea,
  IdeaScore,
  Tag,
  IdeaTag,
  CommunitySignal,
  Trend,
  TrendDataPoint,
  Tool,
  ToolStack,
  User,
  Subscription,
  UserIdeaInteraction,
  Complexity,
  IdeaStatus,
  InteractionType,
  SubscriptionPlan,
  SubscriptionStatus,
  SignalSource,
  Pricing,
  Role,
} from "@prisma/client";

// ===== RE-EXPORTS =====
export type {
  Idea,
  IdeaScore,
  Tag,
  IdeaTag,
  CommunitySignal,
  Trend,
  TrendDataPoint,
  Tool,
  ToolStack,
  User,
  Subscription,
  UserIdeaInteraction,
  Complexity,
  IdeaStatus,
  InteractionType,
  SubscriptionPlan,
  SubscriptionStatus,
  SignalSource,
  Pricing,
  Role,
};

// ===== COMPOSITE TYPES =====

/** Idea with all related data loaded */
export type IdeaWithRelations = Idea & {
  scores: IdeaScore | null;
  tags: (IdeaTag & { tag: Tag })[];
  signals: CommunitySignal[];
  _count: {
    interactions: number;
    comments: number;
    upvotes: number;
  };
};

/** Trend with its historical data points */
export type TrendWithDataPoints = Trend & {
  dataPoints: TrendDataPoint[];
};

/** Tool with its stack category */
export type ToolWithStack = Tool & {
  stack: ToolStack | null;
};

/** User profile with subscription and computed stats */
export type UserProfile = User & {
  subscription: Subscription | null;
  stats: {
    ideasSaved: number;
    ideasBuilding: number;
    ideasInterested: number;
    trendsFollowing: number;
    commentsCount: number;
    upvotesCount: number;
  };
};

// ===== FILTER & QUERY TYPES =====

/** Tab options for the idea database view */
export type IdeaTab =
  | "new"
  | "for-you"
  | "interested"
  | "saved"
  | "building"
  | "hidden";

/** Sort options for ideas */
export type IdeaSortBy =
  | "newest"
  | "highest-score"
  | "most-popular"
  | "trending";

/** Filter parameters for querying ideas */
export interface IdeaFilters {
  category?: string;
  revenueModel?: string;
  complexity?: Complexity;
  minScore?: number;
  sortBy?: IdeaSortBy;
  tab?: IdeaTab;
  search?: string;
}

// ===== API RESPONSE TYPES =====

/** Generic paginated response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  totalCount: number;
}

/** Subscription tier type alias */
export type SubscriptionTier = SubscriptionPlan;

/** Generic API response wrapper for client-side usage */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// ===== COMPONENT PROP TYPES =====

/** Props for idea card components */
export interface IdeaCardProps {
  idea: IdeaWithRelations;
  userInteraction?: InteractionType | null;
  onInteraction?: (type: InteractionType) => void;
}

/** Props for trend chart components */
export interface TrendChartProps {
  trend: TrendWithDataPoints;
  height?: number;
  showLabels?: boolean;
}

/** Props for stat card components */
export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
}

// ===== FORM TYPES =====

/** Comment form data */
export interface CommentFormData {
  body: string;
  parentId?: string;
}

/** User profile update data */
export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  image?: string;
}

// ===== NAVIGATION TYPES =====

/** Sidebar navigation item */
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}
