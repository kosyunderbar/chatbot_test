# `seoul.db` 스키마

서울 관광 데이터용 SQLite 데이터베이스입니다.

- 파일: `datas/seoul.db`
- 형식: SQLite
- 확인 기준: 2026-07-14
- 테이블 수: 1개
- `locations` 레코드 수: 8,140개

## 테이블 관계

현재 데이터베이스에는 `locations` 테이블만 있으며, 외래 키 관계는 없습니다.

## `locations`

관광지·문화시설·축제·여행코스·레저·숙박·쇼핑 정보를 저장합니다. `contenttypeid`는 애플리케이션에서 관광 유형을 구분하는 값으로 사용됩니다.

| 컬럼 | 타입 | NULL 허용 | 키 / 제약 | 설명 |
| --- | --- | --- | --- | --- |
| `id` | `INTEGER` | 아니오 | PK, 자동 증가 | 내부 식별자 |
| `contentid` | `TEXT` | 아니오 | UNIQUE | 관광 콘텐츠 식별자 |
| `contenttypeid` | `TEXT` | 아니오 |  | 관광 콘텐츠 유형 ID |
| `content_type_name` | `TEXT` | 아니오 |  | 관광 콘텐츠 유형명 |
| `title` | `TEXT` | 아니오 |  | 관광지 또는 콘텐츠명 |
| `addr1` | `TEXT` | 예 |  | 기본 주소 |
| `addr2` | `TEXT` | 예 |  | 상세 주소 |
| `tel` | `TEXT` | 예 |  | 전화번호 |
| `mapx` | `REAL` | 예 |  | 경도 좌표 |
| `mapy` | `REAL` | 예 |  | 위도 좌표 |
| `firstimage` | `TEXT` | 예 |  | 대표 이미지 URL |
| `firstimage2` | `TEXT` | 예 |  | 보조 대표 이미지 URL |
| `eventstartdate` | `TEXT` | 예 |  | 행사 시작일 |
| `eventenddate` | `TEXT` | 예 |  | 행사 종료일 |

### 인덱스

| 인덱스 | 대상 컬럼 | 특성 |
| --- | --- | --- |
| `sqlite_autoindex_locations_1` | `contentid` | `UNIQUE` 제약으로 자동 생성 |

### 애플리케이션에서 사용하는 유형 ID

| 분류 | `contenttypeid` |
| --- | --- |
| 관광지 | `12` |
| 문화시설 | `14` |
| 축제/공연/행사 | `15` |
| 여행코스 | `25` |
| 레저/스포츠 | `28` |
| 숙박 | `32` |
| 쇼핑 | `38` |

> 날짜 컬럼은 SQLite `TEXT` 타입입니다. 사용 시 문자열 포맷을 확인한 뒤 날짜로 변환하세요.
