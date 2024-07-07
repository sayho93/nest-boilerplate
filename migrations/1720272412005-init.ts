import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1720272412005 implements MigrationInterface {
  name = 'Init1720272412005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`project\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdBy\` varchar(36) NULL, \`updatedBy\` varchar(36) NULL, \`deletedBy\` varchar(36) NULL, INDEX \`IDX_a8c9319b1f0d38e955f9c0620d\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`type\` enum ('email', 'google', 'naver', 'kakao') NOT NULL COMMENT '인증타입', \`email\` varchar(64) NOT NULL COMMENT '이메일', \`password\` varchar(256) NULL COMMENT '비밀번호', \`token\` varchar(256) NULL COMMENT 'token', \`isVerified\` tinyint NULL COMMENT '인증 여부', \`userId\` varchar(36) NULL, INDEX \`IDX_392eca727f7ab94f76fe3d687f\` (\`createdAt\`), UNIQUE INDEX \`IDX_6e49c6f17062b55d836602d0d7\` (\`deletedAt\`, \`type\`, \`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`credit\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`variance\` int NOT NULL COMMENT '변화량', \`context\` varchar(255) NOT NULL COMMENT 'credit 부여/차감 컨텍스트', \`createdBy\` varchar(36) NULL, \`updatedBy\` varchar(36) NULL, \`deletedBy\` varchar(36) NULL, \`userId\` varchar(36) NULL, INDEX \`IDX_62b8229ef0c8cf57806903b6f3\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`lastName\` varchar(32) NOT NULL COMMENT '성', \`firstName\` varchar(32) NOT NULL COMMENT '이름', \`alias\` varchar(40) NOT NULL COMMENT '별칭', \`role\` enum ('admin', 'member', 'guest') NOT NULL COMMENT '권한' DEFAULT 'guest', \`phone\` varchar(16) NULL COMMENT '전화번호', INDEX \`IDX_e11e649824a45d8ed01d597fd9\` (\`createdAt\`), UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`request\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`additionalData1\` varchar(255) NOT NULL, \`additionalData2\` varchar(255) NOT NULL, \`additionalData3\` varchar(255) NOT NULL, \`specificProperty1\` varchar(255) NULL, \`specificProperty2\` varchar(255) NULL, \`specificProperty3\` varchar(255) NULL, \`specificProperty4\` varchar(255) NULL, \`specificProperty5\` varchar(255) NULL, \`specificProperty6\` varchar(255) NULL, \`specificProperty7\` varchar(255) NULL, \`specificProperty8\` varchar(255) NULL, \`specificProperty9\` varchar(255) NULL, \`type\` text NOT NULL, \`createdBy\` varchar(36) NULL, \`updatedBy\` varchar(36) NULL, \`deletedBy\` varchar(36) NULL, \`userId\` varchar(36) NULL, \`projectId\` varchar(36) NULL, INDEX \`IDX_02a1578b3a1866b6af58f49afb\` (\`createdAt\`), INDEX \`IDX_4ffe0ab8ebb0a486f422df6dcf\` (\`type\`(100)), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD CONSTRAINT \`FK_c714b0a5eaf71cc3a36c242d2e9\` FOREIGN KEY (\`createdBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD CONSTRAINT \`FK_26383422884206e10cae5023d33\` FOREIGN KEY (\`updatedBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD CONSTRAINT \`FK_b8f888fcb700c857d48878a90e5\` FOREIGN KEY (\`deletedBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_373ead146f110f04dad60848154\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
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
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD CONSTRAINT \`FK_714d69100c9c9f7835e3c2ef3e0\` FOREIGN KEY (\`createdBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD CONSTRAINT \`FK_2e79cf01c0e2a2a037108016900\` FOREIGN KEY (\`updatedBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD CONSTRAINT \`FK_82a872b2e2ac75a7a23121618bf\` FOREIGN KEY (\`deletedBy\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD CONSTRAINT \`FK_38554ade327a061ba620eee948b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request\` ADD CONSTRAINT \`FK_29fd141b4e6209c6a98c98b4073\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_29fd141b4e6209c6a98c98b4073\``);
    await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_38554ade327a061ba620eee948b\``);
    await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_82a872b2e2ac75a7a23121618bf\``);
    await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_2e79cf01c0e2a2a037108016900\``);
    await queryRunner.query(`ALTER TABLE \`request\` DROP FOREIGN KEY \`FK_714d69100c9c9f7835e3c2ef3e0\``);
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_9f5fdca6886a2ecdb6d34b23d70\``);
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_a29f4d973298a0c64306a5d67f2\``);
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_d32519d3f7c690be73ce05e4256\``);
    await queryRunner.query(`ALTER TABLE \`credit\` DROP FOREIGN KEY \`FK_eefee66a6e6a6732b9e3d542fc0\``);
    await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_373ead146f110f04dad60848154\``);
    await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_b8f888fcb700c857d48878a90e5\``);
    await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_26383422884206e10cae5023d33\``);
    await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_c714b0a5eaf71cc3a36c242d2e9\``);
    await queryRunner.query(`DROP INDEX \`IDX_4ffe0ab8ebb0a486f422df6dcf\` ON \`request\``);
    await queryRunner.query(`DROP INDEX \`IDX_02a1578b3a1866b6af58f49afb\` ON \`request\``);
    await queryRunner.query(`DROP TABLE \`request\``);
    await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_e11e649824a45d8ed01d597fd9\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_62b8229ef0c8cf57806903b6f3\` ON \`credit\``);
    await queryRunner.query(`DROP TABLE \`credit\``);
    await queryRunner.query(`DROP INDEX \`IDX_6e49c6f17062b55d836602d0d7\` ON \`auth\``);
    await queryRunner.query(`DROP INDEX \`IDX_392eca727f7ab94f76fe3d687f\` ON \`auth\``);
    await queryRunner.query(`DROP TABLE \`auth\``);
    await queryRunner.query(`DROP INDEX \`IDX_a8c9319b1f0d38e955f9c0620d\` ON \`project\``);
    await queryRunner.query(`DROP TABLE \`project\``);
  }
}
