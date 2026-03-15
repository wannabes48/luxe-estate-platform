// src/utils/greenScoreCalculator.ts

export const ECO_FEATURES = {
  solar_panel: { label: 'Solar Power System', points: 35 },
  water_harvesting: { label: 'Rainwater Harvesting', points: 25 },
  borehole: { label: 'Private Borehole', points: 20 },
  biogas: { label: 'Biogas Digester', points: 25 },
  smart_meter: { label: 'Smart Energy Meters', points: 15 },
  natural_lighting: { label: 'Optimized Natural Lighting', points: 10 },
  eco_materials: { label: 'Sustainable Building Materials', points: 15 }
};

export function calculateGreenScore(selectedFeatures: string[]): number {
  if (!selectedFeatures || selectedFeatures.length === 0) return 0;
  
  const score = selectedFeatures.reduce((total, featureKey) => {
    const feature = ECO_FEATURES[featureKey as keyof typeof ECO_FEATURES];
    return total + (feature ? feature.points : 0);
  }, 0);

  // Cap the score at 100
  return Math.min(score, 100);
}