import type { ScoredShoe } from '@/lib/types';

type ShoeCardProps = {
  shoe: ScoredShoe;
  rank: number;
};

export function ShoeCard({ shoe, rank }: ShoeCardProps) {
  const matchColor = 
    shoe.matchScore >= 80 ? 'bg-green-500' :
    shoe.matchScore >= 60 ? 'bg-lime-500' :
    shoe.matchScore >= 40 ? 'bg-yellow-500' :
    'bg-orange-500';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Match Score Banner */}
      <div className={`${matchColor} text-white px-4 py-2 flex justify-between items-center`}>
        <span className="font-semibold">#{rank}</span>
        <span className="text-lg font-bold">{shoe.matchScore}% match</span>
      </div>
      
      {/* Image Placeholder */}
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {shoe.image_url ? (
          <img src={shoe.image_url} alt={`${shoe.brand} ${shoe.model}`} className="h-full object-contain" />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">👟</div>
            <div className="text-sm">No image</div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="text-sm text-gray-500">{shoe.brand}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{shoe.model}</h3>
        
        {/* Quick specs */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="px-2 py-0.5 bg-grip-50 text-grip-600 text-xs rounded">
            {shoe.downturn}
          </span>
          <span className="px-2 py-0.5 bg-grip-50 text-grip-600 text-xs rounded">
            {shoe.closure}
          </span>
          <span className="px-2 py-0.5 bg-grip-50 text-grip-600 text-xs rounded">
            {shoe.rubber_hardness} rubber
          </span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{shoe.description}</p>
        
        {/* Match Details (collapsible) */}
        {shoe.matchDetails.length > 0 && (
          <details className="mb-3">
            <summary className="text-sm text-grip-500 cursor-pointer hover:text-grip-600">
              Why this score?
            </summary>
            <div className="mt-2 space-y-1">
              {shoe.matchDetails.map((detail, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-600">{detail.category}</span>
                  <span className={detail.matched ? 'text-green-600' : detail.partial ? 'text-yellow-600' : 'text-gray-400'}>
                    {detail.points}/{detail.maxPoints} pts
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}
        
        {/* Customer voices */}
        {shoe.customer_voices && (
          <div className="border-t pt-3 mt-3">
            <div className="text-xs text-gray-500 mb-1">What climbers say:</div>
            <div className="text-sm text-gray-600 italic">"{shoe.customer_voices.fit}"</div>
          </div>
        )}
        
        {/* Price */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <span className="text-lg font-bold text-grip-500">€{shoe.price_eur}</span>
          <button className="px-4 py-2 bg-grip-500 text-white rounded-lg hover:bg-grip-600 transition-colors text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
