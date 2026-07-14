from sqlalchemy.orm import Session

from . import models, schemas


def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()


def list_posts(
    db: Session,
    page: int = 1,
    size: int = 10,
    region: str | None = None,
    category: str | None = None,
    keyword: str | None = None,
):
    query = db.query(models.Post)

    if region:
        query = query.filter(models.Post.region == region)
    if category:
        query = query.filter(models.Post.category == category)
    if keyword:
        like_keyword = f"%{keyword}%"
        query = query.filter(
            (models.Post.title.like(like_keyword)) | (models.Post.content.like(like_keyword))
        )

    total = query.count()
    items = (
        query.order_by(models.Post.id.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )
    return items, total


def create_post(db: Session, post_in: schemas.PostCreate):
    post = models.Post(
        title=post_in.title,
        content=post_in.content,
        password=post_in.password,
        region=post_in.region,
        category=post_in.category,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def update_post(db: Session, post: models.Post, post_in: schemas.PostUpdate):
    post.title = post_in.title
    post.content = post_in.content
    post.region = post_in.region
    post.category = post_in.category
    db.commit()
    db.refresh(post)
    return post


def delete_post(db: Session, post: models.Post):
    db.delete(post)
    db.commit()
