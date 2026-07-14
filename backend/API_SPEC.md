# LocalHub Backend API Specification

이 문서는 현재 `backend/app/main.py` 기준으로 구현된 FastAPI API를 정리한 문서다.

## 1. Base Information

- Base URL: `http://127.0.0.1:8000`
- Content-Type: `application/json`
- 인증 방식: 없음
- 저장소: SQLite
- 주요 리소스: 게시글(`posts`)

## 2. Common Response Rules

- 성공 시 JSON 응답을 반환한다.
- 존재하지 않는 게시글은 `404 Not Found`를 반환한다.
- 수정/삭제 시 비밀번호가 일치하지 않으면 `403 Forbidden`을 반환한다.
- 입력값 검증 실패 시 FastAPI 기본 검증 에러 형식(`422 Unprocessable Entity`)을 반환한다.

## 3. Health Check

### GET /health

서버 동작 확인용 엔드포인트다.

#### Response

```json
{
  "status": "ok"
}
```

## 4. Post APIs

### 4-1. 게시글 목록 조회

#### GET /api/posts

게시글 목록을 조회한다. 페이지네이션, 지역 필터, 카테고리 필터, 검색어 필터를 지원한다.

#### Query Parameters

- `page` : number, default `1`
- `size` : number, default `10`, min `1`, max `100`
- `region` : string, optional
- `category` : string, optional
- `keyword` : string, optional

#### Response

```json
{
  "items": [
    {
      "id": 1,
      "title": "맛집 추천 부탁드려요",
      "content": "서울에서 가볼 만한 식당이 있나요?",
      "region": "seoul",
      "category": "food",
      "created_at": "2026-07-14T12:00:00",
      "updated_at": "2026-07-14T12:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10
}
```

---

### 4-2. 게시글 상세 조회

#### GET /api/posts/{post_id}

특정 게시글 1개를 조회한다.

#### Path Parameters

- `post_id` : integer

#### Response

```json
{
  "id": 1,
  "title": "맛집 추천 부탁드려요",
  "content": "서울에서 가볼 만한 식당이 있나요?",
  "region": "seoul",
  "category": "food",
  "created_at": "2026-07-14T12:00:00",
  "updated_at": "2026-07-14T12:00:00"
}
```

#### Error Response

- `404 Not Found`

```json
{
  "detail": "Post not found"
}
```

---

### 4-3. 게시글 작성

#### POST /api/posts

게시글을 생성한다.

#### Request Body

```json
{
  "title": "맛집 추천 부탁드려요",
  "content": "서울에서 가볼 만한 식당이 있나요?",
  "password": "1234",
  "region": "seoul",
  "category": "food"
}
```

#### Field Rules

- `title` : string, required, 1~200자
- `content` : string, required
- `password` : string, required, 1~255자
- `region` : string, optional
- `category` : string, optional

#### Success Response

- Status: `201 Created`

```json
{
  "id": 1,
  "title": "맛집 추천 부탁드려요",
  "content": "서울에서 가볼 만한 식당이 있나요?",
  "region": "seoul",
  "category": "food",
  "created_at": "2026-07-14T12:00:00",
  "updated_at": "2026-07-14T12:00:00"
}
```

---

### 4-4. 게시글 수정

#### PUT /api/posts/{post_id}

게시글을 수정한다. 요청 본문에 포함된 비밀번호와 저장된 비밀번호가 일치해야 한다.

#### Path Parameters

- `post_id` : integer

#### Request Body

```json
{
  "title": "맛집 추천 다시 부탁드려요",
  "content": "서울에서 분위기 좋은 식당도 추천해주세요.",
  "password": "1234",
  "region": "seoul",
  "category": "food"
}
```

#### Success Response

```json
{
  "id": 1,
  "title": "맛집 추천 다시 부탁드려요",
  "content": "서울에서 분위기 좋은 식당도 추천해주세요.",
  "region": "seoul",
  "category": "food",
  "created_at": "2026-07-14T12:00:00",
  "updated_at": "2026-07-14T12:10:00"
}
```

#### Error Response

- `404 Not Found`

```json
{
  "detail": "Post not found"
}
```

- `403 Forbidden`

```json
{
  "detail": "Invalid password"
}
```

---

### 4-5. 게시글 삭제

#### DELETE /api/posts/{post_id}

게시글을 삭제한다. 요청 본문에 포함된 비밀번호와 저장된 비밀번호가 일치해야 한다.

#### Path Parameters

- `post_id` : integer

#### Request Body

```json
{
  "password": "1234"
}
```

#### Success Response

```json
{
  "message": "Post deleted"
}
```

#### Error Response

- `404 Not Found`

```json
{
  "detail": "Post not found"
}
```

- `403 Forbidden`

```json
{
  "detail": "Invalid password"
}
```

## 5. Data Model Summary

### Post

- `id` : integer, PK
- `title` : string
- `content` : text
- `password` : string
- `region` : string, optional
- `category` : string, optional
- `created_at` : datetime
- `updated_at` : datetime

## 6. Notes

- 현재 명세는 게시글 CRUD 중심이다.
- 챗봇 API와 지역 데이터 API는 아직 구현 전이다.
- 향후 기능 추가 시 이 문서를 확장하면 된다.
