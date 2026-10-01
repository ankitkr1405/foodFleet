DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS customer;

    CREATE TABLE admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    );

    CREATE TABLE customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    );

    INSERT INTO admin (username, password) VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');
    INSERT INTO customer (username, password) VALUES ('john', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');

SELECT * FROM admin WHERE username='admin' AND password='114663ab194edcb3f61d409883ce4ae6c3c2f9854194095a5385011d15becbef';
SELECT * FROM admin WHERE username='admin' AND password='473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8';
SELECT * FROM admin WHERE username='admin' AND password='240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
SELECT * FROM customer WHERE username='john' AND password='5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
SELECT * FROM customer WHERE username='john' AND password='ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
