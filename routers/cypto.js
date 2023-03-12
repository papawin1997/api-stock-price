const express = require("express");
const router = express.Router();

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 30 , checkperiod: 30 });

router.get('/',(req,res)=>{
    res.send("hello api cypto price")
})

router.get('/list/:query', async (req, res) => {
    const query = req.params.query;
    if(!query) return res.status(404).json({ error: 'Invalid parameter' });

    const symbol = query.toUpperCase();
    const urlSearch = `https://api.coingecko.com/api/v3/search?query=${symbol}`;
    const responesSearch = await fetch(urlSearch);
    const dataSearch = await responesSearch.json();

    res.send(dataSearch);
});


router.get('/price/:query', async (req, res) => {
    const query = req.params.query;
    if(!query) return res.status(404).json({ error: 'Invalid parameter' });

    const symbol = query.toUpperCase();
    const cachedData = cache.get(symbol);
    if (cachedData) {
      return res.json({ result: cachedData.result, source: 'cache' });
    }

    const urlSearch = `https://api.coingecko.com/api/v3/search?query=${symbol}`;

    const responesSearch = await fetch(urlSearch);
    const dataSearch = await responesSearch.json();
    const resultSearch = dataSearch?.coins.filter(x=>x.symbol == symbol)
    if(resultSearch.length == 0)  return res.status(404).json({ error: 'Symbol not found' });
  
    const urlCoin = `https://api.coingecko.com/api/v3/coins/${resultSearch[0]?.id}?query=${symbol}`;
    const responesCoin = await fetch(urlCoin);
    const dataCoin = await responesCoin.json();
    const result = {
      symbol : symbol,
      currency: "USD",
      price: dataCoin?.market_data?.current_price?.usd || undefined
    }
    cache.set(symbol, { result });
     return res.json({ result, source:'api'});
});

module.exports = router;