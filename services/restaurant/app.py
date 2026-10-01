from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI()
SQLT_API = "http://sqlt-container:8000/query"
QUERY_LOG = "db_queries.sql"
class Restaurant(BaseModel):
    name: str
    address: str
    category: str

class MenuItem(BaseModel):
    restaurant_id: int
    name: str
    price: float
    description: str = ""

def run_query(query: str):
    with open(QUERY_LOG, "a") as f:
        f.write(query.strip() + "\n")


@app.post("/restaurant")
def add_restaurant(data: Restaurant):
    query = f"""
        INSERT INTO restaurants (name, address, category)
        VALUES ('{data.name}', '{data.address}', '{data.category}');
    """
    run_query(query)
    res = requests.get(SQLT_API, params={"q": query})
    return res.json()

@app.post("/menu")
def add_menu_item(item: MenuItem):
    query = f"""
        INSERT INTO menu_items (restaurant_id, name, price, description)
        VALUES ({item.restaurant_id}, '{item.name}', {item.price}, '{item.description}');
    """
    run_query(query)
    res = requests.get(SQLT_API, params={"q": query})
    return res.json()

@app.delete("/menu/{item_id}")
def delete_menu_item(item_id: int):
    query = f"DELETE FROM menu_items WHERE id = {item_id};"
    run_query(query)
    res = requests.get(SQLT_API, params={"q": query})
    return res.json()

@app.get("/restaurants")
def get_all_restaurants():
    query = "SELECT * FROM restaurants;"
    res = requests.get(SQLT_API, params={"q": query})
    return res.json()

@app.get("/menu/{restaurant_id}")
def get_menu(restaurant_id: int):
    query = f"SELECT * FROM menu_items WHERE restaurant_id = {restaurant_id};"
    res = requests.get(SQLT_API, params={"q": query})
    return res.json()
