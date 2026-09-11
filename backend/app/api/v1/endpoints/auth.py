from fastapi import APIRouter, Depends, HTTPException

from app.schemas.user import UserCreate, UserOut, Token
from app.services.user import authenticate_user, create_user, EmailAlreadyRegisteredError
from app.repositories.user import UserRepository, get_user_repository
from app.core.security import create_access_token
from app.dependencies import get_current_user
from app.models.user import User



router = APIRouter()


@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate, repo: UserRepository = Depends(get_user_repository)):
    try:
        return await create_user(repo=repo, user_in=user_in)
    except EmailAlreadyRegisteredError:
        raise HTTPException(status_code=400, detail="Email already registered")

@router.post("/login", response_model=Token)
async def login(user_in: UserCreate, repo: UserRepository = Depends(get_user_repository),):
    user = await authenticate_user(repo=repo, email=user_in.email, password=user_in.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def me(curret_user: User = Depends(get_current_user)):
    return curret_user
