"""LocalHub 챗봇 — 2-Step AI + seoul.db 검색."""

from __future__ import annotations

import json
import logging
import math
import os
import sqlite3
import unicodedata
from datetime import date
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

logger = logging.getLogger(__name__)

MODEL = "gpt-4o-mini"
DB_PATH = Path(__file__).resolve().parents[2] / "datas" / "seoul.db"
MAX_RESULTS = 5
MAX_PER_CATEGORY = 3
MAX_HISTORY_TURNS = 3
NEARBY_RADIUS = 0.03
NEARBY_RADIUS_WIDE = 0.08

CONTENT_TYPES = {
    "12": "관광지",
    "14": "문화시설",
    "15": "축제공연행사",
    "25": "여행코스",
    "28": "레포츠",
    "32": "숙박",
    "38": "쇼핑",
    "39": "음식점",
}

SPECIAL_MAPPING = {
    "홍대": "마포", "홍익대": "마포", "연대": "서대문", "연세대": "서대문",
    "신촌": "서대문", "이대": "서대문", "이화여대": "서대문", "서강대": "마포",
    "건대": "광진", "건국대": "광진", "고대": "성북", "고려대": "성북",
    "안암": "성북", "성대": "종로", "성균관대": "종로", "경희대": "동대문",
    "외대": "동대문", "한국외대": "동대문", "서울대": "관악", "낙성대": "관악",
    "한양대": "성동", "왕십리": "성동", "중앙대": "동작", "흑석": "동작",
    "숭실대": "동작", "상도": "동작", "동국대": "중구",
    "명동": "중구", "을지로": "중구", "충무로": "중구", "남산": "중구",
    "인사동": "종로", "북촌": "종로", "삼청동": "종로", "익선동": "종로",
    "광화문": "종로", "경복궁": "종로", "창덕궁": "종로", "대학로": "종로",
    "혜화": "종로", "이태원": "용산", "해방촌": "용산", "경리단길": "용산",
    "한남동": "용산", "압구정": "강남", "청담": "강남", "강남역": "강남",
    "가로수길": "강남", "코엑스": "강남", "테헤란로": "강남", "삼성동": "강남",
    "잠실": "송파", "석촌": "송파", "성수동": "성동", "성수": "성동",
    "서울숲": "성동", "합정": "마포", "상수": "마포", "망원": "마포",
    "연남동": "마포", "연남": "마포", "상암": "마포", "여의도": "영등포",
    "마곡": "강서", "신림": "관악", "봉천": "관악", "노량진": "동작",
    "수유": "강북", "미아": "강북", "쌍문": "도봉", "창동": "도봉",
    "중계": "노원", "공릉": "노원", "천호": "강동", "길동": "강동",
    "암사": "강동", "고덕": "강동",
    "광장시장": "종로", "남대문시장": "중구", "남대문": "중구",
    "동대문시장": "동대문", "망원시장": "마포", "통인시장": "종로",
    "롯데월드": "송파", "더현대": "영등포", "갤러리아": "강남",
    "아이파크몰": "용산",
    "뚝섬한강공원": "광진", "반포한강공원": "서초", "이촌한강공원": "용산",
    "여의도한강공원": "영등포", "올림픽공원": "송파", "월드컵공원": "마포",
    "노을공원": "마포", "하늘공원": "마포", "선유도": "영등포",
    "북한산": "강북", "뚝섬": "광진",
    "서울역": "중구", "용산역": "용산", "수서역": "강남", "청량리": "동대문",
    "고속터미널": "서초",
    "싸피": "강남", "ssafy": "강남", "SSAFY": "강남",
}

_SORTED_SPECIAL_KEYS = sorted(SPECIAL_MAPPING.keys(), key=len, reverse=True)

STEP1_SYSTEM_PROMPT = f"""너는 서울 관광 정보 DB 검색 도우미다.
사용자 질문을 분석해서 DB 검색 파라미터를 JSON으로만 반환한다.

contenttypeid 코드:
- "12": 관광지 (명소, 공원, 볼거리, 궁궐, 전망대)
- "14": 문화시설 (박물관, 미술관, 전시, 공연장, 도서관)
- "15": 축제공연행사 (축제, 행사, 공연, 이벤트, 페스티벌)
- "28": 레포츠 (스포츠, 액티비티, 체험, 등산, 자전거)
- "32": 숙박 (호텔, 펜션, 게스트하우스, 모텔)
- "38": 쇼핑 (시장, 백화점, 쇼핑몰, 면세점)
- "39": 음식점 (맛집, 식당, 카페, 레스토랑, 먹거리)

반환 JSON 형식:
{{"contenttypeids": ["15"], "keyword": "강남" 또는 null,
  "landmark": "여의도한강공원" 또는 null,
  "date_filter": true 또는 false, "course": true 또는 false}}

규칙:
1. contenttypeids: 질문 의도에 맞는 카테고리 코드 배열 (1~3개).
   - "데이트 코스", "관광 코스", "하루 일정", "놀 만한 곳" 같은
     코스/조합형 질문은 ["12", "14", "39"]를 반환하고 course를 true로 한다.
   - 판단이 어려우면 빈 배열 [].
1-1. course: 사용자가 코스, 일정, 동선, 데이트 계획 등
   '여러 장소를 묶은 추천'을 원하면 true. 단일 장소 추천이면 false.
2. keyword: 검색할 지역명. 반드시 서울 행정구 이름(예: 강남, 마포, 종로)이나
   법정동 이름으로 변환한다. "구"는 붙이지 않는다 (예: "강남구" X → "강남" O).
   - 홍대→마포, 건대→광진, 신촌→서대문 처럼 상징적 지명은 행정구로 변환.
   - 지역 언급이 없으면 null.
3. landmark vs keyword 구분 규칙:
   [landmark 사용] 사용자가 "~근처", "~주변", "~앞", "~옆" 처럼
     특정 장소를 '기준점'으로 삼아 그 주변을 묻는 경우.
     landmark에 그 장소의 정식 명칭을 넣는다.
     - "한강공원"처럼 여러 곳이 있으면 대표 명칭으로 구체화한다
       (예: "한강공원" → "여의도한강공원").
     - 예: "남산 근처 맛집" → landmark="남산공원(서울)", keyword=null
     - 예: "경복궁 주변 카페" → landmark="경복궁", keyword=null
   [keyword 사용] 사용자가 "~에", "~에서", "~의" 처럼
     특정 장소 '안/위'의 것을 직접 묻는 경우.
     keyword에 그 장소명을 그대로 넣는다 (행정구로 변환하지 말 것).
     - 예: "남산에 볼만한 것" → keyword="남산", landmark=null
     - 예: "경복궁에서 할 수 있는 것" → keyword="경복궁", landmark=null
   [행정구 단위 지역] 홍대, 강남, 마포 등 동네 이름은 항상 keyword로 처리.
     keyword에 행정구 이름으로 변환해서 넣는다 (예: "홍대" → keyword="마포").
   - landmark와 keyword는 동시에 사용할 수 없다. 둘 중 하나만 null이 아니어야 한다.
   - 장소 기준이 없으면 둘 다 null.
4. date_filter: 사용자가 "지금", "요즘", "이번 주", "이번 달", "오늘" 등
   현재 진행 중인 축제/행사를 묻는 경우에만 true. 그 외에는 false.
5. 반드시 JSON 객체만 반환한다. 설명이나 다른 텍스트를 붙이지 않는다.

오늘 날짜: {date.today().strftime("%Y-%m-%d")}
"""

STEP2_SYSTEM_PROMPT = f"""너는 서울 지역 정보 안내 챗봇 'LocalHub'다.

규칙:
1. 반드시 [검색 결과] 데이터만 기반으로 답변한다.
2. [검색 상황]에 적힌 지시를 따라 답변의 맥락을 잡는다.
3. 데이터에 없는 정보(가격, 운영시간, 메뉴 등)는 절대 지어내지 않는다.
4. 답변은 친근하고 간결한 한국어로 한다. 목록은 최대 5개까지만 소개한다.
5. 행사 기간은 "2026년 9월 16일~9월 20일"처럼 읽기 쉽게 바꿔서 알려준다.
6. [검색 결과]에 "거리:" 항목이 명시된 경우에만 그 값을 그대로 언급한다.
   거리 정보가 없으면 절대 거리를 말하지 않는다.
7. 데이트 코스나 일정 추천 질문이면 검색 결과를 조합해
   "먼저 ○○을 둘러보고, 근처 ○○에서 식사"처럼 동선 형태로 제안한다.
8. 마크다운 문법(**, #, - 등)을 쓰지 말고 일반 텍스트로만 답한다.

오늘 날짜: {date.today().strftime("%Y-%m-%d")}
"""


class ChatbotError(RuntimeError):
    """챗봇 처리 중 발생한 오류."""


_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        if not api_key:
            raise ChatbotError("OPENAI_API_KEY is not set")
        _client = OpenAI(api_key=api_key)
    return _client


def resolve_special_places(user_message: str) -> tuple[str, str | None]:
    for key in _SORTED_SPECIAL_KEYS:
        if key in user_message:
            gu = SPECIAL_MAPPING[key]
            gu_label = gu if gu.endswith("구") else f"{gu}구"
            hint = f'참고: 질문 속 "{key}"(은)는 서울 {gu_label} 인근이다.'
            return hint, gu
    return "", None


def extract_search_params(user_message: str, location_hint: str) -> dict:
    user_content = user_message
    if location_hint:
        user_content = f"{user_message}\n\n{location_hint}"

    try:
        response = _get_client().chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": STEP1_SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
            temperature=0,
            max_tokens=150,
        )
        params = json.loads(response.choices[0].message.content)
    except (json.JSONDecodeError, KeyError, IndexError) as exc:
        logger.warning("Step1 parse failed, fallback to broad search: %s", exc)
        return {
            "contenttypeids": [],
            "keyword": None,
            "landmark": None,
            "date_filter": False,
            "course": False,
        }

    raw_ids = params.get("contenttypeids") or []
    if isinstance(raw_ids, str):
        raw_ids = [raw_ids]
    ctids = [str(content_id) for content_id in raw_ids if str(content_id) in CONTENT_TYPES][:3]

    keyword = params.get("keyword")
    if keyword is not None:
        keyword = str(keyword).strip() or None

    landmark = params.get("landmark")
    if landmark is not None:
        landmark = str(landmark).strip() or None

    course = bool(params.get("course", False))
    if course:
        ctids = [content_id for content_id in ctids if content_id != "25"] or ["12", "14", "39"]
        if len(ctids) == 1:
            ctids = ["12", "14", "39"]

    return {
        "contenttypeids": ctids,
        "keyword": keyword,
        "landmark": landmark,
        "date_filter": bool(params.get("date_filter", False)),
        "course": course,
    }


def _connect() -> sqlite3.Connection:
    if not DB_PATH.exists():
        raise ChatbotError(f"Tour database not found: {DB_PATH}")
    conn = sqlite3.connect(f"file:{DB_PATH.as_posix()}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    return conn


def _date_condition() -> tuple[str, list[str]]:
    today = date.today().strftime("%Y%m%d")
    cond = (
        "eventstartdate IS NOT NULL AND eventstartdate != '' "
        "AND eventstartdate <= ? AND eventenddate >= ?"
    )
    return cond, [today, today]


def _approx_km(cx: float, cy: float, mapx: float, mapy: float) -> float:
    dx = (mapx - cx) * 88.8
    dy = (mapy - cy) * 111.0
    return math.sqrt(dx * dx + dy * dy)


def resolve_landmark(landmark: str) -> dict | None:
    conn = _connect()
    try:
        row = conn.execute(
            """
            SELECT contentid, title, mapx, mapy
            FROM locations
            WHERE title LIKE ? AND mapx > 0 AND mapy > 0
            ORDER BY LENGTH(title) ASC
            LIMIT 1
            """,
            (f"%{landmark}%",),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def _query_nearby(
    ctids: list[str],
    cx: float,
    cy: float,
    date_filter: bool,
    radius: float,
    exclude_contentid: str,
    limit: int,
) -> list[dict]:
    conditions = [
        "mapx BETWEEN ? AND ?",
        "mapy BETWEEN ? AND ?",
        "contentid != ?",
    ]
    args: list = [cx - radius, cx + radius, cy - radius, cy + radius, exclude_contentid]

    if ctids:
        placeholders = ",".join("?" * len(ctids))
        conditions.append(f"contenttypeid IN ({placeholders})")
        args.extend(ctids)

    if date_filter:
        cond, extra = _date_condition()
        conditions.append(cond)
        args.extend(extra)

    sql = f"""
        SELECT title, content_type_name, addr1, tel,
               eventstartdate, eventenddate, mapx, mapy,
               ((mapx-?)*(mapx-?) + (mapy-?)*(mapy-?)) AS dist
        FROM locations
        WHERE {' AND '.join(conditions)}
        ORDER BY dist
        LIMIT {limit}
    """
    args = [cx, cx, cy, cy] + args

    conn = _connect()
    try:
        rows = [dict(row) for row in conn.execute(sql, args).fetchall()]
    finally:
        conn.close()

    for row in rows:
        row["distance_km"] = round(_approx_km(cx, cy, row["mapx"], row["mapy"]), 1)
    return rows


def _query_by_keyword(
    ctids: list[str],
    keyword: str | None,
    date_filter: bool,
    limit: int,
) -> list[dict]:
    conditions: list[str] = []
    args: list = []

    if ctids:
        placeholders = ",".join("?" * len(ctids))
        conditions.append(f"contenttypeid IN ({placeholders})")
        args.extend(ctids)

    if keyword:
        conditions.append("(addr1 LIKE ? OR title LIKE ?)")
        args.extend([f"%{keyword}%", f"%{keyword}%"])

    if date_filter:
        cond, extra = _date_condition()
        conditions.append(cond)
        args.extend(extra)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    sql = f"""
        SELECT title, content_type_name, addr1, tel,
               eventstartdate, eventenddate
        FROM locations
        {where}
        ORDER BY
            CASE WHEN firstimage IS NOT NULL AND firstimage != '' THEN 0 ELSE 1 END,
            id
        LIMIT {limit}
    """

    conn = _connect()
    try:
        return [dict(row) for row in conn.execute(sql, args).fetchall()]
    finally:
        conn.close()


def _query_mixed_categories(query_fn, ctids: list[str]) -> list[dict]:
    if len(ctids) <= 1:
        return query_fn(ctids, MAX_RESULTS)

    mixed: list[dict] = []
    for ctid in ctids:
        mixed.extend(query_fn([ctid], MAX_PER_CATEGORY))
    return mixed


def search_locations(params: dict) -> tuple[list[dict], str, str]:
    ctids = params["contenttypeids"]
    keyword = params["keyword"]
    landmark = params["landmark"]
    date_filter = params["date_filter"]

    if landmark:
        base = resolve_landmark(landmark)
        if base:

            def nearby_fn(radius: float, use_date: bool):
                return _query_mixed_categories(
                    lambda ids, lim: _query_nearby(
                        ids,
                        base["mapx"],
                        base["mapy"],
                        use_date,
                        radius,
                        base["contentid"],
                        lim,
                    ),
                    ctids,
                )

            results = nearby_fn(NEARBY_RADIUS, date_filter)
            if results:
                return results, f'"{base["title"]}" 반경 3km 근접 검색', (
                    f'아래는 "{base["title"]}" 근처(거리순)에서 찾은 결과다. '
                    f'거리 정보를 활용해 자연스럽게 소개하라.'
                )

            if date_filter:
                results = nearby_fn(NEARBY_RADIUS, False)
                if results:
                    return results, "근접 검색 (날짜 조건 제외)", (
                        f'"{base["title"]}" 근처에서 지금 진행 중인 행사는 없다. '
                        f'사용자에게 "지금 진행 중인 것은 없지만"이라고 먼저 안내한 뒤 '
                        f'아래 목록을 예정/지난 일정과 함께 소개하라.'
                    )

            results = nearby_fn(NEARBY_RADIUS_WIDE, False)
            if results:
                return results, "근접 검색 (반경 7km 확대)", (
                    f'"{base["title"]}" 바로 근처에는 결과가 없어 '
                    f'조금 더 넓은 범위(약 7km)에서 찾은 결과다.'
                )

            if ctids:
                results = _query_nearby(
                    [],
                    base["mapx"],
                    base["mapy"],
                    False,
                    NEARBY_RADIUS,
                    base["contentid"],
                    MAX_RESULTS,
                )
                if results:
                    return results, "근접 검색 (카테고리 제외)", (
                        f'요청한 카테고리로는 "{base["title"]}" 근처에 결과가 없어 '
                        f'카테고리 무관하게 근처 장소를 찾은 결과다.'
                    )
        else:
            keyword = keyword or landmark

    def kw_fn(kw: str | None, use_date: bool):
        return _query_mixed_categories(
            lambda ids, lim: _query_by_keyword(ids, kw, use_date, lim),
            ctids,
        )

    results = kw_fn(keyword, date_filter)
    if results:
        return results, "키워드 검색 (전체 조건 일치)", (
            "아래는 사용자 질문 조건에 맞게 찾은 결과다."
        )

    if date_filter:
        results = kw_fn(keyword, False)
        if results:
            return results, "키워드 검색 (날짜 조건 제외)", (
                '조건에 맞는 지역에서 지금 진행 중인 행사는 없다. '
                '사용자에게 "지금 진행 중인 것은 없지만"이라고 먼저 안내한 뒤 '
                '아래 목록을 일정과 함께 소개하라.'
            )

    if keyword and ctids:
        results = kw_fn(None, False)
        if results:
            return results, f'"{keyword}" 결과 없음 → 카테고리 전체 추천', (
                f'"{keyword}" 지역에서는 결과를 찾지 못했다. '
                f'아래는 서울 전체에서 찾은 같은 카테고리 추천 목록이다.'
            )

    if keyword and ctids:
        results = _query_by_keyword([], keyword, False, MAX_RESULTS)
        if results:
            return results, "카테고리 조건 제외", (
                f'요청한 카테고리로는 결과가 없어 "{keyword}" 지역의 '
                f'다른 장소들을 찾은 결과다.'
            )

    return [], "검색 결과 없음", (
        "조건에 맞는 데이터를 찾지 못했다. 사용자에게 정중히 안내하고 "
        "다른 지역이나 카테고리로 다시 질문하도록 권하라."
    )


def format_context(results: list[dict], situation: str) -> str:
    lines = [f"[검색 상황]\n{situation}", "", "[검색 결과]"]
    if not results:
        lines.append("(없음)")
        return "\n".join(lines)

    for index, row in enumerate(results, 1):
        line = f"{index}. {row['title']} | 분류: {row['content_type_name']}"
        if row.get("addr1"):
            line += f" | 주소: {row['addr1']}"
        if row.get("tel"):
            line += f" | 전화: {row['tel']}"
        if row.get("eventstartdate"):
            start = row["eventstartdate"]
            end = row.get("eventenddate") or ""
            line += f" | 기간: {start}~{end}"
        if row.get("distance_km") is not None:
            line += f" | 거리: 약 {row['distance_km']}km"
        lines.append(line)
    return "\n".join(lines)


def generate_answer(user_message: str, context: str, history: list[dict]) -> str:
    messages = [{"role": "system", "content": STEP2_SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append(
        {
            "role": "user",
            "content": f"{context}\n\n[질문]\n{user_message}",
        }
    )

    response = _get_client().chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=600,
    )
    return response.choices[0].message.content.strip()


def chat_turn(user_message: str, history: list[dict] | None = None) -> str:
    """한 턴의 챗봇 응답을 생성한다."""
    user_message = unicodedata.normalize("NFC", user_message.strip())
    if not user_message:
        raise ChatbotError("Message must not be empty")

    history = history or []
    if len(history) > MAX_HISTORY_TURNS * 2:
        history = history[-MAX_HISTORY_TURNS * 2 :]

    location_hint, mapped_gu = resolve_special_places(user_message)
    if mapped_gu:
        logger.info("Special place detected: %s", mapped_gu)

    params = extract_search_params(user_message, location_hint)

    if mapped_gu and not params["keyword"] and not params["landmark"]:
        params["keyword"] = mapped_gu
        logger.info("Safety net applied keyword: %s", mapped_gu)

    if params["landmark"] and mapped_gu and not resolve_landmark(params["landmark"]):
        logger.info("Unknown landmark %s, fallback keyword %s", params["landmark"], mapped_gu)
        params["landmark"] = None
        params["keyword"] = params["keyword"] or mapped_gu

    results, debug_note, situation = search_locations(params)
    logger.info("Search returned %s items (%s)", len(results), debug_note)

    if params["course"] and results:
        situation += (
            " 사용자는 '코스'를 원한다. 아래 장소들을 조합해서 "
            "'1) ○○ 구경 → 2) 근처 ○○ 관람 → 3) ○○에서 식사' 형태의 "
            "반나절~하루 동선으로 구성해 제안하라. 장소는 3~5곳만 골라 쓴다."
        )

    context = format_context(results, situation)
    return generate_answer(user_message, context, history)
