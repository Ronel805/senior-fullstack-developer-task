import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserStatusEnum1680000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD COLUMN new_status TEXT DEFAULT 'Enabled'`);
        await queryRunner.query(`
            UPDATE users SET new_status = CASE status
                WHEN 1 THEN 'Enabled'
                ELSE 'Disabled'
            END
        `);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN status`);
        await queryRunner.query(`ALTER TABLE users RENAME COLUMN new_status TO status`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD COLUMN old_status INTEGER DEFAULT 1`);
        await queryRunner.query(`
            UPDATE users SET old_status = CASE status
                WHEN 'Enabled' THEN 1
                ELSE 0
            END
        `);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN status`);
        await queryRunner.query(`ALTER TABLE users RENAME COLUMN old_status TO status`);
    }
}
