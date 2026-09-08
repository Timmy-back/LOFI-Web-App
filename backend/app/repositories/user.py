from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


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
