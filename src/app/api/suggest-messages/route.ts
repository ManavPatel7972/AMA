// export async function POST(req: Request) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const prompt = `Create a list of three open-ended and engaging questions for an anonymous messaging app.
//     Generate exactly 3 fun, friendly, and interesting anonymous messages.
//      These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?
//     Rules:
//     - Each message should be on a new line
//     - Do NOT number them (no 1. 2. 3.)
//     - Keep each message under 100 characters
//     - Make them fun and engaging
//     - Do not include any extra text, just the 3 messages`;

//     const result = await model.generateContent(prompt);
//     console.log("Gemini Result:====>", result);

//     const response = await result.response;
//     console.log("Gemini Response:====>", response);

//     const text = response.text();
//     console.log("Gemini Text:====>", text);

//     // Parse into clean array
//     const suggestions = text
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line !== "");

//     return NextResponse.json({
//       success: true,
//       suggestions,
//     });
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to get suggestions" },
//       { status: 500 },
//     );
//   }
// }

// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "TrueFeedback",
//   },
// });
// export async function POST() {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "meta-llama/llama-3-8b-instruct",
//       messages: [
//         {
//           role: "user",
//           content:
//             "Generate 3 anonymous message suggestions for a feedback app. One per line. No numbering.",
//         },
//       ],
//       temperature: 0.7,
//     });

//     console.log("OpenAI Completion:====>", completion);

//     const text = completion.choices[0].message.content || "";

//     console.log("OpenAI Text:====>", text);

//     const suggestions = text
//       .split("\n")
//       .map((s) => s.trim())
//       .filter(Boolean);

//     console.log("Parsed Suggestions:====>", suggestions);

//     return NextResponse.json({
//       success: true,
//       suggestions,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { success: false, error: "AI failed" },
//       { status: 500 },
//     );
//   }
// }
