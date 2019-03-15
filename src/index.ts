import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import request from 'request';
const ip = '127.0.0.1';
const app = express();
const port = 3000;
const api_url = 'http://' + ip + ':' + port;

interface Advertiser {
    id: number,
    name: string
}
interface Campaign {
    id: number,
    advertiser_id: number,
    name: string,
    cost_model: 'per_impression' | 'per_click'| 'per_install',
    cost: string
}
interface AdvertisersCampaigns {
    name: string,
    cost: number,
    number_of_campaigns: number
}

app.get('/advertisers', (req, res) =>{
    const results: Advertiser[] = [];
    fs.createReadStream(__dirname + '/../data/advertisers.csv')
    .pipe(csv())
    .on('data', function(data: Advertiser){
        results.push(data);
    })
    .on('end',function(){
        res.json(results);
    });  
})

app.get('/advertisers_campaigns', (req, res) => {
    request({ url : api_url + '/advertisers', json: true}, (error, r, advertisers: Advertiser[]) =>  {
        const campaigns: Campaign[] = [];
        fs.createReadStream(__dirname + '/../data/campaigns.csv')
        .pipe(csv())
        .on('data', function(data: Campaign){
            campaigns.push(data);
        })
        .on('end',function(){
            const advertisementCampaigns = advertisers.map((advertiser) => {
                const advertisementCampaign:AdvertisersCampaigns = {
                    name : advertiser.name,
                    cost: 0,
                    number_of_campaigns: 0
                };

                campaigns
                    .filter(campaign => campaign.advertiser_id === advertiser.id)
                    .reduce((aC, campaign) => {
                        aC.cost += parseFloat(campaign.cost);
                        aC.number_of_campaigns++;
                        
                        return aC;
                    }, advertisementCampaign)

                return advertisementCampaign;
            })
            res.send(advertisementCampaigns);
        });  
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));