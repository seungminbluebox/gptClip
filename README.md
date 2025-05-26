# ✨ GPT Clipbook

GPT Clipbook은 카테고리 기반으로 정보를 구조화하고 저장할 수 있는 감성 클립북 웹앱입니다. 
Google 로그인을 기반으로 사용자별 클립을 생성, 수정, 삭제할 수 있으며, Firestore와 동기화되어
어디서든 안전하게 접근할 수 있습니다.

---

## 🛠 사용 기술 스택

| 영역 | 기술 |
|------|------|
| UI 구현 | HTML, CSS (반응형, 다크모드) |
| 인터랙션 | JavaScript (Vanilla JS) |
| 사용자 인증 | Firebase Auth (Google 로그인) |
| 데이터베이스 | Firestore (사용자 uid 기반 문서 저장) |
| 배포 | Vercel (GitHub 연동 자동 배포) |

---

## 📦 주요 기능

### ✅ 인증 및 사용자 관리
- Google OAuth 기반 로그인 / 로그아웃
- 로그인한 사용자만 접근 가능 (비로그인 시 로그인 화면 노출)
- 사용자 이메일, 이름, 프로필 사진 Firestore에 저장

### ✅ 데이터 관리 (Firestore 연동)
- 사용자 uid 별로 데이터 분리 저장
- `clipData`, `categoryOrder` 필드로 구조화
- 클립/카테고리 CRUD 반영 시 실시간 Firestore 업데이트

### ✅ 클립북 기능
- 카테고리 추가/수정/삭제, 드래그앤드롭 정렬
- 클립 추가/수정/삭제, 즐겨찾기 토글
- 마크다운 렌더링 지원 (marked.js)
- 출처 필드 (`from`) 포함
- `.active` 상태 강조, 시각적 피드백 제공

### ✅ UX 및 디자인
- 다크모드 토글 (🌙/☀️ 자동 상태 기억)
- 반응형 UI (모바일 최적화)
- 클립/카테고리 배경 색상 계층 구조
- 로그인 화면에 배경 이미지 + 블러 효과 적용

### ✅ 기타
- 파비콘 적용 (`favicon.png`)
- 로그아웃 버튼 상태에 따라 이미지 변경

---

## 🚀 배포 주소
👉 [https://gptclip.vercel.app](https://gptclip.vercel.app)

---

## 📁 프로젝트 구조 요약

```
📦 GPTClip/
├─ index.html          # 메인 페이지
├─ style.css           # 전체 스타일 시트
├─ main.js             # 초기 렌더 및 인증 제어
├─ category.js         # 카테고리 렌더 및 이벤트
├─ clip.js             # 클립 렌더 및 이벤트
├─ data.js             # 전역 상태 및 Firestore 연동 함수
├─ firebase-config.js  # Firebase 초기화 및 모듈 export
├─ image/              # 버튼, 파비콘, 배경 이미지 등
```

---

## 🧠 향후 추가 예정 기능

- 🔍 클립 검색 기능
- 🏷️ 태그 필터링 기능
- 🖥 Cloudflare Access를 통한 특정 계정만 허용
- 🔄 Firestore 실시간 동기화 (onSnapshot)

---

## 🙌 제작자

- **승민**
- GitHub: [@seungminbluebox](https://github.com/seungminbluebox)
- 이 프로젝트는 개인의 실습용 웹앱이며, Firebase와 Vercel의 무료 티어로 운영됩니다.
