from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints import xgboost

app = FastAPI()

# Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(xgboost.router, prefix="/api")