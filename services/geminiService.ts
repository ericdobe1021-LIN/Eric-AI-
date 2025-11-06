import { GoogleGenAI } from "@google/genai";
import { ComparisonResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generatePrompt = (productA: string, productB: string): string => {
  return `
請以繁體中文分析並比較以下兩種產品：「${productA}」和「${productB}」。

分析時請主要參考台灣市場的購物網站與資訊來源。

請根據網路上最新的資訊，提供詳細的比較。請專注於以下三個領域：
1.  **價格分析**：為每項產品提供一個公開可存取的產品圖片 URL。描述兩種產品在過去兩週的典型價格範圍和任何近期的價格趨勢。資料來源應以台灣現行公開的網購平台為主（例如 PChome, momo, Shopee 商城等）。分析時請務必排除任何「福利品」、「二手品」或「整新品」的價格。對於每種產品，請分別提供這兩週區間內的 **最高價格**、**最低價格** 以及在各大網站上 **最常見的價格**。對於這三個價格中的每一個，都必須提供一個可實際開啟且內容相關的網頁 URL。提供的 URL **必須**是單一產品的詳細頁面 (Product Detail Page)，**絕不能**是搜尋結果列表頁面或分類頁面。連結頁面上的價格必須與您回報的 'value' 完全相符，且頁面內容必須顯示商品為「上架中」或「可購買」狀態，而非「已售完」或「已下架」。
2.  **功能比較**：詳細說明每種產品的主要優勢和劣勢。
3.  **銷售話術**：為「${productA}」創建一套條列式的銷售話術，突顯其相對於「${productB}」的優勢。

你的整個回應必須是一個單一、有效的 JSON 物件。請不要在 JSON 物件前後添加任何文字、解釋或 markdown 格式，例如 \`\`\`json。

此 JSON 物件必須嚴格遵守以下結構（價格為純數字，不含貨幣符號或逗號，且每個價格都附有其來源網址）：
{
  "priceAnalysis": {
    "summary": "對兩種產品的價格比較和趨勢的摘要。",
    "productA": {
      "name": "${productA}",
      "imageUrl": "https://example.com/product_a_image.jpg",
      "priceDetails": {
        "highest": { "value": 50000, "url": "https://example.com/highest_price_product_a" },
        "lowest": { "value": 45000, "url": "https://example.com/lowest_price_product_a" },
        "mostCommon": { "value": 48000, "url": "https://example.com/most_common_price_product_a" }
      }
    },
    "productB": {
      "name": "${productB}",
      "imageUrl": "https://example.com/product_b_image.jpg",
      "priceDetails": {
        "highest": { "value": 52000, "url": "https://example.com/highest_price_product_b" },
        "lowest": { "value": 47000, "url": "https://example.com/lowest_price_product_b" },
        "mostCommon": { "value": 49500, "url": "https://example.com/most_common_price_product_b" }
      }
    }
  },
  "featureComparison": {
    "productA": {
      "name": "${productA}",
      "strengths": ["優勢 1", "優勢 2"],
      "weaknesses": ["劣勢 1", "劣勢 2"]
    },
    "productB": {
      "name": "${productB}",
      "strengths": ["優勢 1", "優勢 2"],
      "weaknesses": ["劣勢 1", "劣勢 2"]
    }
  },
  "salesPitch": [
    "針對產品 A 的第一個銷售重點...",
    "第二個銷售重點，強調其獨特功能...",
    "第三個重點，說明其性價比優勢..."
  ]
}
`;
};


export const compareProducts = async (productA: string, productB: string): Promise<ComparisonResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: generatePrompt(productA, productB),
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text;
    
    // 清理回應文本以確保其為有效的 JSON 字符串
    const jsonString = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    const result: ComparisonResult = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("無法解析 AI 的回應。回應不是有效的 JSON 格式。");
    }
    throw new Error("比較產品時發生錯誤，請再試一次。");
  }
};