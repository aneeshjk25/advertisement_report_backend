export interface Campaign {
    id: number;
    advertiser_id: number;
    name: string;
    advertiser_name: string;
    start_date: string,
    end_date: string,
    cost_model: 'per_impression' | 'per_click' | 'per_install';
    cost: number;
}
