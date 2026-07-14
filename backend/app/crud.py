from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from . import models, schemas
from .tour_data import get_location_by_content_id


def get_post(db: Session, post_id: int):
    return (
        db.query(models.Post)
        .options(selectinload(models.Post.tags), selectinload(models.Post.images))
        .filter(models.Post.id == post_id)
        .first()
    )


def list_posts(
    db: Session,
    page: int = 1,
    size: int = 10,
    region: str | None = None,
    category: str | None = None,
    keyword: str | None = None,
    search_in: set[str] | None = None,
    sort: str = "latest",
):
    query = db.query(models.Post).options(selectinload(models.Post.tags), selectinload(models.Post.images))

    if region:
        query = query.filter(models.Post.region == region)
    if category:
        query = query.filter(models.Post.category == category)
    if keyword:
        like_keyword = f"%{keyword}%"
        search_in = search_in or {"title", "content", "tag"}
        conditions = []
        if "title" in search_in:
            conditions.append(models.Post.title.like(like_keyword))
        if "content" in search_in:
            conditions.append(models.Post.content.like(like_keyword))
        if "tag" in search_in:
            conditions.append(models.Post.tags.any(models.Tag.name.like(like_keyword)))
        if conditions:
            query = query.filter(or_(*conditions))

    total = query.count()
    order_by = {
        "latest": models.Post.id.desc(),
        "views": models.Post.view_count.desc(),
        "likes": models.Post.like_count.desc(),
    }[sort]
    items = (
        query.order_by(order_by, models.Post.id.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )
    return items, total


def _normalise_tags(tag_names: list[str]) -> list[str]:
    return list(dict.fromkeys(name.strip().lower() for name in tag_names if name.strip()))


def _set_tags(db: Session, post: models.Post, tag_names: list[str]):
    names = _normalise_tags(tag_names)
    if len(names) > 10:
        raise ValueError("A post can have at most 10 tags")
    tags = []
    for name in names:
        if len(name) > 50:
            raise ValueError("Each tag must be 50 characters or fewer")
        tag = db.query(models.Tag).filter(models.Tag.name == name).first()
        if tag is None:
            tag = models.Tag(name=name)
            db.add(tag)
        tags.append(tag)
    post.tags = tags


def _set_images(db: Session, post: models.Post, image_ids: list[int], visitor_id: str | None) -> list[str]:
    if len(set(image_ids)) != len(image_ids) or len(image_ids) > 5:
        raise ValueError("A post can have up to 5 unique images")
    existing_images = list(post.images)
    if not image_ids:
        post.images = []
        return [image.storage_name for image in existing_images]
    if not visitor_id:
        raise ValueError("X-Visitor-Id is required when attaching images")

    images = db.query(models.PostImage).filter(models.PostImage.id.in_(image_ids)).all()
    if len(images) != len(image_ids) or any(image.visitor_id != visitor_id for image in images):
        raise ValueError("One or more images are unavailable")
    if any(image.post_id not in (None, post.id) for image in images):
        raise ValueError("One or more images are already attached to another post")
    for index, image_id in enumerate(image_ids):
        image = next(image for image in images if image.id == image_id)
        image.post = post
        image.sort_order = index
    for image in list(post.images):
        if image.id not in image_ids:
            db.delete(image)
    return [image.storage_name for image in existing_images if image.id not in image_ids]


def _set_location(post: models.Post, post_in: schemas.PostBase):
    post.location_type = post_in.location_type
    post.tour_content_id = None
    post.tour_title = None
    post.tour_address = None
    if post_in.location_type == "tour":
        location = get_location_by_content_id(post_in.tour_content_id or "")
        if location is None:
            raise ValueError("Selected tourist location does not exist")
        post.tour_content_id = location["contentid"]
        post.tour_title = location["title"]
        post.tour_address = location["address"]


def create_post(db: Session, post_in: schemas.PostCreate, visitor_id: str | None = None):
    post = models.Post(
        title=post_in.title,
        content=post_in.content,
        password=post_in.password,
        region=post_in.region,
        category=post_in.category,
    )
    _set_location(post, post_in)
    db.add(post)
    _set_tags(db, post, post_in.tags)
    _set_images(db, post, post_in.image_ids, visitor_id)
    db.commit()
    return get_post(db, post.id)


def update_post(
    db: Session,
    post: models.Post,
    post_in: schemas.PostUpdate,
    visitor_id: str | None = None,
) -> tuple[models.Post, list[str]]:
    post.title = post_in.title
    post.content = post_in.content
    post.region = post_in.region
    post.category = post_in.category
    _set_location(post, post_in)
    removed_storage_names = []
    if post_in.tags is not None:
        _set_tags(db, post, post_in.tags)
    if post_in.image_ids is not None:
        removed_storage_names = _set_images(db, post, post_in.image_ids, visitor_id)
    db.commit()
    return get_post(db, post.id), removed_storage_names


def delete_post(db: Session, post: models.Post):
    db.delete(post)
    db.commit()


def increment_view_count(db: Session, post: models.Post):
    post.view_count += 1
    db.commit()
    return get_post(db, post.id)


def set_like(db: Session, post: models.Post, visitor_id: str, liked: bool) -> tuple[bool, int]:
    existing = (
        db.query(models.PostLike)
        .filter(models.PostLike.post_id == post.id, models.PostLike.visitor_id == visitor_id)
        .first()
    )
    if liked and existing is None:
        db.add(models.PostLike(post_id=post.id, visitor_id=visitor_id))
        post.like_count += 1
    elif not liked and existing is not None:
        db.delete(existing)
        post.like_count = max(0, post.like_count - 1)
    db.commit()
    return liked if (liked or existing is not None) else False, post.like_count


def is_liked_by(db: Session, post_id: int, visitor_id: str | None) -> bool:
    if not visitor_id:
        return False
    return (
        db.query(models.PostLike.id)
        .filter(models.PostLike.post_id == post_id, models.PostLike.visitor_id == visitor_id)
        .first()
        is not None
    )


def list_tags(db: Session, keyword: str | None = None, limit: int = 20):
    query = db.query(models.Tag)
    if keyword:
        query = query.filter(models.Tag.name.like(f"%{keyword.strip().lower()}%"))
    return query.order_by(models.Tag.name.asc()).limit(limit).all()


def list_popular_posts_for_tour(db: Session, tour_content_id: str, limit: int = 3):
    return (
        db.query(models.Post)
        .filter(models.Post.location_type == "tour", models.Post.tour_content_id == tour_content_id)
        .order_by(models.Post.like_count.desc(), models.Post.view_count.desc(), models.Post.id.desc())
        .limit(limit)
        .all()
    )
