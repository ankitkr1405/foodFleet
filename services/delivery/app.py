from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os

QUERY_LOG = "db_queries.sql"
app = FastAPI()
SQLT_API = "http://sqlt-container:8000/query"

class DeliveryRequest(BaseModel):
    order_id: int
    delivery_agent: str

class StatusUpdate(BaseModel):
    status: str


def run_query(query: str):
    with open(QUERY_LOG, "a") as f:
        f.write(query.strip() + "\n")

@app.post("/delivery")
def assign_delivery(req: DeliveryRequest):
    query = f"""
        INSERT INTO deliveries (order_id, delivery_agent) VALUES ({req.order_id}, '{req.delivery_agent}');
    """
    run_query(query)
    res = requests.get(SQLT_API, params={"q": query})
    return {"message": "Delivery assigned", "result": res.json()}

@app.get("/delivery/{order_id}")
def get_delivery_info(order_id: int):
    query = f"SELECT * FROM deliveries WHERE order_id = {order_id};"
    res = requests.get(SQLT_API, params={"q": query})
    return res.json()

@app.put("/delivery/{order_id}")
def update_delivery_status(order_id: int, status: StatusUpdate):
    query = f"""
        UPDATE deliveries
        SET status = '{status.status}'
        WHERE order_id = {order_id};
    """
    run_query(query)
    res = requests.get(SQLT_API, params={"q": query})
    return {"message": "Status updated", "result": res.json()}

@app.delete("/delivery/{order_id}")
def cancel_delivery(order_id: int):
    query = f"DELETE FROM deliveries WHERE order_id = {order_id};"
    run_query(query)
    res = requests.get(SQLT_API, params={"q": query})
    return {"message": "Delivery canceled", "result": res.json()}
