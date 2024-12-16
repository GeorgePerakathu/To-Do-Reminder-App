import requests
import pytest
import time
import json  

BASE_URL = "https://backend-todo-taskmanager.onrender.com"

def test_create_workspace_success():

    payload = {
        "name": "testworkspace_" + str(int(time.time())),  # Unique workspace name
        "password": "strongpassword123"
    }
    
  
    response = requests.post(f"{BASE_URL}/workspaces/", json=payload)
    

    assert response.status_code == 200
 
    response_json = response.json()
    assert "id" in response_json
    assert response_json["name"] == payload["name"]

def test_login_workspace():

    workspace_name = "logintest_" + str(int(time.time()))
    create_payload = {
        "name": workspace_name,
        "password": "testpassword"
    }
    
    create_response = requests.post(f"{BASE_URL}/workspaces/", json=create_payload)
    assert create_response.status_code == 200
    


    login_payload = {
        "name": workspace_name,
        "password": "testpassword"
    }
    
    login_response = requests.post(f"{BASE_URL}/workspaces/login", json=login_payload)
    

    assert login_response.status_code == 200

    response_json = login_response.json()
    assert "id" in response_json
    assert response_json["name"] == workspace_name

def test_create_todo():

    workspace_name = "todotest_" + str(int(time.time()))
    create_payload = {
        "name": workspace_name,
        "password": "testpassword"
    }
    
    # Create workspace
    create_response = requests.post(f"{BASE_URL}/workspaces/", json=create_payload)
    assert create_response.status_code == 200
 
    login_payload = {
        "name": workspace_name,
        "password": "testpassword"
    }
    login_response = requests.post(f"{BASE_URL}/workspaces/login", json=login_payload)
    assert login_response.status_code == 200



    todo_payload = {
        "title": "Test Todo",
        "description": "This is a test todo",
        "due_date": "2024-12-31T00:00:00",
        "priority": "medium",
        "workspace": workspace_name
    }
    
    # Send request without access token
    todo_response = requests.post(f"{BASE_URL}/todos/", json=todo_payload)
    
    # Assertions
    assert todo_response.status_code == 200
    response_json = todo_response.json()
    assert "id" in response_json
    assert response_json["title"] == todo_payload["title"]

def test_create_workspace_duplicate():
    # Create a workspace
    workspace_name = "duplicatetest_" + str(int(time.time()))
    payload = {
        "name": workspace_name,
        "password": "duplicatepassword"
    }
    response = requests.post(f"{BASE_URL}/workspaces/", json=payload)
    assert response.status_code == 200

    # Attempt to create the same workspace again
    duplicate_response = requests.post(f"{BASE_URL}/workspaces/", json=payload)
    assert duplicate_response.status_code == 400
    assert duplicate_response.json()["detail"] == "Workspace already exists"

def test_login_workspace_incorrect_password():
    # Create a workspace
    workspace_name = "incorrectpasstest_" + str(int(time.time()))
    create_payload = {
        "name": workspace_name,
        "password": "correctpassword"
    }
    create_response = requests.post(f"{BASE_URL}/workspaces/", json=create_payload)
    assert create_response.status_code == 200

    # Attempt to login with incorrect password
    login_payload = {
        "name": workspace_name,
        "password": "wrongpassword"
    }
    login_response = requests.post(f"{BASE_URL}/workspaces/login", json=login_payload)
    assert login_response.status_code == 400
    assert login_response.json()["detail"] == "Invalid workspace name or password"

def test_create_todo_nonexistent_workspace():
    # Create todo payload for a non-existent workspace
    todo_payload = {
        "title": "Invalid Workspace Todo",
        "description": "This todo should not be created",
        "due_date": "2024-12-31T00:00:00",
        "priority": "high",
        "workspace": "nonexistent_workspace_" + str(int(time.time()))
    }

    # Attempt to create todo
    todo_response = requests.post(f"{BASE_URL}/todos/", json=todo_payload)
    assert todo_response.status_code == 400
    assert todo_response.json()["detail"] == "Workspace does not exist"

def test_get_todos_empty_workspace():
    # Create a workspace
    workspace_name = "emptyworkspacetest_" + str(int(time.time()))
    create_payload = {
        "name": workspace_name,
        "password": "emptypassword"
    }
    create_response = requests.post(f"{BASE_URL}/workspaces/", json=create_payload)
    assert create_response.status_code == 200

    # Retrieve todos for the new workspace (should be empty)
    get_response = requests.get(f"{BASE_URL}/todos/{workspace_name}")
    assert get_response.status_code == 200
    assert isinstance(get_response.json(), list)
    assert len(get_response.json()) == 0

def test_update_todo_success():
    # Create a workspace
    workspace_name = "updatetest_" + str(int(time.time()))
    create_payload = {
        "name": workspace_name,
        "password": "updatepassword"
    }
    create_response = requests.post(f"{BASE_URL}/workspaces/", json=create_payload)
    assert create_response.status_code == 200

    # Create a todo
    todo_payload = {
        "title": "Original Title",
        "description": "Original Description",
        "due_date": "2024-06-30T00:00:00",
        "priority": "low",
        "workspace": workspace_name
    }
    todo_response = requests.post(f"{BASE_URL}/todos/", json=todo_payload)
    assert todo_response.status_code == 200
    todo_id = todo_response.json()["id"]

    # Update the todo
    update_payload = {
        "title": "Updated Title",
        "completed": True
    }
    update_response = requests.put(f"{BASE_URL}/todos/{todo_id}", json=update_payload)
    assert update_response.status_code == 200
    updated_todo = update_response.json()
    assert updated_todo["title"] == "Updated Title"
    assert updated_todo["completed"] is True

def test_update_todo_nonexistent():
    # Attempt to update a non-existent todo
    fake_todo_id = "64b8f9a2fc13ae1f8e000000"  # Example ObjectId
    update_payload = {
        "title": "Should Not Update",
        "completed": True
    }
    update_response = requests.put(f"{BASE_URL}/todos/{fake_todo_id}", json=update_payload)
    assert update_response.status_code == 404
    assert update_response.json()["detail"] == "Todo not found"

def test_delete_todo_success():
    # Create a workspace
    workspace_name = "deletetest_" + str(int(time.time()))
    create_payload = {
        "name": workspace_name,
        "password": "deletepassword"
    }
    create_response = requests.post(f"{BASE_URL}/workspaces/", json=create_payload)
    assert create_response.status_code == 200

    # Create a todo
    todo_payload = {
        "title": "Delete Me",
        "description": "This todo will be deleted",
        "due_date": "2024-07-31T00:00:00",
        "priority": "medium",
        "workspace": workspace_name
    }
    todo_response = requests.post(f"{BASE_URL}/todos/", json=todo_payload)
    assert todo_response.status_code == 200
    todo_id = todo_response.json()["id"]

    # Delete the todo
    delete_response = requests.delete(f"{BASE_URL}/todos/{todo_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Todo deleted successfully"

    # Verify deletion
    get_response = requests.get(f"{BASE_URL}/todos/{workspace_name}")
    assert get_response.status_code == 200
    todos = get_response.json()
    assert all(todo["id"] != todo_id for todo in todos)

def test_delete_todo_nonexistent():
    # Attempt to delete a non-existent todo
    fake_todo_id = "64b8f9a2fc13ae1f8e000001"  # Example ObjectId
    delete_response = requests.delete(f"{BASE_URL}/todos/{fake_todo_id}")
    assert delete_response.status_code == 404
    assert delete_response.json()["detail"] == "Todo not found"

def test_input_validation_missing_fields():
    # Attempt to create a workspace without a password
    payload = {
        "name": "invalidworkspace_" + str(int(time.time()))
        # Missing 'password'
    }
    response = requests.post(f"{BASE_URL}/workspaces/", json=payload)
    assert response.status_code == 422  # Unprocessable Entity
    assert "detail" in response.json()

def test_input_validation_invalid_data_types():
    # Attempt to create a todo with invalid priority type
    workspace_name = "invaliddatatype_" + str(int(time.time()))
    create_payload = {
        "name": workspace_name,
        "password": "validpassword"
    }
    create_response = requests.post(f"{BASE_URL}/workspaces/", json=create_payload)
    assert create_response.status_code == 200

    todo_payload = {
        "title": "Invalid Priority",
        "description": "Testing invalid priority type",
        "due_date": "invalid-date-format",
        "priority": 123,  # Should be a string
        "workspace": workspace_name
    }
    todo_response = requests.post(f"{BASE_URL}/todos/", json=todo_payload)
    assert todo_response.status_code == 422  # Unprocessable Entity
    assert "detail" in todo_response.json()