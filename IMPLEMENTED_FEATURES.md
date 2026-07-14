# 구현 기능 정리

## 관광

- 서울 관광 데이터(`datas/seoul.db`) 기반 관광지 목록·검색·카테고리 필터
- 관광 목록 페이지네이션
- 관광 카드의 상세 보기
- 관광지 상세 화면: 대표 이미지, 이름, 분류, 주소, 전화번호 표시
- 관광지와 연결된 커뮤니티 게시글 상위 3개 표시
  - 좋아요 수 내림차순, 조회수 내림차순
  - 제목, 조회수, 댓글 수(현재 0), 좋아요 수 표시

## 지도

- 홈과 관광 사이의 지도 메뉴(`/map`)
- 카카오 지도 SDK 기반 서울 관광지 마커 표시
- 지도 이동/확대 시 현재 화면 영역의 관광지 데이터 조회
- 다수 마커 클러스터링
- 마커 클릭 시 사진, 관광지명, 주소 표시
- 선택 관광지의 인기 게시글 3개 표시

## 커뮤니티

- 게시글 작성, 수정, 삭제, 목록, 상세 조회
- 제목·본문·태그 검색 및 최신/조회수/좋아요 순 정렬 API
- 게시글 조회수 자동 증가
- 익명 방문자 ID 기반 좋아요·좋아요 취소
- 게시글 태그 입력 및 자동완성
- 이미지 업로드, 첨부, 삭제
- 게시글 상세의 링크 복사, Web Share, 카카오톡 공유 버튼
- 메인 인기글: 좋아요 순 상위 3개

## 게시글 관광지 연결

- 글 작성 시 관광지 검색 후 하나 선택 또는 `지역 없음` 선택 필수
- 관광지명·주소 검색 결과 목록 제공
- 목록 결과는 내부 스크롤 드롭다운으로 표시
- 서버가 선택한 관광지 ID를 관광 DB에서 검증한 뒤 이름·주소 저장
- 게시글 목록·상세에 연결된 관광지 정보 표시

## 메인 화면

- 빠른 탐색 카드
  - 관광: 관광지 필터가 적용된 관광 목록 이동
  - 문화: 문화 필터가 적용된 관광 목록 이동
  - 쇼핑: 쇼핑 필터가 적용된 관광 목록 이동
  - 맛집: 맛집 카테고리가 적용된 커뮤니티 이동
- 커뮤니티 인기글 표시
- 실시간 접속자 수 표시
  - 방문자별 heartbeat 방식
  - 최근 60초 내 접속자를 `N명 접속 중`으로 표시

## 주요 백엔드 API

| 기능 | API |
| --- | --- |
| 관광 목록 | `GET /api/locations` |
| 관광 상세 | `GET /api/locations/{content_id}` |
| 지도 관광지 | `GET /api/map/locations` |
| 관광지 인기글 | `GET /api/map/locations/{content_id}/popular-posts` |
| 게시글 | `GET/POST /api/posts`, `GET/PUT/DELETE /api/posts/{id}` |
| 좋아요 | `POST/DELETE /api/posts/{id}/likes` |
| 태그 | `GET /api/tags` |
| 이미지 | `POST /api/uploads/images`, `DELETE /api/uploads/images/{id}` |
| 접속자 heartbeat | `POST /api/presence/heartbeat` |
| 접속자 수 | `GET /api/presence` |

## 외부 설정

- 카카오 지도: 카카오 Developers에서 카카오맵 사용 설정을 켜고 JavaScript SDK 도메인 등록 필요
- 카카오톡 공유: JavaScript 키 및 SDK 도메인 등록 필요
- 프론트 환경 변수: `frontend/.env`
  - `VITE_KAKAO_JAVASCRIPT_KEY`
  - `VITE_KAKAO_MAP_JAVASCRIPT_KEY`
