import express from 'express';
import request from 'request';

import { Report } from './models/csv/Report';
import { advertisersController, campaignsController, reportsController } from './controllers/data';
import { Advertiser } from './models/csv/Advertiser';
import { AdvertisersCampaign } from './models/response/AdvertisersCampaign';
import { round } from 'lodash';
import { Campaign } from './models/csv/Campaign';
import { AdvertisersCampaignsReport } from './models/response/AdvertisersCampaignsReport';

const ip = '127.0.0.1';
const app = express();
const port = process.env.PORT || 3000;
export const api_url = 'http://' + ip + ':' + port;
app.get('/data/advertisers', advertisersController);
app.get('/data/campaigns', campaignsController);
app.get('/data/reports', reportsController);

app.get('/advertisers_campaigns', (req, res) => {
    request.get({ url: api_url + '/data/reports', json: true }, (e, r, reports: Report[]) => {
        request.get({ url: api_url + '/data/advertisers', json: true }, (er, rs, advertisers: Advertiser[]) => {
            const advertisersCampaigns = advertisers.map((advertiser) => {
                const advertisersCampaign = {
                    name: advertiser.name,
                    number_of_campaigns: 0,
                    cost: 0,
                } as AdvertisersCampaign;
                reports
                    .filter(report => report.advertiser_id == advertiser.id)
                    .forEach((report) => {
                        advertisersCampaign.advertiser_id = report.advertiser_id;
                        advertisersCampaign.number_of_campaigns++;
                        advertisersCampaign.cost += report.cost;
                        advertisersCampaign.cost = round(advertisersCampaign.cost, 2);
                    })

                return advertisersCampaign;
            })
            res.send(advertisersCampaigns);
        })
    })
})

app.get('/advertisers_campaigns_reports', (req, res) => {
    request.get({ url: api_url + '/data/reports', json: true }, (e, r, reports: Report[]) => {
        request.get({ url: api_url + '/data/campaigns', json: true }, (er, rs, campaigns: Campaign[]) => {
            const advertisersCampaignsReports = campaigns.map((campaign) => {
                const advertisersCampaignsReport: AdvertisersCampaignsReport = {
                    advertiser_id: campaign.advertiser_id,
                    advertiser_name: campaign.advertiser_name,
                    campaign_id: campaign.id,
                    campaign_name: campaign.name,
                    cost: 0,
                };
                reports
                    .filter(report => report.campaign_id === campaign.id)
                    .forEach((report) => {
                        advertisersCampaignsReport.cost += report.cost;
                        advertisersCampaignsReport.cost = round(advertisersCampaignsReport.cost, 2);
                    })

                return advertisersCampaignsReport
            })

            res.send(advertisersCampaignsReports);
        })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));