export declare class MoveMindCLI {
    private sdk;
    private program;
    constructor();
    init(): Promise<void>;
    private setupCommands;
    run(argv: string[]): Promise<void>;
    private discoverCommand;
    private predictCommand;
    private optimizeCommand;
    private monitorCommand;
    private analyzeCommand;
    private demoCommand;
    private runQuickDemo;
    private runFullDemo;
    private loadConfig;
}
export declare function runCLI(): Promise<void>;
