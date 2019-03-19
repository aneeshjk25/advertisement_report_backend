"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const request_1 = __importDefault(require("request"));
const data_1 = require("./controllers/data");
const lodash_1 = require("lodash");
const ip = '127.0.0.1';
const app = express_1.default();
const port = process.env.PORT || 3000;
exports.api_url = 'http://' + ip + ':' + port;
app.get('/data/advertisers', data_1.advertisersController);
app.get('/data/campaigns', data_1.campaignsController);
app.get('/data/reports', data_1.reportsController);
app.get('/advertisers_campaigns', (req, res) => {
    request_1.default.get({ url: exports.api_url + '/data/reports', json: true }, (e, r, reports) => {
        request_1.default.get({ url: exports.api_url + '/data/advertisers', json: true }, (er, rs, advertisers) => {
            const advertisersCampaigns = advertisers.map((advertiser) => {
                const advertisersCampaign = {
                    name: advertiser.name,
                    number_of_campaigns: 0,
                    cost: 0,
                };
                reports
                    .filter(report => report.advertiser_id == advertiser.id)
                    .forEach((report) => {
                    advertisersCampaign.advertiser_id = report.advertiser_id;
                    advertisersCampaign.number_of_campaigns++;
                    advertisersCampaign.cost += report.cost;
                    advertisersCampaign.cost = lodash_1.round(advertisersCampaign.cost, 2);
                });
                return advertisersCampaign;
            });
            res.send(advertisersCampaigns);
        });
    });
});
app.get('/advertisers_campaigns_reports', (req, res) => {
    request_1.default.get({ url: exports.api_url + '/data/reports', json: true }, (e, r, reports) => {
        request_1.default.get({ url: exports.api_url + '/data/campaigns', json: true }, (er, rs, campaigns) => {
            const advertisersCampaignsReports = campaigns.map((campaign) => {
                const advertisersCampaignsReport = {
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
                    advertisersCampaignsReport.cost = lodash_1.round(advertisersCampaignsReport.cost, 2);
                });
                return advertisersCampaignsReport;
            });
            res.send(advertisersCampaignsReports);
        });
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
