export interface ServiceFeature {
    label: string;
}

export interface ServiceStat {
    label: string;
    val: string;
}

export interface ServiceProcessStep {
    title: string;
    description: string;
}

export interface ServiceSection {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string; // Phase F2
}

export interface ServiceProcessSection {
    title: string;
    steps: ServiceProcessStep[];
}

export interface ServiceDetailsSection {
    title: string;
    description: string;
    imageAlt?: string;
}

export interface ServiceBuyNowSection {
    title: string;
    description: string;
    button: string;
    price?: string;
    unit?: string;
}
