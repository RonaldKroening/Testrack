from fastapi import FastAPI,HTTPException
import sqlite3
from typing import List, Dict
import json
import bcrypt
import os 
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Database connection function
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Function to fetch data from SQLite table
@app.get("/get_tests")
def get_tests():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, exam_type, number_of_questions FROM tests")  # Replace 'your_table_name' with the actual table name
    rows = cursor.fetchall()
    
    cursor.execute("SELECT id FROM tests") 
    ids = cursor.fetchall()
    
    conn.close()

    data = [dict(row) for row in rows]
    for i in range(len(data)):
        r = data[i]["name"] 
        r = r.replace(".json", "")
        r = r.replace("_", " ")
        data[i]["Number of Questions"] = data[i]["number_of_questions"]
        del data[i]["number_of_questions"]
        data[i]["name"] = r
    print("returning: ",data)
    return {
        "data" : data,
        "ids" : ids
    }

def get_info_from_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT name, exam_type FROM tests WHERE id = {int(id)}")
    row = cursor.fetchone()
    print(f"row: {row['name']}, {row['exam_type']}")
    conn.close()
    return row["name"], row["exam_type"]

def get_data_from_storage(id):
    name, exam_type = get_info_from_id(id)
    print(f"retrieving data for {name} in {exam_type}")
    file_to_find = f"../exams/{exam_type}/tests/{name}"
    if not os.path.exists(file_to_find):
        print("file not found")
        return None
    

    with open(file_to_find, "r") as file:
        file_data = json.load(file)
    print("found: ",file_data)
    
    return file_data
    
def encrypt(pw):
    pw_bytes = pw.encode('utf-8')
    salt = bcrypt.gensalt()
    bcrypt_hash = bcrypt.hashpw(pw_bytes, salt)
    return bcrypt_hash.decode('utf-8')

def get_user_data(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM attempts WHERE username = '{username}'")
    rows = cursor.fetchall()
    return {
        "name":username,
        "history":rows
    }

@app.get("/add_attempt/{username}/{exam_id}/{score}")
def add_attempt(username: str, exam_id: int, score: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"INSERT INTO attempts (username, exam_id, score) VALUES ('{username}', {exam_id}, {score})")
    conn.commit()
    conn.close()
    return {"status": "Attempt added"}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Example: Verify password using bcrypt
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

@app.post("/validate/{username}/{password}/{status}")
def validate(username: str, password: str, status: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if status == "login":
            cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
            row = cursor.fetchone()
            if row and verify_password(password, row[0]):
                return {"status": "Valid user", "userData": get_user_data(username)}
            else:
                raise HTTPException(status_code=401, detail="Invalid username or password")

        elif status == "signup":
            cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="User already exists")
            hashed_password = encrypt(password)
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
                          (username, hashed_password))
            conn.commit()
            return {"status": "User created"}

        elif status == "delete":
            cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
            row = cursor.fetchone()
            if row and verify_password(password, row[0]):
                cursor.execute("DELETE FROM users WHERE username = ?", (username,))
                conn.commit()
                return {"status": "User deleted"}
            else:
                raise HTTPException(status_code=401, detail="Invalid username or password")

        else:
            raise HTTPException(status_code=400, detail="Invalid status")

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
        
@app.get("/get_test_data/{id}/")
def get_test_data(id: int):
    json_data = get_data_from_storage(id)
    exam_name, exam_type = get_info_from_id(id)
    info = {
        "name": exam_name,
        "exam_type": exam_type
    }
    ret = {
        "info": info,
        "data": json_data   
    }
    return ret


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
