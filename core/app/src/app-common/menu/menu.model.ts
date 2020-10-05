export interface RecentRecordsMenuItem {
    summary: string;
    url: string;
}

export interface MenuItemLink {
    label: string;
    url: string;
    route?: string;
    params?: { [key: string]: string };
}

export interface MenuItem {
    link: MenuItemLink;
    icon: string;
    submenu: MenuItem[];
    recentRecords?: RecentRecordsMenuItem[];
}
