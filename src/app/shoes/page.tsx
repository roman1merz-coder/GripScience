'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { rankShoes } from '@/lib/shoe-matcher';
import { ShoeCard } from '@/components/ShoeCard';
import { FilterGroup, MultiSelectFilter, PriceRangeFilter, VeganFilter } from '@/components/Filters';
import { FootShapeFilter } from '@/components/FootShapeFilter';
import type { Shoe, ScoredShoe, GuidedFilters, AdvancedFilters, FootShapeFilters } from '@/lib/types';
import { defaultGuidedFilters, defaultAdvancedFilters, defaultFootShapeFilters } from '@/lib/types';

// Filter options
const ROCK_TYPES = [
  { value: 'limestone', label: 'Limestone' },
  { value: 'granite', label: 'Granite' },
  { value: 'sandstone', label: 'Sandstone' },
  { value: 'indoor', label: 'Indoor' },
];

const WALL_ANGLES = [
  { value: 'slab', label: 'Slab' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'overhang', label: 'Overhang' },
  { value: 'roof', label: 'Roof' },
];

const FOOTHOLD_TYPES = [
  { value: 'smears', label: 'Smears' },
  { value: 'edges', label: 'Edges' },
  { value: 'pockets', label: 'Pockets' },
  { value: 'cracks', label: 'Cracks' },
];

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'hobby', label: 'Hobby' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' },
];

const USE_CASES = [
  { value: 'sport', label: 'Sport' },
  { value: 'boulder', label: 'Boulder' },
  { value: 'trad_multipitch', label: 'Trad/Multipitch' },
  { value: 'speed', label: 'Speed' },
];

const SENSITIVITIES = [
  { value: 'very_sensitive', label: 'Very Sensitive' },
  { value: 'sensitive', label: 'Sensitive' },
  { value: 'medium', label: 'Medium' },
  { value: 'supportive', label: 'Supportive' },
  { value: 'very_supportive', label: 'Very Supportive' },
];

// Advanced filter options
const DOWNTURNS = [
  { value: 'flat', label: 'Flat' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'aggressive', label: 'Aggressive' },
];

const CLOSURES = [
  { value: 'lace', label: 'Lace' },
  { value: 'velcro', label: 'Velcro' },
  { value: 'slipper', label: 'Slipper' },
];

const RUBBER_HARDNESS = [
  { value: 'soft', label: 'Soft' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const RUBBER_THICKNESS = [
  { value: 'thin', label: 'Thin (<3.5mm)' },
  { value: 'medium', label: 'Medium (3.5-4mm)' },
  { value: 'thick', label: 'Thick (>4mm)' },
];

const MIDSOLES = [
  { value: 'full', label: 'Full' },
  { value: '3/4', label: '3/4' },
  { value: 'half', label: 'Half' },
  { value: 'none', label: 'None' },
];

const VOLUMES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const WIDTHS = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'medium', label: 'Medium' },
  { value: 'wide', label: 'Wide' },
];

const HEELS = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'medium', label: 'Medium' },
  { value: 'wide', label: 'Wide' },
];

const TOE_PATCHES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const ASYMMETRIES = [
  { value: 'none', label: 'None' },
  { value: 'slight', label: 'Slight' },
  { value: 'strong', label: 'Strong' },
];

export default function ShoeSelector() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [rankedShoes, setRankedShoes] = useState<ScoredShoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [guidedFilters, setGuidedFilters] = useState<GuidedFilters>(defaultGuidedFilters);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(defaultAdvancedFilters);
  const [footShapeFilters, setFootShapeFilters] = useState<FootShapeFilters>(defaultFootShapeFilters);
  
  // Fetch shoes from Supabase
  useEffect(() => {
    async function fetchShoes() {
      const { data, error } = await supabase.from('shoes').select('*');
      if (error) {
        console.error('Error fetching shoes:', error);
      } else {
        setShoes(data || []);
      }
      setLoading(false);
    }
    fetchShoes();
  }, []);
  
  // Re-rank shoes when filters change
  useEffect(() => {
    if (shoes.length > 0) {
      const ranked = rankShoes(shoes, guidedFilters, advancedFilters, footShapeFilters);
      setRankedShoes(ranked);
    }
  }, [shoes, guidedFilters, advancedFilters, footShapeFilters]);
  
  // Get unique brands for filter
  const brands = [...new Set(shoes.map(s => s.brand))].map(b => ({ value: b, label: b }));
  
  const clearAllFilters = () => {
    setGuidedFilters(defaultGuidedFilters);
    setAdvancedFilters(defaultAdvancedFilters);
    setFootShapeFilters(defaultFootShapeFilters);
  };
  
  const hasActiveFilters = 
    Object.values(guidedFilters).some(v => v !== null) ||
    Object.entries(advancedFilters).some(([key, value]) => {
      if (key === 'priceRange') return value[0] > 50 || value[1] < 250;
      if (key === 'vegan') return value !== null;
      if (Array.isArray(value)) return value.length > 0;
      return false;
    }) ||
    footShapeFilters.toeForm.length > 0 ||
    footShapeFilters.footWidth.length > 0 ||
    footShapeFilters.instepHeight.length > 0 ||
    footShapeFilters.heelVolume.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-grip-50 to-white">
      {/* Header */}
      <div className="bg-grip-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Shoe Selector</h1>
          <p className="text-grip-100">Find the perfect climbing shoe for your style</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-grip-500 hover:text-grip-600"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {/* Guided Filters */}
              <FilterGroup
                title="Rock Type"
                options={ROCK_TYPES}
                selected={guidedFilters.rockType}
                onChange={(v) => setGuidedFilters({ ...guidedFilters, rockType: v as any })}
              />
              
              <FilterGroup
                title="Wall Angle"
                options={WALL_ANGLES}
                selected={guidedFilters.wallAngle}
                onChange={(v) => setGuidedFilters({ ...guidedFilters, wallAngle: v as any })}
              />
              
              <FilterGroup
                title="Foothold Type"
                options={FOOTHOLD_TYPES}
                selected={guidedFilters.footholdType}
                onChange={(v) => setGuidedFilters({ ...guidedFilters, footholdType: v as any })}
              />
              
              <FilterGroup
                title="Skill Level"
                options={SKILL_LEVELS}
                selected={guidedFilters.skillLevel}
                onChange={(v) => setGuidedFilters({ ...guidedFilters, skillLevel: v as any })}
              />
              
              <FilterGroup
                title="Use Case"
                options={USE_CASES}
                selected={guidedFilters.useCase}
                onChange={(v) => setGuidedFilters({ ...guidedFilters, useCase: v as any })}
              />
              
              <FilterGroup
                title="Sensitivity"
                options={SENSITIVITIES}
                selected={guidedFilters.sensitivity}
                onChange={(v) => setGuidedFilters({ ...guidedFilters, sensitivity: v as any })}
              />
              
              {/* Foot Shape Filter */}
              <FootShapeFilter
                filters={footShapeFilters}
                onChange={setFootShapeFilters}
              />
              
              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full py-3 text-sm font-medium text-grip-500 hover:text-grip-600 border-t mt-4 pt-4 flex justify-between items-center"
              >
                <span>Advanced Filters</span>
                <span>{showAdvanced ? '▲' : '▼'}</span>
              </button>
              
              {showAdvanced && (
                <div className="mt-4 pt-4 border-t">
                  <MultiSelectFilter
                    title="Downturn"
                    options={DOWNTURNS}
                    selected={advancedFilters.downturn}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, downturn: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Closure"
                    options={CLOSURES}
                    selected={advancedFilters.closure}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, closure: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Rubber Hardness"
                    options={RUBBER_HARDNESS}
                    selected={advancedFilters.rubberHardness}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, rubberHardness: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Rubber Thickness"
                    options={RUBBER_THICKNESS}
                    selected={advancedFilters.rubberThickness}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, rubberThickness: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Midsole"
                    options={MIDSOLES}
                    selected={advancedFilters.midsole}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, midsole: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Volume"
                    options={VOLUMES}
                    selected={advancedFilters.volume}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, volume: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Width"
                    options={WIDTHS}
                    selected={advancedFilters.width}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, width: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Heel"
                    options={HEELS}
                    selected={advancedFilters.heel}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, heel: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Toe Patch"
                    options={TOE_PATCHES}
                    selected={advancedFilters.toePatch}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, toePatch: v })}
                  />
                  
                  <MultiSelectFilter
                    title="Asymmetry"
                    options={ASYMMETRIES}
                    selected={advancedFilters.asymmetry}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, asymmetry: v })}
                  />
                  
                  {brands.length > 0 && (
                    <MultiSelectFilter
                      title="Brand"
                      options={brands}
                      selected={advancedFilters.brand}
                      onChange={(v) => setAdvancedFilters({ ...advancedFilters, brand: v })}
                    />
                  )}
                  
                  <PriceRangeFilter
                    min={50}
                    max={250}
                    value={advancedFilters.priceRange}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, priceRange: v })}
                  />
                  
                  <VeganFilter
                    value={advancedFilters.vegan}
                    onChange={(v) => setAdvancedFilters({ ...advancedFilters, vegan: v })}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {loading ? 'Loading...' : `Top ${rankedShoes.length} matches`}
              </h2>
              {hasActiveFilters && (
                <span className="text-sm text-gray-500">
                  Filtered by {
                    Object.values(guidedFilters).filter(v => v !== null).length + 
                    Object.values(advancedFilters).filter(v => 
                      Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined
                    ).length +
                    footShapeFilters.toeForm.length +
                    footShapeFilters.footWidth.length +
                    footShapeFilters.instepHeight.length +
                    footShapeFilters.heelVolume.length
                  } criteria
                </span>
              )}
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse" />
                ))}
              </div>
            ) : rankedShoes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-4xl mb-4">👟</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No shoes in database yet</h3>
                <p className="text-gray-500">Add some shoes to see recommendations!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rankedShoes.map((shoe, index) => (
                  <ShoeCard key={shoe.id} shoe={shoe} rank={index + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
