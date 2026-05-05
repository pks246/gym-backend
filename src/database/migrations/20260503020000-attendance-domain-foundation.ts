import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AttendanceDomainFoundation20260503020000 implements MigrationInterface {
  name = 'AttendanceDomainFoundation20260503020000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('attendances'))) {
      await queryRunner.createTable(
        new Table({
          name: 'attendances',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'member_id', type: 'int', isNullable: false },
            { name: 'attended_on', type: 'date', isNullable: false },
            { name: 'check_in_at', type: 'timestamp', isNullable: false },
            { name: 'check_out_at', type: 'timestamp', isNullable: true },
            {
              name: 'source',
              type: 'varchar',
              length: '30',
              isNullable: false,
              default: "'front-desk'",
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
        'attendances',
        new TableForeignKey({
          columnNames: ['member_id'],
          referencedTableName: 'members',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('attendances')) {
      await queryRunner.dropTable('attendances');
    }
  }
}
