from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    region: str | None = None
    category: str | None = None


class PostCreate(PostBase):
    password: str = Field(..., min_length=1, max_length=255)


class PostUpdate(PostBase):
    password: str = Field(..., min_length=1, max_length=255)


class PostDeleteRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=255)


class PostRead(PostBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class PostListResponse(BaseModel):
    items: list[PostRead]
    total: int
    page: int
    size: int
