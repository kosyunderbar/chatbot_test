# LocalHub

서울 관광 정보를 기반으로 관광 추천, 커뮤니티, AI 챗봇을 제공하는 웹 서비스

SSAFY Team Project

---

# Tech Stack

## Frontend

- Vue3
- TypeScript
- Vite
- Pinia
- Vue Router
- Vue-i18n
- TailwindCSS
- Axios

## Backend

- FastAPI

## Database

- SQLite

## AI

- OpenAI API
- DeepL

## Deployment

- Netlify
- Render

---

# Repository

```
5team_ssatal

backend/
frontend/
data_seoul/
README.md
```

Vue 프로젝트는 반드시

```
frontend/
```

안에서 생성한다.

새로운

```
localhub-frontend
```

폴더를 만들지 않는다.

---

# Frontend Folder Structure

```
src/

api/

assets/

components/
    common/
    layout/
    home/
    tour/
    board/
    chatbot/

composables/

locales/

mock/
    tour/

router/

stores/

styles/

types/

utils/

views/

App.vue
main.ts
```

---

# Frontend Architecture

```
View

↓

Component

↓

API

↓

Mock

↓

Backend
```

Component에서는 axios를 직접 호출하지 않는다.

---

# Component Rules

Component 하나는 하나의 역할만 수행한다.

예시

```
TourCard

↓

카드 UI만 담당
```

View는

```
조립만 한다.
```

예시

```
HomeView

↓

HeroBanner

↓

CategoryGrid

↓

PopularTour

↓

CommunityPreview

↓

ChatbotBanner
```

---

# API Rules

API 호출은

```
src/api
```

에서만 수행한다.

Component에서는

axios를 import 하지 않는다.

---

# Store Rules

Pinia는 기능별 Store만 생성한다.

```
languageStore

tourStore

boardStore

chatStore
```

Component 상태는 Store에 넣지 않는다.

---

# Mock Rules

초기 개발은 Mock First

```
mock

↓

api

↓

backend
```

Tour JSON은

```
src/mock/tour
```

에 저장한다.

원본 JSON은 수정하지 않는다.

---

# Common Components

```
BaseButton

BaseInput

BaseCard

BaseLoading

BaseSkeleton

BaseEmpty

BasePagination

BaseModal

BaseToast
```

공통 컴포넌트는

```
components/common
```

에서만 관리한다.

---

# Layout

```
AppLayout

AppHeader

AppNavigation

MobileNavigation

LanguageSelector

AppFooter
```

---

# Pages

```
Home

Tour

Community

Chatbot
```

View는

조립만 수행한다.

---

# Type Rules

화면에서 사용할 타입은

```
types
```

에 작성한다.

JSON 타입과 화면 타입을 분리한다.

예시

```
TourApiItem

↓

TourItem
```

---

# Development Order

## STEP 1

Project

## STEP 2

Convention

## STEP 3

Folder Structure

## STEP 4

Tailwind

## STEP 5

Pinia

## STEP 6

Router

## STEP 7

i18n

## STEP 8

App Initialization

## STEP 9

Layout

## STEP 10

Common Components

## STEP 11

Home

## STEP 12

Tour

## STEP 13

Community

## STEP 14

Chatbot

## STEP 15

Mock Data

## STEP 16

Type

## STEP 17

API Layer

## STEP 18

Store

## STEP 19

Backend Integration

## STEP 20

Deployment

---

# AI Development Rules

모든 개발은 AI(Vibe Coding) 기반으로 진행한다.

AI는 반드시 아래 규칙을 따른다.

- 현재 작업하는 파일만 수정한다.
- 지정하지 않은 파일은 수정하지 않는다.
- 공통 컴포넌트는 수정하지 않는다.
- Store는 수정하지 않는다.
- API는 api 폴더에서만 호출한다.
- Composition API(script setup)를 사용한다.
- TypeScript를 사용한다.
- TailwindCSS를 사용한다.
- style 태그를 사용하지 않는다.
- Component는 하나의 역할만 수행한다.
- View는 Component를 조립만 한다.
- API는 Mock → Backend 순으로 교체 가능해야 한다.
- JSON 원본은 절대 수정하지 않는다.

---

# Copilot Prompt Template

```
STEP

목표

생성 가능한 파일

수정 가능한 파일

수정 금지 파일

완료 조건

마지막에 npm run build 실행

빌드 성공 후 수정 파일 목록 출력
```

---

# Git Convention

```
feat

fix

refactor

style

docs

chore
```

예시

```
feat: implement tour page

feat: add common components

feat: connect mock data

fix: resolve router issue
```

---

# Branch

```
main

develop

feature/frontend

feature/backend

feature/chatbot
```

---

# Data Source

한국관광공사 TourAPI 4.0

공공누리 제3유형