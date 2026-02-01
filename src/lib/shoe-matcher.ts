import type { 
  Shoe, 
  ScoredShoe, 
  MatchDetail,
  GuidedFilters, 
  AdvancedFilters,
  RockType,
  WallAngle,
  FootholdType,
  UseCase,
  Sensitivity,
  SkillLevel
} from './types';

// ============================================
// DERIVED RULES
// ============================================

const ROCK_TYPE_RULES: Record<RockType, Partial<Record<keyof Shoe, string[]>>> = {
  limestone: {
    rubber_hardness: ['soft', 'medium'],
    toe_patch: ['medium', 'large'],
    midsole: ['half', '3/4'],
  },
  granite: {
    rubber_hardness: ['medium', 'hard'],
    midsole: ['3/4', 'full'],
  },
  sandstone: {
    rubber_hardness: ['soft', 'medium'],
    midsole: ['none', 'half'],
    toe_patch: ['medium', 'large'],
  },
  indoor: {
    rubber_hardness: ['soft', 'medium'],
    closure: ['velcro', 'slipper'],
    toe_patch: ['medium', 'large'],
  },
};

const WALL_ANGLE_RULES: Record<WallAngle, Partial<Record<keyof Shoe, string[]>>> = {
  slab: {
    downturn: ['flat'],
    asymmetry: ['none'],
    midsole: ['full', '3/4'],
    rubber_hardness: ['medium', 'hard'],
  },
  vertical: {
    downturn: ['flat', 'moderate'],
    midsole: ['full', '3/4', 'half'],
  },
  overhang: {
    downturn: ['moderate', 'aggressive'],
    toe_patch: ['medium', 'large'],
    rubber_hardness: ['soft', 'medium'],
  },
  roof: {
    downturn: ['aggressive'],
    toe_patch: ['large'],
    rubber_hardness: ['soft'],
  },
};

const FOOTHOLD_TYPE_RULES: Record<FootholdType, Partial<Record<keyof Shoe, string[] | number>>> = {
  smears: {
    rubber_hardness: ['soft', 'medium'],
    downturn: ['flat', 'moderate'],
    midsole: ['3/4', 'full'],
  },
  edges: {
    rubber_hardness: ['medium', 'hard'],
    midsole: ['3/4', 'full'],
    asymmetry: ['slight', 'strong'],
    downturn: ['moderate', 'aggressive'],
  },
  pockets: {
    downturn: ['moderate', 'aggressive'],
    asymmetry: ['strong'],
    midsole: ['3/4', 'full'],
  },
  cracks: {
    downturn: ['flat'],
    midsole: ['full', '3/4'],
    rubber_hardness: ['medium', 'hard'],
    rubber_thickness_mm: 4.0, // minimum value
  },
};

const USE_CASE_RULES: Record<UseCase, Partial<Record<keyof Shoe, string[]>>> = {
  sport: {
    downturn: ['moderate', 'aggressive'],
    closure: ['velcro', 'lace'],
    rubber_hardness: ['soft', 'medium'],
  },
  boulder: {
    downturn: ['moderate', 'aggressive'],
    rubber_hardness: ['soft', 'medium'],
    midsole: ['half', 'none'],
    closure: ['slipper', 'velcro'],
  },
  trad_multipitch: {
    downturn: ['flat', 'moderate'],
    midsole: ['full', '3/4'],
    closure: ['lace'],
    rubber_hardness: ['medium', 'hard'],
  },
  speed: {
    closure: ['velcro', 'slipper'],
    downturn: ['flat', 'moderate'],
  },
};

const SKILL_LEVEL_ORDER: SkillLevel[] = ['beginner', 'hobby', 'intermediate', 'advanced', 'elite'];

// ============================================
// SENSITIVITY CALCULATION
// ============================================

function calculateSensitivity(shoe: Shoe): Sensitivity {
  let score = 0;
  
  // Rubber hardness
  if (shoe.rubber_hardness === 'soft') score += 2;
  else if (shoe.rubber_hardness === 'medium') score += 1;
  
  // Rubber thickness
  if (shoe.rubber_thickness_mm < 3.5) score += 2;
  else if (shoe.rubber_thickness_mm <= 4.0) score += 1;
  
  // Midsole
  if (shoe.midsole === 'none') score += 2;
  else if (shoe.midsole === 'half') score += 1;
  
  // Map score to sensitivity
  if (score >= 5) return 'very_sensitive';
  if (score === 4) return 'sensitive';
  if (score === 3) return 'medium';
  if (score === 2) return 'supportive';
  return 'very_supportive';
}

const SENSITIVITY_ORDER: Sensitivity[] = ['very_supportive', 'supportive', 'medium', 'sensitive', 'very_sensitive'];

// ============================================
// MATCHING FUNCTIONS
// ============================================

function matchesRule(shoe: Shoe, rules: Partial<Record<keyof Shoe, string[] | number>>): { matches: number; total: number } {
  let matches = 0;
  let total = 0;
  
  for (const [key, allowedValues] of Object.entries(rules)) {
    total++;
    const shoeValue = shoe[key as keyof Shoe];
    
    if (typeof allowedValues === 'number') {
      // Numeric comparison (e.g., rubber_thickness_mm >= 4.0)
      if (typeof shoeValue === 'number' && shoeValue >= allowedValues) {
        matches++;
      }
    } else if (Array.isArray(allowedValues)) {
      // String match
      if (allowedValues.includes(shoeValue as string)) {
        matches++;
      }
    }
  }
  
  return { matches, total };
}

function scoreRockType(shoe: Shoe, rockType: RockType): { points: number; maxPoints: number; matched: boolean; partial: boolean } {
  const rules = ROCK_TYPE_RULES[rockType];
  const { matches, total } = matchesRule(shoe, rules);
  const percentage = matches / total;
  
  const maxPoints = 20;
  const points = Math.round(percentage * maxPoints);
  
  return {
    points,
    maxPoints,
    matched: percentage >= 0.75,
    partial: percentage >= 0.5 && percentage < 0.75,
  };
}

function scoreWallAngle(shoe: Shoe, wallAngle: WallAngle): { points: number; maxPoints: number; matched: boolean; partial: boolean } {
  const rules = WALL_ANGLE_RULES[wallAngle];
  const { matches, total } = matchesRule(shoe, rules);
  const percentage = matches / total;
  
  const maxPoints = 20;
  const points = Math.round(percentage * maxPoints);
  
  return {
    points,
    maxPoints,
    matched: percentage >= 0.75,
    partial: percentage >= 0.5 && percentage < 0.75,
  };
}

function scoreFootholdType(shoe: Shoe, footholdType: FootholdType): { points: number; maxPoints: number; matched: boolean; partial: boolean } {
  const rules = FOOTHOLD_TYPE_RULES[footholdType];
  const { matches, total } = matchesRule(shoe, rules);
  const percentage = matches / total;
  
  const maxPoints = 15;
  const points = Math.round(percentage * maxPoints);
  
  return {
    points,
    maxPoints,
    matched: percentage >= 0.75,
    partial: percentage >= 0.5 && percentage < 0.75,
  };
}

function scoreSkillLevel(shoe: Shoe, targetLevel: SkillLevel): { points: number; maxPoints: number; matched: boolean; partial: boolean } {
  const shoeIndex = SKILL_LEVEL_ORDER.indexOf(shoe.skill_level);
  const targetIndex = SKILL_LEVEL_ORDER.indexOf(targetLevel);
  const distance = Math.abs(shoeIndex - targetIndex);
  
  const maxPoints = 15;
  
  if (distance === 0) {
    return { points: maxPoints, maxPoints, matched: true, partial: false };
  } else if (distance === 1) {
    return { points: Math.round(maxPoints * 0.5), maxPoints, matched: false, partial: true };
  }
  
  return { points: 0, maxPoints, matched: false, partial: false };
}

function scoreUseCase(shoe: Shoe, useCase: UseCase): { points: number; maxPoints: number; matched: boolean; partial: boolean } {
  const rules = USE_CASE_RULES[useCase];
  const { matches, total } = matchesRule(shoe, rules);
  const percentage = matches / total;
  
  const maxPoints = 10;
  const points = Math.round(percentage * maxPoints);
  
  return {
    points,
    maxPoints,
    matched: percentage >= 0.75,
    partial: percentage >= 0.5 && percentage < 0.75,
  };
}

function scoreSensitivity(shoe: Shoe, targetSensitivity: Sensitivity): { points: number; maxPoints: number; matched: boolean; partial: boolean } {
  const shoeSensitivity = calculateSensitivity(shoe);
  const shoeIndex = SENSITIVITY_ORDER.indexOf(shoeSensitivity);
  const targetIndex = SENSITIVITY_ORDER.indexOf(targetSensitivity);
  const distance = Math.abs(shoeIndex - targetIndex);
  
  const maxPoints = 10;
  
  if (distance === 0) {
    return { points: maxPoints, maxPoints, matched: true, partial: false };
  } else if (distance === 1) {
    return { points: Math.round(maxPoints * 0.5), maxPoints, matched: false, partial: true };
  }
  
  return { points: 0, maxPoints, matched: false, partial: false };
}

// ============================================
// ADVANCED FILTER MATCHING
// ============================================

function scoreAdvancedFilters(shoe: Shoe, filters: AdvancedFilters): { points: number; maxPoints: number; details: MatchDetail[] } {
  const details: MatchDetail[] = [];
  let points = 0;
  let maxPoints = 0;
  
  const checkMultiSelect = (filterValues: string[], shoeValue: string, category: string) => {
    if (filterValues.length === 0) return;
    maxPoints += 10;
    const matched = filterValues.includes(shoeValue);
    if (matched) points += 10;
    details.push({ category, matched, partial: false, points: matched ? 10 : 0, maxPoints: 10 });
  };
  
  checkMultiSelect(filters.downturn, shoe.downturn, 'Downturn');
  checkMultiSelect(filters.closure, shoe.closure, 'Closure');
  checkMultiSelect(filters.rubberHardness, shoe.rubber_hardness, 'Rubber Hardness');
  checkMultiSelect(filters.midsole, shoe.midsole, 'Midsole');
  checkMultiSelect(filters.volume, shoe.volume, 'Volume');
  checkMultiSelect(filters.width, shoe.width, 'Width');
  checkMultiSelect(filters.heel, shoe.heel, 'Heel');
  checkMultiSelect(filters.toePatch, shoe.toe_patch, 'Toe Patch');
  checkMultiSelect(filters.asymmetry, shoe.asymmetry, 'Asymmetry');
  checkMultiSelect(filters.brand, shoe.brand, 'Brand');
  
  // Rubber thickness
  if (filters.rubberThickness.length > 0) {
    maxPoints += 10;
    let matched = false;
    if (filters.rubberThickness.includes('thin') && shoe.rubber_thickness_mm < 3.5) matched = true;
    if (filters.rubberThickness.includes('medium') && shoe.rubber_thickness_mm >= 3.5 && shoe.rubber_thickness_mm <= 4.0) matched = true;
    if (filters.rubberThickness.includes('thick') && shoe.rubber_thickness_mm > 4.0) matched = true;
    if (matched) points += 10;
    details.push({ category: 'Rubber Thickness', matched, partial: false, points: matched ? 10 : 0, maxPoints: 10 });
  }
  
  // Rubber type
  if (filters.rubberType.length > 0) {
    maxPoints += 10;
    const matched = filters.rubberType.some(rt => shoe.rubber_type.toLowerCase().includes(rt.toLowerCase()));
    if (matched) points += 10;
    details.push({ category: 'Rubber Type', matched, partial: false, points: matched ? 10 : 0, maxPoints: 10 });
  }
  
  // Price range
  if (filters.priceRange[0] > 50 || filters.priceRange[1] < 250) {
    maxPoints += 10;
    const matched = shoe.price_eur >= filters.priceRange[0] && shoe.price_eur <= filters.priceRange[1];
    if (matched) points += 10;
    details.push({ category: 'Price', matched, partial: false, points: matched ? 10 : 0, maxPoints: 10 });
  }
  
  // Vegan
  if (filters.vegan !== null) {
    maxPoints += 10;
    const matched = shoe.vegan === filters.vegan;
    if (matched) points += 10;
    details.push({ category: 'Vegan', matched, partial: false, points: matched ? 10 : 0, maxPoints: 10 });
  }
  
  return { points, maxPoints, details };
}

// ============================================
// MAIN SCORING FUNCTION
// ============================================

export function scoreShoe(shoe: Shoe, guidedFilters: GuidedFilters, advancedFilters: AdvancedFilters): ScoredShoe {
  const matchDetails: MatchDetail[] = [];
  let totalPoints = 0;
  let totalMaxPoints = 0;
  
  // Guided filters
  if (guidedFilters.rockType) {
    const result = scoreRockType(shoe, guidedFilters.rockType);
    totalPoints += result.points;
    totalMaxPoints += result.maxPoints;
    matchDetails.push({ category: 'Rock Type', ...result });
  }
  
  if (guidedFilters.wallAngle) {
    const result = scoreWallAngle(shoe, guidedFilters.wallAngle);
    totalPoints += result.points;
    totalMaxPoints += result.maxPoints;
    matchDetails.push({ category: 'Wall Angle', ...result });
  }
  
  if (guidedFilters.footholdType) {
    const result = scoreFootholdType(shoe, guidedFilters.footholdType);
    totalPoints += result.points;
    totalMaxPoints += result.maxPoints;
    matchDetails.push({ category: 'Foothold Type', ...result });
  }
  
  if (guidedFilters.skillLevel) {
    const result = scoreSkillLevel(shoe, guidedFilters.skillLevel);
    totalPoints += result.points;
    totalMaxPoints += result.maxPoints;
    matchDetails.push({ category: 'Skill Level', ...result });
  }
  
  if (guidedFilters.useCase) {
    const result = scoreUseCase(shoe, guidedFilters.useCase);
    totalPoints += result.points;
    totalMaxPoints += result.maxPoints;
    matchDetails.push({ category: 'Use Case', ...result });
  }
  
  if (guidedFilters.sensitivity) {
    const result = scoreSensitivity(shoe, guidedFilters.sensitivity);
    totalPoints += result.points;
    totalMaxPoints += result.maxPoints;
    matchDetails.push({ category: 'Sensitivity', ...result });
  }
  
  // Advanced filters
  const advancedResult = scoreAdvancedFilters(shoe, advancedFilters);
  totalPoints += advancedResult.points;
  totalMaxPoints += advancedResult.maxPoints;
  matchDetails.push(...advancedResult.details);
  
  // Calculate match score (0-100%)
  // If no filters selected, give base score of 50%
  const matchScore = totalMaxPoints > 0 
    ? Math.round((totalPoints / totalMaxPoints) * 100) 
    : 50;
  
  return {
    ...shoe,
    matchScore,
    matchDetails,
  };
}

export function rankShoes(shoes: Shoe[], guidedFilters: GuidedFilters, advancedFilters: AdvancedFilters): ScoredShoe[] {
  const scoredShoes = shoes.map(shoe => scoreShoe(shoe, guidedFilters, advancedFilters));
  
  // Sort by match score descending
  scoredShoes.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return top 10
  return scoredShoes.slice(0, 10);
}

export { calculateSensitivity };
