CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    category TEXT
);

CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    name TEXT,
    price REAL,
    description TEXT
);

-- Sample restaurants
INSERT INTO restaurants (name, address,category) VALUES ('Pizza Palace', '123 Main St','Italian');
INSERT INTO restaurants (name, address,category) VALUES ('Sushi Station', '456 Ocean Ave','Japanese');

-- Sample menu items
INSERT INTO menu_items (restaurant_id, name, price,description) VALUES (1, 'Margherita Pizza', 9.99,'Large');
INSERT INTO menu_items (restaurant_id, name, price,description) VALUES (1, 'Pepperoni Pizza', 12.49,'XLarge');
INSERT INTO menu_items (restaurant_id, name, price,description) VALUES (2, 'California Roll', 8.50,'Very Tasty');
INSERT INTO menu_items (restaurant_id, name, price,description) VALUES (2, 'Spicy Tuna Roll', 10.00,'NonVeg');
