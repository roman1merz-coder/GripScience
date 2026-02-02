'use client';

import { useState } from 'react';
import type { FootShapeFilters, ToeForm } from '@/lib/types';

// Toe form SVG icons
const ToeFormIcon = ({ type, selected }: { type: ToeForm; selected: boolean }) => {
  const baseColor = selected ? '#1B4D3E' : '#9CA3AF';
  const bgColor = selected ? '#E6F0ED' : '#F9FAFB';
  
  // Toe lengths for each type (big toe to pinky, relative heights)
  const toePatterns: Record<ToeForm, number[]> = {
    egyptian: [1.0, 0.85, 0.75, 0.65, 0.5],    // Big toe longest, cascade down
    roman: [0.9, 0.9, 0.9, 0.7, 0.5],          // First 3 equal
    greek: [0.85, 1.0, 0.85, 0.7, 0.5],        // 2nd toe longest
    germanic: [1.0, 0.8, 0.8, 0.8, 0.5],       // Big toe long, rest equal
    celtic: [0.85, 1.0, 0.8, 0.8, 0.55],       // 2nd longest, others vary
  };
  
  const toes = toePatterns[type];
  const baseY = 38;
  const toeWidth = 6;
  const spacing = 8;
  const startX = 10;
  
  return (
    <svg viewBox="0 0 56 48" className="w-14 h-12">
      {/* Foot outline */}
      <ellipse cx="28" cy="42" rx="22" ry="6" fill={bgColor} stroke={baseColor} strokeWidth="1.5" />
      
      {/* Toes */}
      {toes.map((height, i) => {
        const x = startX + i * spacing;
        const toeHeight = height * 20;
        return (
          <rect
            key={i}
            x={x}
            y={baseY - toeHeight}
            width={toeWidth}
            height={toeHeight}
            rx={3}
            fill={baseColor}
          />
        );
      })}
    </svg>
  );
};

// Collapsible section component
const CollapsibleSection = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <svg
        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && <div className="pb-4">{children}</div>}
  </div>
);

// Multi-select chip component
const SelectChip = ({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
      ${selected 
        ? 'bg-grip-500 text-white shadow-md' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }
    `}
  >
    {icon}
    {label}
  </button>
);

// Toe form option with icon
const ToeFormOption = ({
  type,
  label,
  description,
  selected,
  onClick,
}: {
  type: ToeForm;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left
      ${selected 
        ? 'border-grip-500 bg-grip-50' 
        : 'border-gray-200 hover:border-gray-300 bg-white'
      }
    `}
  >
    <ToeFormIcon type={type} selected={selected} />
    <div className="flex-1 min-w-0">
      <div className={`text-sm font-medium ${selected ? 'text-grip-700' : 'text-gray-700'}`}>
        {label}
      </div>
      <div className="text-xs text-gray-500 truncate">{description}</div>
    </div>
    {selected && (
      <svg className="w-5 h-5 text-grip-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )}
  </button>
);

// Icons for each section
const ToeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10m-5-4v4m0-4a4 4 0 01-4-4V7a4 4 0 018 0v6a4 4 0 01-4 4z" />
  </svg>
);

const WidthIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);

const HeightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const HeelIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// Main component
export function FootShapeFilter({
  filters,
  onChange,
}: {
  filters: FootShapeFilters;
  onChange: (filters: FootShapeFilters) => void;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    toeForm: false,
    width: false,
    height: false,
    heel: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleToeForm = (form: ToeForm) => {
    const current = filters.toeForm;
    const updated = current.includes(form)
      ? current.filter(f => f !== form)
      : [...current, form];
    onChange({ ...filters, toeForm: updated });
  };

  const toggleWidth = (width: 'narrow' | 'medium' | 'wide') => {
    const current = filters.footWidth;
    const updated = current.includes(width)
      ? current.filter(w => w !== width)
      : [...current, width];
    onChange({ ...filters, footWidth: updated });
  };

  const toggleInstep = (height: 'low' | 'medium' | 'high') => {
    const current = filters.instepHeight;
    const updated = current.includes(height)
      ? current.filter(h => h !== height)
      : [...current, height];
    onChange({ ...filters, instepHeight: updated });
  };

  const toggleHeel = (volume: 'small' | 'medium' | 'large') => {
    const current = filters.heelVolume;
    const updated = current.includes(volume)
      ? current.filter(v => v !== volume)
      : [...current, volume];
    onChange({ ...filters, heelVolume: updated });
  };

  const hasActiveFilters = 
    filters.toeForm.length > 0 ||
    filters.footWidth.length > 0 ||
    filters.instepHeight.length > 0 ||
    filters.heelVolume.length > 0;

  const activeCount = 
    filters.toeForm.length +
    filters.footWidth.length +
    filters.instepHeight.length +
    filters.heelVolume.length;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🦶</span>
          <h3 className="text-sm font-semibold text-gray-900">Foot Shape Match</h3>
          {activeCount > 0 && (
            <span className="bg-grip-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({
              toeForm: [],
              footWidth: [],
              instepHeight: [],
              heelVolume: [],
            })}
            className="text-xs text-grip-500 hover:text-grip-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Toe Form Section */}
      <CollapsibleSection
        title="Toe Form"
        icon={<ToeIcon />}
        isOpen={openSections.toeForm}
        onToggle={() => toggleSection('toeForm')}
      >
        <div className="space-y-2">
          <ToeFormOption
            type="egyptian"
            label="Egyptian"
            description="Big toe longest, descending"
            selected={filters.toeForm.includes('egyptian')}
            onClick={() => toggleToeForm('egyptian')}
          />
          <ToeFormOption
            type="roman"
            label="Roman"
            description="First 3 toes similar length"
            selected={filters.toeForm.includes('roman')}
            onClick={() => toggleToeForm('roman')}
          />
          <ToeFormOption
            type="greek"
            label="Greek"
            description="Second toe longest"
            selected={filters.toeForm.includes('greek')}
            onClick={() => toggleToeForm('greek')}
          />
          <ToeFormOption
            type="germanic"
            label="Germanic"
            description="Big toe long, others equal"
            selected={filters.toeForm.includes('germanic')}
            onClick={() => toggleToeForm('germanic')}
          />
          <ToeFormOption
            type="celtic"
            label="Celtic"
            description="Second longest, others vary"
            selected={filters.toeForm.includes('celtic')}
            onClick={() => toggleToeForm('celtic')}
          />
        </div>
      </CollapsibleSection>

      {/* Foot Width Section */}
      <CollapsibleSection
        title="Foot Width"
        icon={<WidthIcon />}
        isOpen={openSections.width}
        onToggle={() => toggleSection('width')}
      >
        <div className="flex flex-wrap gap-2">
          <SelectChip
            label="Narrow"
            selected={filters.footWidth.includes('narrow')}
            onClick={() => toggleWidth('narrow')}
          />
          <SelectChip
            label="Medium"
            selected={filters.footWidth.includes('medium')}
            onClick={() => toggleWidth('medium')}
          />
          <SelectChip
            label="Wide"
            selected={filters.footWidth.includes('wide')}
            onClick={() => toggleWidth('wide')}
          />
        </div>
      </CollapsibleSection>

      {/* Instep Height Section */}
      <CollapsibleSection
        title="Instep Height"
        icon={<HeightIcon />}
        isOpen={openSections.height}
        onToggle={() => toggleSection('height')}
      >
        <div className="flex flex-wrap gap-2">
          <SelectChip
            label="Low"
            selected={filters.instepHeight.includes('low')}
            onClick={() => toggleInstep('low')}
          />
          <SelectChip
            label="Medium"
            selected={filters.instepHeight.includes('medium')}
            onClick={() => toggleInstep('medium')}
          />
          <SelectChip
            label="High"
            selected={filters.instepHeight.includes('high')}
            onClick={() => toggleInstep('high')}
          />
        </div>
      </CollapsibleSection>

      {/* Heel Volume Section */}
      <CollapsibleSection
        title="Heel Volume"
        icon={<HeelIcon />}
        isOpen={openSections.heel}
        onToggle={() => toggleSection('heel')}
      >
        <div className="flex flex-wrap gap-2">
          <SelectChip
            label="Small"
            selected={filters.heelVolume.includes('small')}
            onClick={() => toggleHeel('small')}
          />
          <SelectChip
            label="Medium"
            selected={filters.heelVolume.includes('medium')}
            onClick={() => toggleHeel('medium')}
          />
          <SelectChip
            label="Large"
            selected={filters.heelVolume.includes('large')}
            onClick={() => toggleHeel('large')}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
