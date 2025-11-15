declare global {
    interface Categorie {
        color: string;
        description: string | null;
        postCount: number;
        icon: string;
        id: number;
        isHidden: boolean;
        name: string;
        parentId: number;
        slug: string;
        children?: Categorie[];
        isHot?: boolean;
        isRecommended?: boolean;
        todayPostCount?: number;
        activeUsers?: number;
    }
}
export {};
