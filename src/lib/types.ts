// Shoe database type
export type Shoe = {
  id: string;
  brand: string;
  model: string;
  slug: string;
  image_url: string | null;
  downturn: 'flat' | 'moderate' | 'aggressive';
  closure: 'lace' | 'velcro' | 'slipper';
  volume: 'low' | 'medium' | 'high';
  width: 'narrow' | 'medium' | 'wide';
  heel: 'narrow' | 'medium' | 'wide';
  toe_patch: 'small' | 'medium' | 'large';
  asymmetry: 'none' | 'slight' | 'strong';
  rubber_type: string;
  rubber_hardness: 'soft' | 'medium' | 'hard';
  rubber_thickness_mm: number;
  midsole: 'full' | '3/4' | 'half' | 'none';
  best_rock_types: string[];
  best_wall_angles: string[];
  best_foothold_types: string[];
  optimal_temp_min_c: number;
  optimal_temp_max_c: number;
  price_eur: number;
  price_usd: number;
  skill_level: 'beginner' | 'hobby' | 'intermediate' | 'advanced' | 'elite';
  use_cases: string[];
  description: string;
  customer_voices: {
    pros: string[];
    cons: string[];
    used_for: string[];
    fit: string;
  } | null;
  vegan: boolean;
};

// Shoe with match score
export type ScoredShoe = Shoe & {
  matchScore: number;
  matchDetails: MatchDetail[];
};

export type MatchDetail = {
  category: string;
  matched: boolean;
  partial: boolean;
  points: number;
  maxPoints: number;
};

// Filter types
export type RockType = 'limestone' | 'granite' | 'sandstone' | 'indoor';
export type WallAngle = 'slab' | 'vertical' | 'overhang' | 'roof';
export type FootholdType = 'smears' | 'edges' | 'pockets' | 'cracks';
export type SkillLevel = 'beginner' | 'hobby' | 'intermediate' | 'advanced' | 'elite';
export type UseCase = 'sport' | 'boulder' | 'trad_multipitch' | 'speed';
export type Sensitivity = 'very_sensitive' | 'sensitive' | 'medium' | 'supportive' | 'very_supportive';

// Guided filters (quick picks)
export type GuidedFilters = {
  rockType: RockType | null;
  wallAngle: WallAngle | null;
  footholdType: FootholdType | null;
  skillLevel: SkillLevel | null;
  useCase: UseCase | null;
  sensitivity: Sensitivity | null;
};

// Advanced filters (multiselect)
export type AdvancedFilters = {
  downturn: string[];
  closure: string[];
  rubberHardness: string[];
  rubberThickness: string[]; // 'thin', 'medium', 'thick'
  rubberType: string[];
  midsole: string[];
  volume: string[];
  width: string[];
  heel: string[];
  toePatch: string[];
  asymmetry: string[];
  priceRange: [number, number];
  brand: string[];
  vegan: boolean | null;
};

// Combined filters
export type ShoeFilters = {
  guided: GuidedFilters;
  advanced: AdvancedFilters;
};

// Default filter state
export const defaultGuidedFilters: GuidedFilters = {
  rockType: null,
  wallAngle: null,
  footholdType: null,
  skillLevel: null,
  useCase: null,
  sensitivity: null,
};

export const defaultAdvancedFilters: AdvancedFilters = {
  downturn: [],
  closure: [],
  rubberHardness: [],
  rubberThickness: [],
  rubberType: [],
  midsole: [],
  volume: [],
  width: [],
  heel: [],
  toePatch: [],
  asymmetry: [],
  priceRange: [50, 250],
  brand: [],
  vegan: null,
};
