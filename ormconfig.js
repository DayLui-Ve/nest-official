module.exports = {
    type: 'postgres', // type of our database
    host: 'localhost', // database host
    port: 5432, // database host
    username: 'postgres', // username
    password: '123456', // user password
    database: 'nestdb', // name of our database,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
        migrationsDir: 'src/migrations',
    },
}