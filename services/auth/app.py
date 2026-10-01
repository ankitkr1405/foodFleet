from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import hashlib

app = FastAPI()
SQL_API = "http://sqlt-container:8000/query"
QUERY_LOG = "db_queries.sql"

class AuthRequest(BaseModel):
    username: str
    password: str

def run_query(query: str):
    with open(QUERY_LOG, "a") as f:
        f.write(query.strip() + "\n")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def execute_sql(query: str):
    run_query(query)
    response = requests.get(SQL_API, params={"q": query})
    return response.json()

@app.post("/auth/admin")
def authenticate_admin(req: AuthRequest):
    hashed = hash_password(req.password)
    q = f"SELECT * FROM admin WHERE username='{req.username}' AND password='{hashed}';"
    result = execute_sql(q)
    print(result)
    return result.get("data") != []

@app.post("/auth/customer")
def authenticate_customer(req: AuthRequest):
    hashed = hash_password(req.password)
    q = f"SELECT * FROM customer WHERE username='{req.username}' AND password='{hashed}';"
    result = execute_sql(q)
    return result.get("data") != []
