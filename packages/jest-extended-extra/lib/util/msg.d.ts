export declare function passMessage(received: any, matcherName: string, type: string): () => string;
export declare function failMessage(received: any, matcherName: string, type: string): () => string;
export declare function autoMessage(pass: boolean, received: any, matcherName: string, type: string): () => string;
