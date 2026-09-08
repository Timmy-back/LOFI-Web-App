from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user import UserRepository
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.models.user import User

class EmailAlreadyRegisteredError(Exception):
    pass

async def create_user(*, db: AsyncSession, user_in: UserCreate) -> User:
    repo = UserRepository(db=db)
    user = await repo.create(
        email=user_in.email,
        hashed_password=hash_password(user_in.password)
    )
    if user is None:
        raise EmailAlreadyRegisteredError()

    return user
