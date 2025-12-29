import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserRolesAndStatus1700000000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "roles" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "new_status" text`);

    await queryRunner.query(`
      UPDATE "users"
      SET roles = json('["' || roles || '"]')
    `);

    await queryRunner.query(`
      UPDATE "users"
      SET new_status = CASE
        WHEN status = 1 THEN 'Enabled'
        ELSE 'Disabled'
      END
    `);

    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);

    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "new_status" TO "status"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
