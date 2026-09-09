from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from fastapi import Depends
from app.db.session import get_db


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, *, email: str, hashed_password: str) -> User | None:
        insert_stmt = insert(User).values(
            email=email,
            hashed_password=hashed_password,
        )
        stmt = insert_stmt.on_conflict_do_nothing(
            index_elements=[User.email]
        ).returning(User)

        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, *, email: str) -> User | None:
        stmt = select(User).where(
           User.email == email
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

def get_user_repository(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(db)
