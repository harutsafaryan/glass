export interface CheckProp {
    checks: {
        id: string;
        status: string;
        value: number | null;
        text: string | null;
        comment: string | null;
        createdAt: string;
        year: number;
        month: number;
        day: number;
        todo: {
            title: string;
        };
        user: {
            name: string;
        };
    }[];
}
