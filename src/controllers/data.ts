import { Advertiser } from "../models/csv/Advertiser";
import fs from 'fs';
import csv from 'csv-parser';
import { Response, Request } from "express-serve-static-core";
import request = require("request");
import { api_url } from "..";
import { Campaign } from "../models/csv/Campaign";
import { Report } from "../models/csv/Report";

export function advertisersController(req: Request, res: Response) {
    const results: Advertiser[] = [];
    fs.createReadStream(__dirname + '/../../data/advertisers.csv')
        .pipe(csv())
        .on('data', function (data: Advertiser) {
            results.push(data);
        })
        .on('end', function () {
            res.json(results);
        });
}

export function campaignsController(req: Request, res: Response) {
    const campaigns: Campaign[] = [];
    request({ url: api_url + '/data/advertisers', json: true }, (e, r, advertisers: Advertiser[]) => {
        fs.createReadStream(__dirname + '/../../data/campaigns.csv')
            .pipe(csv())
            .on('data', function (data: Campaign) {
                data.cost = parseFloat(data.cost as never as string);
                campaigns.push(data);
            })
            .on('end', function () {
                campaigns.forEach((campaign) => {
                    const advertiser: Advertiser = advertisers.find((a) => {
                        return a.id === campaign.advertiser_id;
                    })!
                    campaign.advertiser_name = advertiser.name
                })

                res.json(campaigns);
            });
    })
}

export function reportsController(req: Request, res: Response) {
    const reports: Report[] = [];
    request({ url: api_url + '/data/campaigns', json: true }, (e, r, campaigns: Campaign[]) => {
        fs.createReadStream(__dirname + '/../../data/reports.csv')
            .pipe(csv())
            .on('data', function (data: Report) {
                data.cost_micros = parseInt(data.cost_micros as never as string);
                data.cost = data.cost_micros / 1000000;
                data.impressions = parseInt(data.impressions as never as string);
                data.installs = parseInt(data.installs as never as string);
                data.clicks = parseInt(data.clicks as never as string);
                reports.push(data);
            })
            .on('end', function () {
                reports.forEach((report) => {
                    const campaign = campaigns.find(c => c.id === report.campaign_id)!;
                    report.campaign_name = campaign.name
                    report.advertiser_name = campaign.advertiser_name;
                    report
                })

                res.json(reports);
            });
    })
}