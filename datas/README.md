# `seoul.db` 데이터베이스

서울 관광 콘텐츠를 담은 읽기 전용 SQLite 데이터베이스입니다.

| 항목 | 값 |
| --- | --- |
| 파일 | `datas/seoul.db` |
| DBMS | SQLite |
| 테이블 | `locations` 1개 |
| 전체 레코드 | 8,140건 |
| 외래 키 | 없음 |
| 확인일 | 2026-07-14 |

## 테이블 구조

### `locations`

관광지, 문화시설, 축제, 여행코스, 레저, 숙박, 쇼핑, 음식점 콘텐츠를 저장합니다.

| 컬럼 | 타입 | NULL | 제약 | 설명 |
| --- | --- | --- | --- | --- |
| `id` | `INTEGER` | 불가 | PK, 자동 증가 | 내부 식별자 |
| `contentid` | `TEXT` | 불가 | UNIQUE | 관광 콘텐츠 ID |
| `contenttypeid` | `TEXT` | 불가 |  | 관광 콘텐츠 유형 ID |
| `content_type_name` | `TEXT` | 불가 |  | 관광 콘텐츠 유형명 |
| `title` | `TEXT` | 불가 |  | 관광지 또는 콘텐츠명 |
| `addr1` | `TEXT` | 가능 |  | 기본 주소 |
| `addr2` | `TEXT` | 가능 |  | 상세 주소 |
| `tel` | `TEXT` | 가능 |  | 전화번호 |
| `mapx` | `REAL` | 가능 |  | 경도(longitude) |
| `mapy` | `REAL` | 가능 |  | 위도(latitude) |
| `firstimage` | `TEXT` | 가능 |  | 대표 이미지 URL |
| `firstimage2` | `TEXT` | 가능 |  | 보조 대표 이미지 URL |
| `eventstartdate` | `TEXT` | 가능 |  | 행사 시작일 |
| `eventenddate` | `TEXT` | 가능 |  | 행사 종료일 |

### 키와 인덱스

| 이름 | 컬럼 | 특성 |
| --- | --- | --- |
| Primary Key | `id` | 자동 증가 정수 키 |
| `sqlite_autoindex_locations_1` | `contentid` | UNIQUE 제약으로 자동 생성 |

## 콘텐츠 유형별 데이터

| `contenttypeid` | 유형 | 건수 |
| --- | --- | ---: |
| `12` | 관광지 | 783 |
| `14` | 문화시설 | 566 |
| `15` | 축제/공연/행사 | 201 |
| `25` | 여행코스 | 51 |
| `28` | 레포츠 | 126 |
| `32` | 숙박 | 423 |
| `38` | 쇼핑 | 4,368 |
| `39` | 음식점 | 1,622 |

## 데이터 품질 현황

| 항목 | 보유 건수 | 비고 |
| --- | ---: | --- |
| 기본 주소(`addr1`) | 8,088 | 전체의 약 99.4% |
| 상세 주소(`addr2`) | 3,612 | 선택 정보 |
| 전화번호(`tel`) | 201 | 일부 콘텐츠만 제공 |
| 이미지(`firstimage` 또는 `firstimage2`) | 7,288 | 전체의 약 89.5% |
| 유효 좌표(`mapx > 0`, `mapy > 0`) | 8,139 | 지도 마커에 사용 가능 |
| 행사 시작/종료일 | 196 | 주로 축제·행사 콘텐츠 |

> 좌표 컬럼은 `mapx`가 경도, `mapy`가 위도입니다. 1건은 좌표값이 `0`이므로 지도 표시 시 제외하는 것이 안전합니다.

## 애플리케이션 사용

백엔드의 `backend/app/tour_data.py`가 이 파일을 SQLite 읽기 전용 모드로 조회합니다.

- 관광 목록: `GET /api/locations`
- 관광 상세: `GET /api/locations/{content_id}`
- 지도 마커: `GET /api/map/locations`

관광지와 게시글을 연결할 때는 `contentid`를 저장·비교합니다. 이름이나 주소는 변경 가능성이 있으므로 식별자로 사용하지 않습니다.

관광 애플리케이션은 `contenttypeid`를 화면 카테고리로 변환해 사용합니다. 음식점은 `39`를 `food`로 매핑하며, 목록과 지도에서는 `category=food`로 조회합니다.

## 조회 예시

```sql
-- 특정 관광지 ID 조회
SELECT title, addr1, addr2, mapx, mapy
FROM locations
WHERE contentid = '콘텐츠_ID';

-- 지도용 유효 좌표 데이터
SELECT contentid, title, addr1, addr2, mapx, mapy, firstimage2, firstimage
FROM locations
WHERE mapx > 0 AND mapy > 0;

-- 유형별 건수
SELECT contenttypeid, content_type_name, COUNT(*) AS count
FROM locations
GROUP BY contenttypeid, content_type_name
ORDER BY contenttypeid;
```
