# SLA451 Project (React + Vite)

프런트엔드 데모(갈등 해결 시나리오)용 Vite + React 프로젝트입니다.

## 빠른 실행
- `npm install`
- `npm run dev` (프런트만 실행, `/api/chat`가 없으면 LLM은 모의 응답으로 동작)

## LLM 호출 방식을 서버리스로 분리 (Vercel)
- 서버리스 엔드포인트: `api/chat.ts` (OpenAI 키는 서버 환경 변수에서만 읽습니다).
- Vercel 프로젝트 설정
  - Settings → Environment Variables에서 `OPENAI_API_KEY` 추가 (프리픽스 없이). 키는 절대 `VITE_`로 노출하지 않습니다.
  - 일반 배포 시 프런트는 `/api/chat`으로만 호출하므로 키가 브라우저에 포함되지 않습니다.
- 로컬에서 실제 OpenAI 호출이 필요하면:
  - `npm install -g vercel` 후 `vercel login`
  - `.env.local`에 `OPENAI_API_KEY=...` 저장
  - `vercel dev`로 실행 (프런트 + 서버리스가 함께 동작)
  - 단순 `npm run dev`는 `/api/chat`이 없어서 안전하게 모의 응답을 사용합니다.

## 요청/응답 포맷
- 요청 바디: `{ systemPrompt: string, userInput: string, model?: string }` (`apiKey`는 선택적 로컬 오버라이드용)
- 응답: `{ content: string }`
- 서버에 키가 없거나 로컬 dev에서 API 라우트가 없으면 프런트가 고정된 mock 응답으로 fallback 합니다.
