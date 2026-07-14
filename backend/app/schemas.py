from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    region: str | None = None
    category: str | None = None


class PostWriteBase(PostBase):
    tags: list[str] = Field(default_factory=list, max_length=10)
    image_ids: list[int] = Field(default_factory=list, max_length=5)


class PostCreate(PostWriteBase):
    password: str = Field(..., min_length=1, max_length=255)


class PostUpdate(PostBase):
    password: str = Field(..., min_length=1, max_length=255)
    # Omitted fields preserve existing attachments; an empty list explicitly clears them.
    tags: list[str] | None = Field(default=None, max_length=10)
    image_ids: list[int] | None = Field(default=None, max_length=5)


class PostDeleteRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=255)


class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class PostImageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    original_name: str
    mime_type: str
    size: int
    sort_order: int


class ImageUploadResponse(PostImageRead):
    pass


class PostRead(PostBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    view_count: int
    like_count: int
    is_liked: bool = False
    tags: list[TagRead] = Field(default_factory=list)
    images: list[PostImageRead] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class PostListResponse(BaseModel):
    items: list[PostRead]
    total: int
    page: int
    size: int


class LikeResponse(BaseModel):
    liked: bool
    like_count: int


class PresenceResponse(BaseModel):
    active_visitors: int
    expires_in_seconds: int


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1)
    target_lang: str = Field(default="KO", min_length=2, max_length=5)


class TranslateResponse(BaseModel):
    source_text: str
    translated_text: str
    target_lang: str
    detected_source_lang: str | None = None


class LocationItem(BaseModel):
    id: int
    contentid: str
    contenttypeid: str
    content_type_name: str
    title: str
    addr1: str
    addr2: str
    tel: str
    mapx: float | None = None
    mapy: float | None = None
    firstimage: str
    firstimage2: str


class LocationListResponse(BaseModel):
    items: list[LocationItem]
    total: int
    category: str
    keyword: str | None = None
