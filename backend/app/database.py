from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./localhub.db"

connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_migrations():
    """Apply additive SQLite migrations for databases created before new post fields."""
    inspector = inspect(engine)
    if "posts" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("posts")}
    with engine.begin() as connection:
        if "view_count" not in columns:
            connection.execute(text("ALTER TABLE posts ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0"))
        if "like_count" not in columns:
            connection.execute(text("ALTER TABLE posts ADD COLUMN like_count INTEGER NOT NULL DEFAULT 0"))
        if "location_type" not in columns:
            connection.execute(text("ALTER TABLE posts ADD COLUMN location_type TEXT NOT NULL DEFAULT 'none'"))
        if "tour_content_id" not in columns:
            connection.execute(text("ALTER TABLE posts ADD COLUMN tour_content_id TEXT"))
        if "tour_title" not in columns:
            connection.execute(text("ALTER TABLE posts ADD COLUMN tour_title TEXT"))
        if "tour_address" not in columns:
            connection.execute(text("ALTER TABLE posts ADD COLUMN tour_address TEXT"))
