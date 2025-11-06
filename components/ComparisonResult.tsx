import React, { useState, useMemo, useEffect } from 'react';
import { ComparisonResult, ProductFeatures, ProductPriceInfo, PricePoint } from '../types';

const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l3 3m0 0l3-3m-3 3v-6m0 6h18M3 21h18M3 6.75h18M3 11.25h18" />
    </svg>
);

const BalanceIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52v16.5m-13.5-16.5v16.5m13.5 0c.621 0 1.125-.504 1.125-1.125V4.125c0-.621-.504-1.125-1.125-1.125h-3.75c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h3.75m-13.5-16.5c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125 1.125V4.125c0-.621-.504-1.125-1.125-1.125h-3.75Z" />
    </svg>
);

const SpeakerPhoneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 1.87-1.61 7.99a2.25 2.25 0 0 0-1.13 1.95v7.12c0 .83.47 1.58 1.2 1.97l11.95 6.12a2.25 2.25 0 0 0 2.3 0l11.95-6.12a2.25 2.25 0 0 0 1.2-1.97V9.94a2.25 2.25 0 0 0-1.13-1.95L13.04 1.87a2.25 2.25 0 0 0-2.7 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v7.5" />
    </svg>
);

const ArrowUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
    </svg>
);

const ArrowDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
    </svg>
);

const TagIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const PriceDetailCard: React.FC<{ productPriceInfo: ProductPriceInfo }> = ({ productPriceInfo }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [productPriceInfo.imageUrl]);

    const formatCurrency = (amount: number) => {
        if (typeof amount !== 'number') return 'N/A';
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(amount);
    };

    const PriceLink: React.FC<{ pricePoint?: PricePoint }> = ({ pricePoint }) => {
        if (!pricePoint || typeof pricePoint.value !== 'number' || !pricePoint.url) {
            return <span className="font-semibold text-gray-500">N/A</span>;
        }
        return (
            <a
                href={pricePoint.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-blue-400 underline transition-colors duration-200"
            >
                {formatCurrency(pricePoint.value)}
            </a>
        );
    };
    
    const hasImage = productPriceInfo.imageUrl && !imageError;

    return (
        <div className="bg-gray-700/50 rounded-lg overflow-hidden flex flex-col">
            {hasImage && (
                <div className="h-60 flex items-center justify-center bg-white p-2">
                    <img
                        src={productPriceInfo.imageUrl}
                        alt={productPriceInfo.name}
                        className="w-full h-full object-contain"
                        onError={() => setImageError(true)}
                    />
                </div>
            )}
            <div className="p-4 flex-grow flex flex-col">
                <h4 className="text-lg font-bold text-center text-blue-300 mb-4 truncate">{productPriceInfo.name}</h4>
                <ul className="space-y-3 text-gray-300 flex-grow flex flex-col justify-center">
                    <li className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ArrowUpIcon className="w-5 h-5 text-red-400 mr-2" />
                            <span>最高價格</span>
                        </div>
                        <PriceLink pricePoint={productPriceInfo.priceDetails.highest} />
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ArrowDownIcon className="w-5 h-5 text-green-400 mr-2" />
                            <span>最低價格</span>
                        </div>
                        <PriceLink pricePoint={productPriceInfo.priceDetails.lowest} />
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center">
                            <TagIcon className="w-5 h-5 text-yellow-400 mr-2" />
                            <span>常見價格</span>
                        </div>
                        <PriceLink pricePoint={productPriceInfo.priceDetails.mostCommon} />
                    </li>
                </ul>
            </div>
        </div>
    );
};

const FeatureList: React.FC<{ title: string; features: string[]; icon: React.ReactNode; titleColor: string; }> = ({ title, features, icon, titleColor }) => {
    return (
        <div>
            <h4 className={`font-semibold ${titleColor} mb-3`}>{title}</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                       {icon}
                       <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const FeatureCard: React.FC<{ product: ProductFeatures }> = ({ product }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg w-full">
        <h3 className="text-xl font-bold text-center text-blue-300 mb-4">{product.name}</h3>
        <div className="space-y-4">
            <FeatureList
                title="優勢"
                features={product.strengths}
                icon={<CheckIcon />}
                titleColor="text-green-400"
            />
             <div className="border-t border-gray-700 !my-6"></div>
            <FeatureList
                title="劣勢"
                features={product.weaknesses}
                icon={<XIcon />}
                titleColor="text-red-400"
            />
        </div>
    </div>
);


const ComparisonResult: React.FC<{ result: ComparisonResult }> = ({ result }) => {
    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Price Analysis Card */}
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                    <ChartBarIcon className="w-8 h-8 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">價格分析</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">{result.priceAnalysis.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PriceDetailCard productPriceInfo={result.priceAnalysis.productA} />
                    <PriceDetailCard productPriceInfo={result.priceAnalysis.productB} />
                </div>
            </div>

            {/* Feature Comparison Section */}
            <div>
                 <div className="flex items-center mb-4 justify-center">
                    <BalanceIcon className="w-8 h-8 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white text-center">功能比較</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard product={result.featureComparison.productA} />
                    <FeatureCard product={result.featureComparison.productB} />
                </div>
            </div>

            {/* Sales Pitch Card */}
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                    <SpeakerPhoneIcon className="w-8 h-8 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">針對 {result.featureComparison.productA.name} 的銷售話術</h2>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed">
                    {result.salesPitch.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ComparisonResult;