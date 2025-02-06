declare namespace NodeJS {
    interface ProcessEnv{
        PORT: number;
        JWT_SECRET: string;
        DB_USER:string;
        DB_HOST:string;
        DB_NAME:string;
        DB_PASSWORD:string;
        DB_PORT:number
    }
}