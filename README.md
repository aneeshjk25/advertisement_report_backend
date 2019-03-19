## Backend for advertisement expense chart
 The repo contains an backend for advertimenet expense chart. It is build using nodejs and typescript

### How to get up and running

 - Run `npm install`
 - Run `npm run start` to start the server

## Routes exposed
 - `/data/advertisers` gives a list of advertisers
 - `/data/campaigns` gives a list of campaigns
 - `/data/reports` gives a list of reports
 - `/advertisers_campaigns` returns list of campaign expenses for every advertisers
 - `/advertisers_campaigns_reports`  returns a list of expenses for every campaign augmented with advertiser data

 ## Demo
 Live preview https://aneesh-advertisement-report.herokuapp.com/