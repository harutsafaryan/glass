export interface CheckProp {
    check: {
        id: string;
        name : string;
        state : string,
        status: string;
        value: number | null;
        text: string | null;
        comment: string | null;
        createdAt: string;
        scheduledAt : string | null,
        year: number;
        month: number;
        day: number;
        todo: {
            title: string;
        };
        user: {
            name: string;
        };
    };
}
export interface ChecksProp {
    checks: {
        id: string;
        name : string;
        state : string,
        status: string;
        value: number | null;
        text: string | null;
        comment: string | null;
        createdAt: string;
        scheduledAt : string | null,
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
