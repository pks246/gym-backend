import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class InitialUsersTable20260414003000 implements MigrationInterface {
  name = 'InitialUsersTable20260414003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsersTable = await queryRunner.hasTable('users');

    if (!hasUsersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '120',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
              isNullable: false,
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
              isNullable: false,
            },
          ],
        }),
      );

      return;
    }

    const hasLegacyCreatedAt = await queryRunner.hasColumn(
      'users',
      'createdat',
    );
    const hasLegacyUpdatedAt = await queryRunner.hasColumn(
      'users',
      'updatedat',
    );
    const hasCreatedAt = await queryRunner.hasColumn('users', 'created_at');
    const hasUpdatedAt = await queryRunner.hasColumn('users', 'updated_at');

    if (hasLegacyCreatedAt && !hasCreatedAt) {
      await queryRunner.renameColumn('users', 'createdat', 'created_at');
    }

    if (hasLegacyUpdatedAt && !hasUpdatedAt) {
      await queryRunner.renameColumn('users', 'updatedat', 'updated_at');
    }

    if (!(await queryRunner.hasColumn('users', 'created_at'))) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
          isNullable: false,
        }),
      );
    }

    if (!(await queryRunner.hasColumn('users', 'updated_at'))) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasUsersTable = await queryRunner.hasTable('users');

    if (hasUsersTable) {
      await queryRunner.dropTable('users');
    }
  }
}
