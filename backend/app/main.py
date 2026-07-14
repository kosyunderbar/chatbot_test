from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, schemas
from .deepl import DeepLTranslationError, translate_text
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LocalHub Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/posts", response_model=schemas.PostListResponse)
def read_posts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    region: str | None = None,
    category: str | None = None,
    keyword: str | None = None,
    db: Session = Depends(get_db),
):
    items, total = crud.list_posts(
        db=db,
        page=page,
        size=size,
        region=region,
        category=category,
        keyword=keyword,
    )
    return {"items": items, "total": total, "page": page, "size": size}


@app.get("/api/posts/{post_id}", response_model=schemas.PostRead)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@app.post("/api/posts", response_model=schemas.PostRead, status_code=status.HTTP_201_CREATED)
def create_post(post_in: schemas.PostCreate, db: Session = Depends(get_db)):
    return crud.create_post(db, post_in)


@app.put("/api/posts/{post_id}", response_model=schemas.PostRead)
def update_post(post_id: int, post_in: schemas.PostUpdate, db: Session = Depends(get_db)):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.password != post_in.password:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid password")
    return crud.update_post(db, post, post_in)


@app.delete("/api/posts/{post_id}")
def remove_post(post_id: int, delete_in: schemas.PostDeleteRequest, db: Session = Depends(get_db)):
    post = crud.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.password != delete_in.password:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid password")
    crud.delete_post(db, post)
    return {"message": "Post deleted"}


@app.post("/api/translate", response_model=schemas.TranslateResponse)
def translate(request: schemas.TranslateRequest):
    try:
        return translate_text(
            text=request.text,
            target_lang=request.target_lang,
        )
    except DeepLTranslationError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
