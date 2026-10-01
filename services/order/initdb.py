import requests
import os
import time
SQLT_API = "http://sqlt-container:8000/query"
QUERY_LOG = "db_queries.sql"

q = "CREATE TABLE IF NOT EXISTS example (id INTEGER PRIMARY KEY AUTOINCREMENT);"

for i in range(50):  
    try:
        res = requests.get(SQLT_API, params={"q": q})
        if res.status_code == 200:
            print("Database is ready.")
            break
    except requests.exceptions.ConnectionError:
        print("SQLT not ready, retrying...")
        time.sleep(2)
else:
    print("SQLT still not available after retries.")


if not os.path.exists(QUERY_LOG):
    print("Query log file not found.")
    exit()

with open(QUERY_LOG) as f:
    queries = f.read().split(";")

for query in queries:
    q = query.strip()
    if q:
        res = requests.get(SQLT_API, params={"q": q})
        print(f"Executed: {q[:40]}... => {res.json()}")
