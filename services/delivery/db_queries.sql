CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    delivery_agent TEXT,
    status TEXT
);

-- Optional sample delivery
INSERT INTO deliveries (order_id, delivery_agent, status) VALUES (1, 'Agent Smith', 'assigned');

INSERT INTO deliveries (order_id, delivery_agent) VALUES (1, 'Rider007');
