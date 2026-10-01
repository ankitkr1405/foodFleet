import sqlite3
from fastapi import FastAPI, Query

app = FastAPI()

# Create an in-memory SQLite database (data is lost on restart)
conn = sqlite3.connect(":memory:", check_same_thread=False)
cursor = conn.cursor()

# Create a sample table
cursor.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)")
conn.commit()

@app.get("/query")
def execute_query(q: str = Query(..., description="SQL query to execute")):
    try:
        cursor.execute(q)
        result = cursor.fetchall()
        conn.commit()
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
