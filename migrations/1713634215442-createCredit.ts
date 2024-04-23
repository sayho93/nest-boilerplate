import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCredit1713634215442 implements MigrationInterface {
  name = 'CreateCredit1713634215442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
    await queryRunner.query(
      `CREATE TABLE \`credit\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` uuid NOT NULL, \`variance\` int NOT NULL COMMENT '변화량', \`context\` varchar(255) NOT NULL COMMENT 'credit 부여/차감 컨텍스트', \`createdBy\` uuid NULL, \`updatedBy\` uuid NULL, \`deletedBy\` uuid NULL, \`userId\` uuid NULL, INDEX \`IDX_62b8229ef0c8cf57806903b6f3\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`)`);
    await queryRunner.query(
      `ALTER TABLE \`credit\` ADD CONSTRAINT \`FK_eefee66a6e6a6732b9e3d542fc0\` FOREIGN KEY (\`createdBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`credit\` ADD CONSTRAINT \`FK_d32519d3f7c690be73ce05e4256\` FOREIGN KEY (\`updatedBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`credit\` ADD CONSTRAINT \`FK_a29f4d973298a0c64306a5d67f2\` FOREIGN KEY (\`deletedBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`credit\` ADD CONSTRAINT \`FK_9f5fdca6886a2ecdb6d34b23d70\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_9f5fdca6886a2ecdb6d34b23d70\``);
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_a29f4d973298a0c64306a5d67f2\``);
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_d32519d3f7c690be73ce05e4256\``);
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_eefee66a6e6a6732b9e3d542fc0\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_8e1f623798118e629b46a9e629\``);
    await queryRunner.query(`DROP INDEX \`IDX_62b8229ef0c8cf57806903b6f3\` ON \`credit\``);
    await queryRunner.query(`DROP TABLE \`credit\``);
    await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\` (\`phone\`)`);
  }
}
