from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user import UserRepository
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password
from app.models.user import User

class EmailAlreadyRegisteredError(Exception):
    pass

async def create_user(*, repo: UserRepository, user_in: UserCreate) -> User:
    user = await repo.create(
        email=user_in.email,
        hashed_password=hash_password(user_in.password)
    )
    if user is None:
        raise EmailAlreadyRegisteredError()
    return user

async def authenticate_user(*,repo: UserRepository, email: str, password: str) -> User | None:
    user = await repo.get_by_email(email=email)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
