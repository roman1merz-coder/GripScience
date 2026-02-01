type FilterButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function FilterButton({ label, selected, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        selected
          ? 'bg-grip-500 text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-300 hover:border-grip-300 hover:bg-grip-50'
      }`}
    >
      {label}
    </button>
  );
}

type FilterGroupProps = {
  title: string;
  options: { value: string; label: string }[];
  selected: string | null;
  onChange: (value: string | null) => void;
};

export function FilterGroup({ title, options, selected, onChange }: FilterGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            onClick={() => onChange(selected === option.value ? null : option.value)}
          />
        ))}
      </div>
    </div>
  );
}

type MultiSelectFilterProps = {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
};

export function MultiSelectFilter({ title, options, selected, onChange }: MultiSelectFilterProps) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleOption(option.value)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              selected.includes(option.value)
                ? 'bg-grip-100 text-grip-700 border border-grip-300'
                : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type PriceRangeFilterProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

export function PriceRangeFilter({ min, max, value, onChange }: PriceRangeFilterProps) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">
        Price Range: €{value[0]} - €{value[1]}
      </h4>
      <div className="flex gap-4 items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
          className="flex-1"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="flex-1"
        />
      </div>
    </div>
  );
}

type VeganFilterProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
};

export function VeganFilter({ value, onChange }: VeganFilterProps) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">Vegan</h4>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(value === true ? null : true)}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            value === true
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onChange(value === false ? null : false)}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            value === false
              ? 'bg-gray-200 text-gray-700 border border-gray-400'
              : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}
