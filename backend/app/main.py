from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from .models import TodoTask, UpdateTodoTask, Workspace
from .database import todo_collection, todo_serializer, workspace_collection, workspace_serializer, hash_password, verify_password
from bson import ObjectId
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    for error in errors:
        loc = error.get('loc', [])
        msg = error.get('msg', '')
        if 'password' in loc and 'too_short' in msg:
            return JSONResponse(
                status_code=400,
                content={"detail": "Password must be at least 5 characters long"}
            )
    return JSONResponse(
        status_code=422,
        content={"detail": errors}
    )

@app.get("/todos/{workspace}", response_model=List[dict])
async def list_todos(workspace: str):
    todos = []
    async for todo in todo_collection.find({"workspace": workspace}):
        todos.append(todo_serializer(todo))
    return todos

@app.post("/workspaces/", response_model=dict)
async def create_workspace(workspace: Workspace):
    existing_workspace = await workspace_collection.find_one({"name": workspace.name})
    if existing_workspace:
        raise HTTPException(status_code=400, detail="Workspace already exists")
    # No need to manually check password length as Pydantic does it
    hashed_password = hash_password(workspace.password)
    workspace_dict = workspace.dict()
    workspace_dict["password"] = hashed_password
    result = await workspace_collection.insert_one(workspace_dict)
    created_workspace = await workspace_collection.find_one({"_id": result.inserted_id})
    return workspace_serializer(created_workspace)

@app.post("/workspaces/login", response_model=dict)
async def login_workspace(workspace: Workspace):
    existing_workspace = await workspace_collection.find_one({"name": workspace.name})
    if not existing_workspace:
        raise HTTPException(status_code=400, detail="Invalid workspace name or password")
    if not verify_password(workspace.password, existing_workspace["password"]):
        raise HTTPException(status_code=400, detail="Invalid workspace name or password")
    return workspace_serializer(existing_workspace)

@app.post("/todos/", response_model=dict)
async def create_todo(todo: TodoTask):
    # Check if the workspace exists
    existing_workspace = await workspace_collection.find_one({"name": todo.workspace})
    if not existing_workspace:
        raise HTTPException(status_code=400, detail="Workspace does not exist")
    todo_dict = todo.dict()
    result = await todo_collection.insert_one(todo_dict)
    created_todo = await todo_collection.find_one({"_id": result.inserted_id})
    return todo_serializer(created_todo)

@app.put("/todos/{todo_id}")
async def update_todo(todo_id: str, todo_update: UpdateTodoTask):
    update_dict = {k: v for k, v in todo_update.dict().items() if v is not None}
    if len(update_dict) < 1:
        raise HTTPException(status_code=400, detail="No valid update data provided")
    
    result = await todo_collection.update_one(
        {"_id": ObjectId(todo_id)},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
        
    updated_todo = await todo_collection.find_one({"_id": ObjectId(todo_id)})
    return todo_serializer(updated_todo)

@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: str):
    result = await todo_collection.delete_one({"_id": ObjectId(todo_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}

@app.delete("/todos/")
async def delete_all_todos():
    await todo_collection.delete_many({})
    return {"message": "All todos deleted successfully"}
