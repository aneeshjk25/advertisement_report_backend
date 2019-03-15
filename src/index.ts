import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
const app = express();
const port = 3000;

interface Advertiser {
    id: number,
    name: string
}
app.get('/advertisers', (req, res, next) =>{
    const csv = require('csv-parser');
    const results: Advertiser[] = [];
    fs.createReadStream(__dirname + '/../data/advertisers.csv')
    .pipe(csv())
    .on('data', function(data: Advertiser){
        results.push(data);
    })
    .on('end',function(data: {}){
        res.json(results);
    });  
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));