export interface Report {
    advertiser_id: number;
    campaign_id: number;
    advertiser_name: string;
    campaign_name: string;
    date: string;
    impressions: number;
    clicks: number;
    installs: number;
    cost: number;
    cost_micros: number;
}
