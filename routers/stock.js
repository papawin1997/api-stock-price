const express = require("express");
const router = express.Router();
const yahooFinance = require('yahoo-finance');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 30 , checkperiod: 30 });

router.get('/',(req,res)=>{
    res.send("hello stock price by yahoo-finance")
})

router.get('/price/:query', async (req, res) => {
    const query = req.params.query;
    if(!query) return res.status(404).json({ error: 'Invalid parameter' });

    const symbol = query.toUpperCase();
    
    const cachedData = cache.get(symbol);
    if (cachedData) {
      return res.json({ result: cachedData.result, source: 'cache' });
    }
  
    try {
      const data = await yahooFinance.quote({ symbol });
      if(!data) return res.status(404).json({ error: 'symbol not found' });
 
      const price = data?.price;
      if (price) {
        const result = {
            symbol : symbol,
            currency: data?.price?.currency,
            price : data?.price?.regularMarketPrice,
        }
        cache.set(symbol, { result });
        return res.json({ result, source:'new value form yahoo-finance'});
      }
    } 
    catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;