
import { GoogleGenAI } from "@google/genai";
import { KPI, Employee } from '../types';

export const generateKpiReport = async (
  kpis: KPI[],
  employees: Employee[],
  month: number,
  year: number,
  context: 'employee' | 'team' | 'company',
  contextName: string,
): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve("API Key is not configured. Please set up your API key to use this feature.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'N/A';
  
  const kpiDataSummary = kpis.map(kpi => ({
    tenKPI: kpi.name,
    mucTieu: kpi.objective,
    nguoiThucHien: getEmployeeName(kpi.assigneeId),
    tiLeHoanThanh: `${kpi.completion}%`,
    ketQua: kpi.result,
  }));

  const prompt = `
    Bạn là một chuyên gia quản lý nhân sự. Dựa vào dữ liệu KPI tháng ${month}/${year} của ${context} '${contextName}' dưới đây, hãy tạo một báo cáo tổng thể.
    
    Dữ liệu KPI:
    ${JSON.stringify(kpiDataSummary, null, 2)}

    Báo cáo cần có các phần sau, viết dưới dạng văn bản markdown:
    1.  **Phân tích tổng quan:** Nhận xét chung về hiệu suất trong tháng.
    2.  **Điểm mạnh:** Chỉ ra những thành tích nổi bật, những KPI hoàn thành xuất sắc.
    3.  **Điểm yếu:** Phân tích những KPI chưa đạt hoặc cần cải thiện, tìm ra nguyên nhân có thể.
    4.  **Đề xuất hành động:** Đưa ra các giải pháp cụ thể, khả thi để cải thiện hiệu suất trong tháng tiếp theo.

    Vui lòng trình bày báo cáo một cách chuyên nghiệp, rõ ràng và súc tích.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating report with Gemini:", error);
    return "Đã xảy ra lỗi khi tạo báo cáo. Vui lòng thử lại.";
  }
};
