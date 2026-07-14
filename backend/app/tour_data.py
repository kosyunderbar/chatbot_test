import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).resolve().parents[2] / "datas" / "seoul.db"

CATEGORY_TO_CONTENTTYPE_IDS: dict[str, list[str]] = {
    "attraction": ["12"],
    "culture": ["14"],
    "festival": ["15"],
    "course": ["25"],
    "leisure": ["28"],
    "accommodation": ["32"],
    "shopping": ["38"],
}

ALL_CONTENTTYPE_IDS = {contenttype_id for ids in CATEGORY_TO_CONTENTTYPE_IDS.values() for contenttype_id in ids}


def _connect() -> sqlite3.Connection:
    if not DB_PATH.exists():
        raise FileNotFoundError(f"Tour database not found: {DB_PATH}")

    connection = sqlite3.connect(f"file:{DB_PATH.as_posix()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    return connection


def list_locations(
    category: str = "all",
    keyword: str | None = None,
    limit: int | None = None,
    offset: int = 0,
) -> tuple[list[dict], int]:
    conditions: list[str] = []
    parameters: list[str | int] = []

    if category != "all":
        contenttype_ids = CATEGORY_TO_CONTENTTYPE_IDS.get(category)
        if not contenttype_ids:
            if category in ALL_CONTENTTYPE_IDS:
                contenttype_ids = [category]
            else:
                raise ValueError(f"Unsupported category: {category}")

        placeholders = ", ".join(["?"] * len(contenttype_ids))
        conditions.append(f"contenttypeid IN ({placeholders})")
        parameters.extend(contenttype_ids)

    if keyword:
        like_keyword = f"%{keyword}%"
        conditions.append("(title LIKE ? OR addr1 LIKE ? OR addr2 LIKE ?)")
        parameters.extend([like_keyword, like_keyword, like_keyword])

    where_clause = f" WHERE {' AND '.join(conditions)}" if conditions else ""
    order_clause = " ORDER BY id ASC"
    limit_clause = ""
    pagination_parameters: list[int] = []

    if limit is not None:
        limit_clause = " LIMIT ? OFFSET ?"
        pagination_parameters.extend([limit, offset])

    select_sql = f"""
        SELECT
            id,
            contentid,
            contenttypeid,
            content_type_name,
            COALESCE(title, '') AS title,
            COALESCE(addr1, '') AS addr1,
            COALESCE(addr2, '') AS addr2,
            COALESCE(tel, '') AS tel,
            COALESCE(mapx, '') AS mapx,
            COALESCE(mapy, '') AS mapy,
            COALESCE(firstimage, '') AS firstimage,
            COALESCE(firstimage2, '') AS firstimage2
        FROM locations
        {where_clause}
        {order_clause}
        {limit_clause}
    """

    count_sql = f"SELECT COUNT(*) FROM locations{where_clause}"

    with _connect() as connection:
        rows = connection.execute(select_sql, [*parameters, *pagination_parameters]).fetchall()
        total = connection.execute(count_sql, parameters).fetchone()[0]

    return [dict(row) for row in rows], int(total)
import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).resolve().parents[2] / "datas" / "seoul.db"

CATEGORY_TO_CONTENTTYPE_IDS: dict[str, list[str]] = {
    "attraction": ["12"],
    "culture": ["14"],
    "festival": ["15"],
    "course": ["25"],
    "leisure": ["28"],
    "accommodation": ["32"],
    "shopping": ["38"],
}


def _connect() -> sqlite3.Connection:
    if not DB_PATH.exists():
        raise FileNotFoundError(f"Tour database not found: {DB_PATH}")

    connection = sqlite3.connect(f"file:{DB_PATH.as_posix()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    return connection


def list_locations(
    category: str = "all",
    keyword: str | None = None,
    limit: int | None = None,
    offset: int = 0,
) -> tuple[list[dict], int]:
    conditions: list[str] = []
    parameters: list[str | int] = []

    if category != "all":
        contenttype_ids = CATEGORY_TO_CONTENTTYPE_IDS.get(category)
        if not contenttype_ids:
            raise ValueError(f"Unsupported category: {category}")

        placeholders = ", ".join(["?"] * len(contenttype_ids))
        conditions.append(f"contenttypeid IN ({placeholders})")
        parameters.extend(contenttype_ids)

    if keyword:
        like_keyword = f"%{keyword}%"
        conditions.append("(title LIKE ? OR addr1 LIKE ? OR addr2 LIKE ?)")
        parameters.extend([like_keyword, like_keyword, like_keyword])

    where_clause = f" WHERE {' AND '.join(conditions)}" if conditions else ""
    order_clause = " ORDER BY id ASC"
    limit_clause = ""
    pagination_parameters: list[int] = []

    if limit is not None:
        limit_clause = " LIMIT ? OFFSET ?"
        pagination_parameters.extend([limit, offset])

    select_sql = f"""
        SELECT
            id,
            contentid,
            contenttypeid,
            content_type_name,
            COALESCE(title, '') AS title,
            COALESCE(addr1, '') AS addr1,
            COALESCE(addr2, '') AS addr2,
            COALESCE(tel, '') AS tel,
            COALESCE(mapx, '') AS mapx,
            COALESCE(mapy, '') AS mapy,
            COALESCE(firstimage, '') AS firstimage,
            COALESCE(firstimage2, '') AS firstimage2
        FROM locations
        {where_clause}
        {order_clause}
        {limit_clause}
    """

    count_sql = f"SELECT COUNT(*) FROM locations{where_clause}"

    with _connect() as connection:
        rows = connection.execute(select_sql, [*parameters, *pagination_parameters]).fetchall()
        total = connection.execute(count_sql, parameters).fetchone()[0]

    return [dict(row) for row in rows], int(total)
