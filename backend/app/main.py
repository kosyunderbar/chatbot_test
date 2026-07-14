from pathlib import Path
from threading import Lock
from time import monotonic
from uuid import uuid4

from fastapi import Depends, FastAPI, File, Header, HTTPException, Query, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .deepl import DeepLTranslationError, translate_text
from .database import Base, engine, get_db, run_migrations
from .tour_data import get_location_detail, list_locations, list_map_locations

Base.metadata.create_all(bind=engine)
run_migrations()

app = FastAPI(title="LocalHub Backend", version="0.1.0")
UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_IMAGE_SIZE = 5 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
PRESENCE_TTL_SECONDS = 60
active_visitors: dict[str, float] = {}
presence_lock = Lock()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


def _visitor_id_or_400(visitor_id: str | None) -> str:
    if not visitor_id or not visitor_id.strip() or len(visitor_id) > 100:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Valid X-Visitor-Id header is required")
    return visitor_id.strip()


def _post_response(post, db: Session, visitor_id: str | None) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "region": post.region,
        "category": post.category,
        "location_type": post.location_type,
        "tour_content_id": post.tour_content_id,
        "tour_title": post.tour_title,
        "tour_address": post.tour_address,
        "view_count": post.view_count,
        "like_count": post.like_count,
        "is_liked": crud.is_liked_by(db, post.id, visitor_id),
        "tags": [{"id": tag.id, "name": tag.name} for tag in post.tags],
        "images": [
            {
                "id": image.id,
                "url": f"/uploads/{image.storage_name}",
                "original_name": image.original_name,
                "mime_type": image.mime_type,
                "size": image.size,
                "sort_order": image.sort_order,
            }
            for image in post.images
        ],
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def _matches_image_signature(content: bytes, mime_type: str) -> bool:
    signatures = {
        "image/jpeg": (b"\xff\xd8\xff",),
        "image/png": (b"\x89PNG\r\n\x1a\n",),
        "image/webp": (b"RIFF",),
    }
    if not content.startswith(signatures[mime_type]):
        return False
    return mime_type != "image/webp" or content[8:12] == b"WEBP"


def _active_visitor_count(now: float | None = None) -> int:
    now = now if now is not None else monotonic()
    expired_ids = [visitor_id for visitor_id, seen_at in active_visitors.items() if now - seen_at >= PRESENCE_TTL_SECONDS]
    for visitor_id in expired_ids:
        del active_visitors[visitor_id]
    return len(active_visitors)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/presence/heartbeat", response_model=schemas.PresenceResponse)
def presence_heartbeat(visitor_id: str | None = Header(default=None, alias="X-Visitor-Id")):
    visitor_id = _visitor_id_or_400(visitor_id)
    with presence_lock:
        active_visitors[visitor_id] = monotonic()
        active_visitor_count = _active_visitor_count()
    return {"active_visitors": active_visitor_count, "expires_in_seconds": PRESENCE_TTL_SECONDS}


@app.get("/api/presence", response_model=schemas.PresenceResponse)
def read_presence():
    with presence_lock:
        active_visitor_count = _active_visitor_count()
    return {"active_visitors": active_visitor_count, "expires_in_seconds": PRESENCE_TTL_SECONDS}


@app.get("/api/posts", response_model=schemas.PostListResponse)
def read_posts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    region: str | None = None,
    category: str | None = None,
    keyword: str | None = None,
    search_in: str = Query(default="title,content,tag"),
    sort: str = Query(default="latest", pattern="^(latest|views|likes)$"),
    visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"),
    db: Session = Depends(get_db),
):
    allowed_search_fields = {"title", "content", "tag"}
    search_fields = {field.strip() for field in search_in.split(",") if field.strip()}
    if not search_fields or not search_fields.issubset(allowed_search_fields):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid search_in value")
    items, total = crud.list_posts(
        db=db,
        page=page,
        size=size,
        region=region,
        category=category,
        keyword=keyword,
        search_in=search_fields,
        sort=sort,
    )
    return {"items": [_post_response(post, db, visitor_id) for post in items], "total": total, "page": page, "size": size}


@app.get("/api/posts/{post_id}", response_model=schemas.PostRead)
def read_post(post_id: int, visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"), db: Session = Depends(get_db)):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    post = crud.increment_view_count(db, post)
    return _post_response(post, db, visitor_id)


@app.post("/api/posts", response_model=schemas.PostRead, status_code=status.HTTP_201_CREATED)
def create_post(
    post_in: schemas.PostCreate,
    visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"),
    db: Session = Depends(get_db),
):
    try:
        post = crud.create_post(db, post_in, visitor_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    return _post_response(post, db, visitor_id)


@app.put("/api/posts/{post_id}", response_model=schemas.PostRead)
def update_post(
    post_id: int,
    post_in: schemas.PostUpdate,
    visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"),
    db: Session = Depends(get_db),
):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.password != post_in.password:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid password")
    try:
        post, removed_storage_names = crud.update_post(db, post, post_in, visitor_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    for storage_name in removed_storage_names:
        (UPLOAD_DIR / storage_name).unlink(missing_ok=True)
    return _post_response(post, db, visitor_id)


@app.delete("/api/posts/{post_id}")
def remove_post(post_id: int, delete_in: schemas.PostDeleteRequest, db: Session = Depends(get_db)):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.password != delete_in.password:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid password")
    image_paths = [UPLOAD_DIR / image.storage_name for image in post.images]
    crud.delete_post(db, post)
    for image_path in image_paths:
        image_path.unlink(missing_ok=True)
    return {"message": "Post deleted"}


@app.post("/api/posts/{post_id}/likes", response_model=schemas.LikeResponse)
def like_post(
    post_id: int,
    visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"),
    db: Session = Depends(get_db),
):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    liked, like_count = crud.set_like(db, post, _visitor_id_or_400(visitor_id), True)
    return {"liked": liked, "like_count": like_count}


@app.delete("/api/posts/{post_id}/likes", response_model=schemas.LikeResponse)
def unlike_post(
    post_id: int,
    visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"),
    db: Session = Depends(get_db),
):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    liked, like_count = crud.set_like(db, post, _visitor_id_or_400(visitor_id), False)
    return {"liked": liked, "like_count": like_count}


@app.get("/api/tags", response_model=list[schemas.TagRead])
def read_tags(
    keyword: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.list_tags(db, keyword, limit)


@app.post("/api/uploads/images", response_model=schemas.ImageUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    image: UploadFile = File(...),
    visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"),
    db: Session = Depends(get_db),
):
    visitor_id = _visitor_id_or_400(visitor_id)
    extension = ALLOWED_IMAGE_TYPES.get(image.content_type or "")
    if extension is None:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only JPEG, PNG, and WebP images are allowed")
    content = await image.read(MAX_IMAGE_SIZE + 1)
    if not content or len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image must be between 1 byte and 5 MB")
    if not _matches_image_signature(content, image.content_type):
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Image content does not match its MIME type")
    storage_name = f"{uuid4().hex}{extension}"
    (UPLOAD_DIR / storage_name).write_bytes(content)
    record = models.PostImage(
        visitor_id=visitor_id,
        storage_name=storage_name,
        original_name=(image.filename or "image")[:255],
        mime_type=image.content_type,
        size=len(content),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {
        "id": record.id,
        "url": f"/uploads/{record.storage_name}",
        "original_name": record.original_name,
        "mime_type": record.mime_type,
        "size": record.size,
        "sort_order": record.sort_order,
    }


@app.delete("/api/uploads/images/{image_id}")
def remove_uploaded_image(
    image_id: int,
    visitor_id: str | None = Header(default=None, alias="X-Visitor-Id"),
    db: Session = Depends(get_db),
):
    visitor_id = _visitor_id_or_400(visitor_id)
    image = db.query(models.PostImage).filter(models.PostImage.id == image_id).first()
    if image is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    if image.visitor_id != visitor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Image does not belong to this visitor")
    if image.post_id is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Attached images must be removed by updating or deleting the post")
    image_path = UPLOAD_DIR / image.storage_name
    db.delete(image)
    db.commit()
    image_path.unlink(missing_ok=True)
    return {"message": "Image deleted"}


@app.post("/api/translate", response_model=schemas.TranslateResponse)
def translate(request: schemas.TranslateRequest):
    try:
        return translate_text(
            text=request.text,
            target_lang=request.target_lang,
        )
    except DeepLTranslationError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@app.get("/api/locations", response_model=schemas.LocationListResponse)
def read_locations(
    category: str = Query(default="all"),
    keyword: str | None = None,
    limit: int | None = Query(default=None, ge=1, le=5000),
    offset: int = Query(default=0, ge=0),
):
    try:
        items, total = list_locations(category=category, keyword=keyword, limit=limit, offset=offset)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return {"items": items, "total": total, "category": category, "keyword": keyword}


@app.get("/api/locations/{content_id}", response_model=schemas.LocationItem)
def read_location_detail(content_id: str):
    location = get_location_detail(content_id)
    if location is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")
    return location


@app.get("/api/map/locations", response_model=schemas.MapLocationListResponse)
def read_map_locations(
    min_lat: float = Query(..., ge=-90, le=90),
    max_lat: float = Query(..., ge=-90, le=90),
    min_lng: float = Query(..., ge=-180, le=180),
    max_lng: float = Query(..., ge=-180, le=180),
    category: str = Query(default="all"),
    limit: int = Query(default=10000, ge=1, le=10000),
):
    if min_lat > max_lat or min_lng > max_lng:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid map bounds")
    try:
        items, total = list_map_locations(min_lat, max_lat, min_lng, max_lng, category, limit)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return {"items": items, "total": total}


@app.get("/api/map/locations/{tour_content_id}/popular-posts", response_model=schemas.MapPopularPostResponse)
def read_popular_posts_for_map_location(
    tour_content_id: str,
    limit: int = Query(default=3, ge=1, le=10),
    db: Session = Depends(get_db),
):
    posts = crud.list_popular_posts_for_tour(db, tour_content_id, limit)
    return {
        "items": [
            {
                "id": post.id,
                "title": post.title,
                "view_count": post.view_count,
                "comment_count": 0,
                "like_count": post.like_count,
            }
            for post in posts
        ]
    }
