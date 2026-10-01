CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    customer_name TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    item_id INTEGER
);

-- Optional sample order
INSERT INTO orders (restaurant_id, customer_name) VALUES (1, 'John Doe');
INSERT INTO order_items (order_id, item_id) VALUES (1, 1);
