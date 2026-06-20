import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const subjectType = formData.get("subjectType") as string;
    const dDay = formData.get("dDay") as string;
    const targetGrade = formData.get("targetGrade") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY가 설정되지 않았습니다." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `너는 친근하고 똑똑한 'StudyHelper 로봇' 튜터야.
학생이 여러 개의 시험 자료를 업로드했어. 아래 정보를 바탕으로 분석해 줘.

- 과목 유형: ${subjectType}
- 시험까지 남은 기간: D-${dDay}
- 목표 성적: ${targetGrade}

요청 사항:
1. 업로드된 파일들의 내용을 분석해서, 각 단원별로 시험에서 꼭 나올 만한 핵심 포인트나 중요한 것들을 요약해 줘.
2. 남은 기간(D-${dDay})과 목표 성적(${targetGrade})을 고려해서 최고의 효율을 낼 수 있는 구체적인 공부 전략과 조언을 카카오톡에서 친구에게 말해주듯이 친근하고 따뜻한 어투(해요체/해체 적절히 섞어서)로 작성해 줘. 너무 딱딱하지 않게 이모지도 적절히 써줘!`;

    const parts: any[] = [{ text: prompt }];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString('base64');
      parts.push({
        inlineData: {
          data: base64String,
          mimeType: file.type || "text/plain"
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts
        }
      ]
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
