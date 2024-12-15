import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import bcrypt
import asyncio

load_dotenv()


try:
  
    MONGODB_URL = os.getenv("MONGODB_URL")
    if not MONGODB_URL:
        raise ValueError("MONGODB_URL environment variable not set")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(
        MONGODB_URL,
        tls=True,
        tlsAllowInvalidCertificates=True
    )
    db = client[os.getenv("DATABASE_NAME", "todo_db")]
    todo_collection = db.todos
    workspace_collection = db.workspaces
    print("MongoDB client initialized")

except Exception as e:
    print(f"Error initializing MongoDB client: {e}")
    raise

async def check_connection():
    try:
        # Test the connection
        await client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        
 
        databases = await client.list_database_names()
        print(f"Available databases: {databases}")
        
      
        collections = await db.list_collection_names()
        print(f"Collections in {os.getenv('DATABASE_NAME')}: {collections}")
        
        return True
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

def todo_serializer(todo) -> dict:
    return {
        "id": str(todo["_id"]),
        "title": todo["title"],
        "description": todo["description"],
        "completed": todo["completed"],
        "created_at": todo["created_at"],
        "due_date": todo["due_date"],
        "priority": todo.get("priority", "medium"),
        "workspace": todo["workspace"]
    }

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(plain_password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)

def workspace_serializer(workspace) -> dict:
    return {
        "id": str(workspace["_id"]),
        "name": workspace["name"],
    }
