const functions = require('firebase-functions');
const admin = require('firebase-admin');
const AmazonPaapi = require('amazon-paapi');

admin.initializeApp();

// Amazon PA-API Configuration
const getAmazonClient = () => {
    return AmazonPaapi.client({
        accessKey: process.env.AMAZON_ACCESS_KEY,
        secretKey: process.env.AMAZON_SECRET_KEY,
        partnerTag: process.env.AMAZON_PARTNER_TAG,
        region: process.env.AMAZON_REGION || 'IN'
    });
};

// Search Amazon products using PA-API
exports.searchAmazonProducts = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const { keywords, category } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const token = authHeader.split('Bearer ')[1];
        await admin.auth().verifyIdToken(token);

        const client = getAmazonClient();

        const requestParameters = {
            Keywords: keywords,
            SearchIndex: category || 'All',
            ItemCount: 10,
            Resources: [
                'Images.Primary.Large',
                'ItemInfo.Title',
                'ItemInfo.Features',
                'Offers.Listings.Price',
                'ItemInfo.ProductInfo'
            ]
        };

        const data = await client.searchItems(requestParameters);

        if (data.SearchResult && data.SearchResult.Items) {
            const products = data.SearchResult.Items.map(item => ({
                asin: item.ASIN,
                title: item.ItemInfo?.Title?.DisplayValue || 'No title',
                description: item.ItemInfo?.Features?.DisplayValues?.join(', ') || '',
                imageUrl: item.Images?.Primary?.Large?.URL || '',
                price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'N/A',
                detailPageURL: item.DetailPageURL || ''
            }));

            res.json({ products });
        } else {
            res.json({ products: [] });
        }
    } catch (error) {
        console.error('Amazon PA-API Error:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Get product details by ASIN
exports.getAmazonProduct = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const { asin } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const token = authHeader.split('Bearer ')[1];
        await admin.auth().verifyIdToken(token);

        const client = getAmazonClient();

        const requestParameters = {
            ItemIds: [asin],
            Resources: [
                'Images.Primary.Large',
                'ItemInfo.Title',
                'ItemInfo.Features',
                'Offers.Listings.Price',
                'ItemInfo.ProductInfo'
            ]
        };

        const data = await client.getItems(requestParameters);

        if (data.ItemsResult && data.ItemsResult.Items) {
            const item = data.ItemsResult.Items[0];
            const product = {
                asin: item.ASIN,
                title: item.ItemInfo?.Title?.DisplayValue || 'No title',
                description: item.ItemInfo?.Features?.DisplayValues?.join(', ') || '',
                imageUrl: item.Images?.Primary?.Large?.URL || '',
                price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'N/A',
                detailPageURL: item.DetailPageURL || ''
            };

            res.json({ product });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Amazon PA-API Error:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Add product to Firestore
exports.addProduct = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const { title, description, affiliateUrl, category, imageUrl, price } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const token = authHeader.split('Bearer ')[1];
        await admin.auth().verifyIdToken(token);

        const docRef = await admin.firestore().collection('products').add({
            title,
            description,
            affiliateUrl,
            category,
            imageUrl: imageUrl || '',
            price: price || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({ id: docRef.id });
    } catch (error) {
        console.error('Add Product Error:', error);
        res.status(403).send(`Unauthorized: ${error.message}`);
    }
});

// Delete product from Firestore
exports.deleteProduct = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const { id } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const token = authHeader.split('Bearer ')[1];
        await admin.auth().verifyIdToken(token);
        await admin.firestore().collection('products').doc(id).delete();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(403).send(`Unauthorized: ${error.message}`);
    }
});

// Add blog post to Firestore
exports.addBlog = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    const { title, summary, createdAt } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const token = authHeader.split('Bearer ')[1];
        await admin.auth().verifyIdToken(token);

        const docRef = await admin.firestore().collection('blogs').add({
            title,
            summary,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({ id: docRef.id });
    } catch (error) {
        console.error('Add Blog Error:', error);
        res.status(403).send(`Unauthorized: ${error.message}`);
    }
});