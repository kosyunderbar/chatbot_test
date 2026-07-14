# Frontend Guide

## 개발 환경

- Node.js 22 LTS 이상
- VS Code

권장 Extension

- Vue - Official (Volar)
- GitHub Copilot
- GitHub Copilot Chat
- Tailwind CSS IntelliSense

---

## 프로젝트 실행

### 1. 프로젝트 Clone

```bash
git clone <repository-url>
```

### 2. frontend 폴더 이동

```bash
cd 5team_ssatal/frontend
```

### 3. 패키지 설치

```bash
npm install
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```
http://localhost:5173
```

---

## 빌드 확인

작업 완료 후 반드시 실행합니다.

```bash
npm run build
```

빌드 오류가 없어야 Commit 합니다.

---

## 환경 변수

frontend 폴더에 `.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=http://localhost:8000
```

현재는 Mock 데이터를 사용하지만,
FastAPI 연동 시 위 주소를 사용합니다.

---

## 새 패키지 설치

프로젝트에 새로운 패키지를 추가한 경우에는 아래 명령으로 설치합니다.

```bash
npm install
```

---

## Git 작업 순서

```bash
git pull origin develop

npm install

npm run dev

(개발)

npm run build

git add .

git commit -m "feat: 기능명"

git push origin feature/frontend
```