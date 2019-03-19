"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const request = require("request");
const __1 = require("..");
function advertisersController(req, res) {
    const results = [];
    fs_1.default.createReadStream(__dirname + '/../../data/advertisers.csv')
        .pipe(csv_parser_1.default())
        .on('data', function (data) {
        results.push(data);
    })
        .on('end', function () {
        res.json(results);
    });
}
exports.advertisersController = advertisersController;
function campaignsController(req, res) {
    const campaigns = [];
    request({ url: __1.api_url + '/data/advertisers', json: true }, (e, r, advertisers) => {
        fs_1.default.createReadStream(__dirname + '/../../data/campaigns.csv')
            .pipe(csv_parser_1.default())
            .on('data', function (data) {
            data.cost = parseFloat(data.cost);
            campaigns.push(data);
        })
            .on('end', function () {
            campaigns.forEach((campaign) => {
                const advertiser = advertisers.find((a) => {
                    return a.id === campaign.advertiser_id;
                });
                campaign.advertiser_name = advertiser.name;
            });
            res.json(campaigns);
        });
    });
}
exports.campaignsController = campaignsController;
function reportsController(req, res) {
    const reports = [];
    request({ url: __1.api_url + '/data/campaigns', json: true }, (e, r, campaigns) => {
        fs_1.default.createReadStream(__dirname + '/../../data/reports.csv')
            .pipe(csv_parser_1.default())
            .on('data', function (data) {
            data.cost_micros = parseInt(data.cost_micros);
            data.cost = data.cost_micros / 1000000;
            data.impressions = parseInt(data.impressions);
            data.installs = parseInt(data.installs);
            data.clicks = parseInt(data.clicks);
            reports.push(data);
        })
            .on('end', function () {
            reports.forEach((report) => {
                const campaign = campaigns.find(c => c.id === report.campaign_id);
                report.campaign_name = campaign.name;
                report.advertiser_name = campaign.advertiser_name;
                report;
            });
            res.json(reports);
        });
    });
}
exports.reportsController = reportsController;
