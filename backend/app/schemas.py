from datetime import datetime

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    region: str | None = None
    category: str | None = None
    location_type: Literal["tour", "none"]
    tour_content_id: str | None = Field(default=None, max_length=50)

    @model_validator(mode="after")
    def validate_location(self):
        if self.location_type == "tour" and not self.tour_content_id:
            raise ValueError("A tourist location must be selected")
        if self.location_type == "none" and self.tour_content_id:
            raise ValueError("tour_content_id is only allowed for tour locations")
        return self


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
    tour_title: str | None = None
    tour_address: str | None = None
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


class MapLocationItem(BaseModel):
    id: str
    title: str
    address: str
    latitude: float
    longitude: float
    image_url: str | None = None


class MapLocationListResponse(BaseModel):
    items: list[MapLocationItem]
    total: int


class MapPopularPostItem(BaseModel):
    id: int
    title: str
    view_count: int
    comment_count: int
    like_count: int


class MapPopularPostResponse(BaseModel):
    items: list[MapPopularPostItem]


class ChatHistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    region: str | None = None
    history: list[ChatHistoryItem] | None = None


class ChatResponse(BaseModel):
    answer: str
