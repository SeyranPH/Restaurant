export default function() {
    const {
        DATABASE_HOST: host, 
        DATABASE_PORT: port,
        DATABASE_USERNAME: username, 
        DATABASE_PASSWORD: password
    } = process.env;
    const databaseUrl = username && password ? `mongodb://${username}:${password}@${host}:${port}` : `mongodb://${host}:${port}`;
    
    return {
        database: {
            url: databaseUrl,
        }
    }
}