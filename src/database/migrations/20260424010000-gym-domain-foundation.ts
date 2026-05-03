import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class GymDomainFoundation20260424010000 implements MigrationInterface {
  name = 'GymDomainFoundation20260424010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasGymsTable = await queryRunner.hasTable('gyms');

    if (!hasGymsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'gyms',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'code',
              type: 'varchar',
              length: '50',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '150',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'contact_email',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'phone_number',
              type: 'varchar',
              length: '30',
              isNullable: true,
            },
            {
              name: 'is_active',
              type: 'boolean',
              default: true,
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
    }

    const hasAmenitiesTable = await queryRunner.hasTable('gym_amenities');

    if (!hasAmenitiesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'gym_amenities',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'gym_id',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'gym_amenities',
        new TableForeignKey({
          columnNames: ['gym_id'],
          referencedTableName: 'gyms',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const hasOperatingHoursTable = await queryRunner.hasTable(
      'gym_operating_hours',
    );

    if (!hasOperatingHoursTable) {
      await queryRunner.createTable(
        new Table({
          name: 'gym_operating_hours',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'gym_id',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'day_of_week',
              type: 'smallint',
              isNullable: false,
            },
            {
              name: 'open_time',
              type: 'time',
              isNullable: true,
            },
            {
              name: 'close_time',
              type: 'time',
              isNullable: true,
            },
            {
              name: 'is_closed',
              type: 'boolean',
              default: false,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'gym_operating_hours',
        new TableForeignKey({
          columnNames: ['gym_id'],
          referencedTableName: 'gyms',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('gym_operating_hours')) {
      await queryRunner.dropTable('gym_operating_hours');
    }

    if (await queryRunner.hasTable('gym_amenities')) {
      await queryRunner.dropTable('gym_amenities');
    }

    if (await queryRunner.hasTable('gyms')) {
      await queryRunner.dropTable('gyms');
    }
  }
}
