export interface PricePoint {
  value: number;
  url: string;
}

export interface PriceDetails {
  highest: PricePoint;
  lowest: PricePoint;
  mostCommon: PricePoint;
}

export interface ProductPriceInfo {
  name: string;
  imageUrl: string;
  priceDetails: PriceDetails;
}

export interface ProductFeatures {
  name: string;
  strengths: string[];
  weaknesses: string[];
}

export interface ComparisonResult {
  priceAnalysis: {
    summary: string;
    productA: ProductPriceInfo;
    productB: ProductPriceInfo;
  };
  featureComparison: {
    productA: ProductFeatures;
    productB: ProductFeatures;
  };
  salesPitch: string[];
}