import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1617135235273 implements MigrationInterface {
    name = 'SchemaSync1617135235273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
    }

}
