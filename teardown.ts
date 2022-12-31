import { AppDataSource } from './src/external/db/typeorm/db/jest-pg-data-source'

const teardown = async () => {
    console.log('Clear all database....')
    const connection = await AppDataSource.initialize()
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
        const repository = connection.getRepository(entity.name); 
        await repository.delete({}); 
    }
    connection.destroy()
}

module.exports = teardown;