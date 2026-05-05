import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class SubscriptionDomainFoundation20260503015000 implements MigrationInterface {
  name = 'SubscriptionDomainFoundation20260503015000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('subscription_plans'))) {
      await queryRunner.createTable(
        new Table({
          name: 'subscription_plans',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'gym_id', type: 'int', isNullable: false },
            {
              name: 'code',
              type: 'varchar',
              length: '50',
              isNullable: false,
              isUnique: true,
            },
            { name: 'name', type: 'varchar', length: '120', isNullable: false },
            { name: 'description', type: 'text', isNullable: true },
            { name: 'duration_days', type: 'int', isNullable: false },
            { name: 'price_cents', type: 'int', isNullable: false },
            {
              name: 'billing_interval',
              type: 'varchar',
              length: '20',
              isNullable: false,
              default: "'monthly'",
            },
            {
              name: 'is_active',
              type: 'boolean',
              isNullable: false,
              default: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              isNullable: false,
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              isNullable: false,
              default: 'now()',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'subscription_plans',
        new TableForeignKey({
          columnNames: ['gym_id'],
          referencedTableName: 'gyms',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    if (!(await queryRunner.hasTable('subscriptions'))) {
      await queryRunner.createTable(
        new Table({
          name: 'subscriptions',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'member_id', type: 'int', isNullable: false },
            { name: 'plan_id', type: 'int', isNullable: false },
            {
              name: 'status',
              type: 'varchar',
              length: '20',
              isNullable: false,
              default: "'active'",
            },
            { name: 'start_date', type: 'date', isNullable: false },
            { name: 'end_date', type: 'date', isNullable: false },
            {
              name: 'auto_renew',
              type: 'boolean',
              isNullable: false,
              default: true,
            },
            { name: 'notes', type: 'text', isNullable: true },
            {
              name: 'created_at',
              type: 'timestamp',
              isNullable: false,
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              isNullable: false,
              default: 'now()',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'subscriptions',
        new TableForeignKey({
          columnNames: ['member_id'],
          referencedTableName: 'members',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'subscriptions',
        new TableForeignKey({
          columnNames: ['plan_id'],
          referencedTableName: 'subscription_plans',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('subscriptions')) {
      await queryRunner.dropTable('subscriptions');
    }

    if (await queryRunner.hasTable('subscription_plans')) {
      await queryRunner.dropTable('subscription_plans');
    }
  }
}
