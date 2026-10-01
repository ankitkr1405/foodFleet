from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI()
SQLT_API = "http://sqlt-container:8000/query"
QUERY_LOG = "db_queries.sql"
class OrderRequest(BaseModel):
    restaurant_id: int
    customer_name: str
    item_ids: list[int]

def run_query(query: str):
    with open(QUERY_LOG, "a") as f:
        f.write(query.strip() + "\n")


@app.post("/order")
def place_order(order: OrderRequest):
    create_order = f"""
        INSERT INTO orders (restaurant_id, customer_name)
        VALUES ({order.restaurant_id}, '{order.customer_name}');
    """
    # Insert order
    run_query(create_order)
    res = requests.get(SQLT_API, params={"q": create_order})
    get_id_query = "SELECT id FROM orders ORDER BY id DESC LIMIT 1;"
    res1 = requests.get(SQLT_API, params={"q": get_id_query})
    order_id = res1.json().get("data", [[None]])[0][0]
    if not order_id:
        raise HTTPException(status_code=500, detail="Order not created")

    # Insert order items
    for item_id in order.item_ids:
        q = f"INSERT INTO order_items (order_id, item_id) VALUES ({order_id}, {item_id});"
        run_query(q)
        r=requests.get(SQLT_API, params={"q": q})

    return {"message": "Order placed", "order_id": order_id}

@app.get("/orders")
def get_all_orders():
    query = "SELECT * FROM orders;"
    res = requests.get(SQLT_API, params={"q": query})
    return res.json()

@app.get("/order/{order_id}")
def get_order_details(order_id: int):
    order_q = f"SELECT * FROM orders WHERE id = {order_id};"
    items_q = f"SELECT * FROM order_items WHERE order_id = {order_id};"
    order = requests.get(SQLT_API, params={"q": order_q}).json()
    items = requests.get(SQLT_API, params={"q": items_q}).json()
    return {"order": order.get("data"), "items": items.get("data")}

@app.delete("/order/{order_id}")
def cancel_order(order_id: int):
    del_items = f"DELETE FROM order_items WHERE order_id = {order_id};"
    del_order = f"DELETE FROM orders WHERE id = {order_id};"
    run_query(del_items)
    run_query(del_order)
    d = requests.get(SQLT_API, params={"q": del_items})
    res = requests.get(SQLT_API, params={"q": del_order})
    return {"message": "Order canceled", "result": res.json()}
