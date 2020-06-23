export declare function createNewCheckTypes(matcherName: string, type: string): (this: jest.MatcherContext, received: number) => {
    pass: boolean;
    message: () => string;
};
