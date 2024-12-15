from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class TodoTask(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    due_date: Optional[datetime] = None
    priority: str = "medium"
    workspace: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "title": "Buy groceries",
                    "description": "Milk, bread, eggs",
                    "completed": False,
                    "due_date": "2023-12-31T00:00:00",
                    "workspace": "personal"
                }
            ]
        }
    }

class UpdateTodoTask(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None

class Workspace(BaseModel):
    name: str
    password: str = Field(..., min_length=5) 

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "personal",
                    "password": "password123"
                }
            ]
        }
    }
