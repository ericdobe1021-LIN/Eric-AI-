
import React, { useState, useCallback, useEffect } from 'react';
import { ComparisonResult } from './types';
import { compareProducts } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import ComparisonResultDisplay from './components/ComparisonResult';

const App: React.FC = () => {
    const [productA, setProductA] = useState('');
    const [productB, setProductB] = useState('');
    const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 在組件掛載時從 localStorage 讀取數據
    useEffect(() => {
        const savedProductA = localStorage.getItem('productA');
        const savedProductB = localStorage.getItem('productB');
        if (savedProductA) {
            setProductA(savedProductA);
        }
        if (savedProductB) {
            setProductB(savedProductB);
        }
    }, []); // 空依賴項陣列確保此 effect 只運行一次

    // 當產品名稱變化時，將其存儲到 localStorage
    useEffect(() => {
        localStorage.setItem('productA', productA);
        localStorage.setItem('productB', productB);
    }, [productA, productB]);

    const handleCompare = useCallback(async () => {
        if (!productA || !productB) {
            setError("請輸入兩種產品名稱進行比較。");
            return;
        }
        setIsLoading(true);
        setError(null);
        setComparisonResult(null);

        try {
            const result = await compareProducts(productA, productB);
            setComparisonResult(result);
        } catch (err: any) {
            setError(err.message || "發生未知錯誤。");
        } finally {
            setIsLoading(false);
        }
    }, [productA, productB]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleCompare();
        }
    }
    
    const handleClear = () => {
        setProductA('');
        setProductB('');
        setComparisonResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center my-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                        AI 產品競爭力分析
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        輸入兩款產品，即可獲得 AI 提供的價格、功能和銷售策略分析。
                    </p>
                </header>

                <main className="w-full">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                            <div>
                                <label htmlFor="productA" className="block text-sm font-medium text-gray-300 mb-2">產品 A</label>
                                <input
                                    id="productA"
                                    type="text"
                                    value={productA}
                                    onChange={(e) => setProductA(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="例如：iPhone 15 Pro"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="productB" className="block text-sm font-medium text-gray-300 mb-2">產品 B (競品)</label>
                                <input
                                    id="productB"
                                    type="text"
                                    value={productB}
                                    onChange={(e) => setProductB(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="例如：Samsung Galaxy S24 Ultra"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end items-center h-6 mb-4">
                            {(productA || productB) && (
                                <button
                                    onClick={handleClear}
                                    disabled={isLoading}
                                    className="text-sm text-gray-400 hover:text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    清除
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleCompare}
                            disabled={isLoading || !productA || !productB}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    分析中...
                                </>
                            ) : (
                                "比較產品"
                            )}
                        </button>
                    </div>

                    <div className="mt-12">
                        {isLoading && <LoadingSpinner />}
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                                <strong className="font-bold">錯誤： </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {comparisonResult && <ComparisonResultDisplay result={comparisonResult} />}
                         {!isLoading && !error && !comparisonResult && (
                            <div className="text-center text-gray-500 mt-16">
                                <p>您的競爭力分析將顯示在此處。</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
