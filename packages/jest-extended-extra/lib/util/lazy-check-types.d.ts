export declare function createNewCheckTypes(matcherName: string, type: string): (this: jest.MatcherContext, received: number) => {
    pass: any;
    message: () => string;
};
