// Base URL for API calls via the gateway is the current host (e.g., http://localhost:8080)
const apiBase = '';

// -------------------------
// Utility: API Caller
// -------------------------
async function callApi(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: 'Non-JSON response', raw: text };
    }
  } catch (err) {
    console.error("API call error:", err);
    return { error: err.message };
  }
}

// -------------------------
// Authentication Functions
// -------------------------

// Admin Authentication
document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  const payload = { username, password };
  const result = await callApi(apiBase + '/auth/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  document.getElementById('adminLoginResult').textContent = JSON.stringify(result, null, 2);
});

// Customer Authentication
document.getElementById('customerLoginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('customerUsername').value;
  const password = document.getElementById('customerPassword').value;
  const payload = { username, password };
  const result = await callApi(apiBase + '/auth/customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  document.getElementById('customerLoginResult').textContent = JSON.stringify(result, null, 2);
});

// -------------------------
// Admin Functions
// -------------------------

// Add a restaurant
document.getElementById('addRestaurantForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('rName').value;
  const address = document.getElementById('rAddress').value;
  const category = document.getElementById('rCat').value;
  const payload = { name, address, category };
  const result = await callApi(apiBase + '/api/restaurants/restaurant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  document.getElementById('restaurantResult').textContent = JSON.stringify(result, null, 2);
});

// Add a menu item
document.getElementById('addMenuForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const restaurant_id = parseInt(document.getElementById('menuRestaurantId').value);
  const name = document.getElementById('menuName').value;
  const price = parseFloat(document.getElementById('menuPrice').value);
  const desc = document.getElementById('menuDesc').value;
  const payload = { restaurant_id, name, price, desc };
  const result = await callApi(apiBase + '/api/restaurants/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  document.getElementById('menuResult').textContent = JSON.stringify(result, null, 2);
});

// Update delivery status
document.getElementById('updateDeliveryForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const order_id = parseInt(document.getElementById('updOrderId').value);
  const status = document.getElementById('newStatus').value;
  const payload = { status };
  const result = await callApi(apiBase + '/api/delivery/delivery/' + order_id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  document.getElementById('deliveryUpdateResult').textContent = JSON.stringify(result, null, 2);
});

// Cancel order (admin)
document.getElementById('cancelOrderForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const order_id = parseInt(document.getElementById('cancelOrderId').value);
  const result = await callApi(apiBase + '/api/orders/order/' + order_id, {
    method: 'DELETE'
  });
  document.getElementById('orderCancelResult').textContent = JSON.stringify(result, null, 2);
});

// -------------------------
// Customer Functions
// -------------------------

// View restaurants (customer)
async function getRestaurants() {
  const result = await callApi(apiBase + '/api/restaurants/restaurants');
  document.getElementById('restaurantsOutput') &&
    (document.getElementById('restaurantsOutput').textContent = JSON.stringify(result, null, 2));
}

// View menu for a restaurant (customer)
document.getElementById('viewMenuForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const restaurant_id = parseInt(document.getElementById('menuRestaurantId').value);
  const result = await callApi(apiBase + '/api/restaurants/menu/' + restaurant_id);
  document.getElementById('menuOutput').textContent = JSON.stringify(result, null, 2);
});

// Place an order (customer)
document.getElementById('placeOrderForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const restaurant_id = parseInt(document.getElementById('orderRestaurantId').value);
  const customer_name = document.getElementById('customerName').value;
  const item_ids = document.getElementById('orderItemIds').value.split(',').map(id => parseInt(id.trim()));
  const payload = { restaurant_id, customer_name, item_ids };
  const result = await callApi(apiBase + '/api/orders/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  document.getElementById('orderResult').textContent = JSON.stringify(result, null, 2);
});

// Cancel order (customer)
document.getElementById('cancelOrderForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const order_id = parseInt(document.getElementById('cancelOrderId').value);
  const result = await callApi(apiBase + '/api/orders/order/' + order_id, {
    method: 'DELETE'
  });
  document.getElementById('orderCancelResult').textContent = JSON.stringify(result, null, 2);
});

// Generic function for viewing data (used by admin and customer buttons)
async function getData(type) {
  let endpoint = '';
  if (type === 'restaurants') {
    endpoint = apiBase + '/api/restaurants/restaurants';
  } else if (type === 'orders') {
    endpoint = apiBase + '/api/orders/orders';
  } else if (type === 'deliveries') {
    endpoint = apiBase + '/api/delivery/delivery/1'; // Example endpoint
  }
  const result = await callApi(endpoint);
  document.getElementById('viewDataResult') &&
    (document.getElementById('viewDataResult').textContent = JSON.stringify(result, null, 2));
  if (document.getElementById('ordersOutput')) {
    document.getElementById('ordersOutput').textContent = JSON.stringify(result, null, 2);
  }
}
