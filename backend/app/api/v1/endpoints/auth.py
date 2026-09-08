from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut
from app.services.user import create_user, EmailAlreadyRegisteredError


router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(*, user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_user(db=db, user_in=user_in)
    except EmailAlreadyRegisteredError:
       raise HTTPException(status_code=400, detail="Email already registered")
