from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user import UserRepository, get_user_repository


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), repo: UserRepository = Depends(get_user_repository),) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",)
    try:
        user_id = decode_access_token(token)
    except (JWTError, ValueError):
        raise credentials_exception
    user = await repo.get_by_id(user_id=user_id)
    if user is None:
        raise credentials_exception
    return user
