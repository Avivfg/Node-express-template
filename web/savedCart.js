// read and write saved carts to DB.

export function importSavedCart(customerId) {
	const mysql = require('mysql');

	const db = mysql.createConnection({
		host: '127.0.0.1',
		user: 'root',
		password: 'Gorunks8*',
		database: 'boa',
	});
	db.connect((err) => {
		if (err) {
			console.error('Database connection error:', err.stack);
			return;
		}
		console.log('Connected to the database');
	});

	var productVariantIds;
	const sqlQuery = 'SELECT product_variant_id FROM boa.saved_carts WHERE customer_id = ?';
	db.query(sqlQuery, [customerId], (err, results) => {
		if (err) {
			console.error('Error retrieving data:', err);
		} else {
			if (results.length > 0) {
				const productVariantIdsJSON = results[0].related_ids;
				productVariantIds = JSON.parse(productVariantIdsJSON);
				console.log('JSON data for customer_id', customerId, ':', related_ids);
			} else {
				console.log('No data found for customer_id', customerId);
			}
		}
		db.end();
	});

	let updates = {};
	for (var productVariantId of productVariantIds) {
		updates[productVariantId] = 1;
	}

	fetch(window.Shopify.routes.root + 'cart/update.js', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ updates }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

export function saveCart(customerId, cartLines) {
	const mysql = require('mysql');

	const db = mysql.createConnection({
		host: '127.0.0.1',
		user: 'root',
		password: 'Gorunks8*',
		database: 'boa',
	});
	db.connect((err) => {
		if (err) {
			console.error('Database connection error:', err.stack);
			return;
		}
		console.log('Connected to the database');
	});

	let productVariantIds = [];
	for (var cartLine of cartLines) {
		productVariantIds.push(cartLine.merchandise?.id);
	}
	const productVariantIdsJSON = JSON.stringify(related_ids);
	const sqlQuery = 'INSERT INTO boa.saved_carts (customer_id, product_variant_id) VALUES (?, ?)';
	db.query(sqlQuery, [customerId, productVariantIdsJSON], (err, result) => {
		if (err) {
			console.error('Error inserting data:', err);
		} else {
			console.log('Data inserted successfully');
		}
		db.end();
	});
}
