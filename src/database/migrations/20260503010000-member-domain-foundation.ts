import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class MemberDomainFoundation20260503010000 implements MigrationInterface {
  name = 'MemberDomainFoundation20260503010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasMembersTable = await queryRunner.hasTable('members');

    if (!hasMembersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'members',
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
              name: 'member_code',
              type: 'varchar',
              length: '50',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'first_name',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'last_name',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'email',
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
              name: 'date_of_birth',
              type: 'date',
              isNullable: true,
            },
            {
              name: 'joined_on',
              type: 'date',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'varchar',
              length: '30',
              isNullable: false,
              default: "'active'",
            },
            {
              name: 'notes',
              type: 'text',
              isNullable: true,
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

      await queryRunner.createForeignKey(
        'members',
        new TableForeignKey({
          columnNames: ['gym_id'],
          referencedTableName: 'gyms',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const hasContactsTable = await queryRunner.hasTable(
      'member_emergency_contacts',
    );

    if (!hasContactsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'member_emergency_contacts',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'member_id',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '120',
              isNullable: false,
            },
            {
              name: 'relationship',
              type: 'varchar',
              length: '60',
              isNullable: false,
            },
            {
              name: 'phone_number',
              type: 'varchar',
              length: '30',
              isNullable: false,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'member_emergency_contacts',
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
    if (await queryRunner.hasTable('member_emergency_contacts')) {
      await queryRunner.dropTable('member_emergency_contacts');
    }

    if (await queryRunner.hasTable('members')) {
      await queryRunner.dropTable('members');
    }
  }
}
