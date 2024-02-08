import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserAuth1707374222998 implements MigrationInterface {
  name = 'AlterUserAuth1707374222998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_373ead146f110f04dad60848154\``);
    await queryRunner.query(`DROP INDEX \`userCreatedAtIdx\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_b54f616411ef3824f6a5c06ea4\` ON \`auth\``);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` uuid NOT NULL PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastName\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`lastName\` varchar(32) NOT NULL COMMENT '성'`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`firstName\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`firstName\` varchar(32) NOT NULL COMMENT '이름'`);
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`auth\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`auth\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`auth\` ADD \`id\` uuid NOT NULL PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`email\` \`email\` varchar(64) NULL COMMENT '이메일'`);
    await queryRunner.query(
      `ALTER TABLE \`auth\` CHANGE \`password\` \`password\` varchar(256) NULL COMMENT '비밀번호'`,
    );
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`token\` \`token\` varchar(256) NULL COMMENT 'token'`);
    await queryRunner.query(`ALTER TABLE \`auth\` DROP COLUMN \`userId\``);
    await queryRunner.query(`ALTER TABLE \`auth\` ADD \`userId\` uuid NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_5c535c400079ec2edde59e1436\` ON \`auth\` (\`deletedAt\`, \`email\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_373ead146f110f04dad60848154\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_373ead146f110f04dad60848154\``);
    await queryRunner.query(`DROP INDEX \`IDX_5c535c400079ec2edde59e1436\` ON \`auth\``);
    await queryRunner.query(`ALTER TABLE \`auth\` DROP COLUMN \`userId\``);
    await queryRunner.query(`ALTER TABLE \`auth\` ADD \`userId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`token\` \`token\` varchar(256) NOT NULL COMMENT 'token'`);
    await queryRunner.query(
      `ALTER TABLE \`auth\` CHANGE \`password\` \`password\` varchar(256) NOT NULL COMMENT '비밀번호'`,
    );
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`email\` \`email\` varchar(64) NOT NULL COMMENT '이메일'`);
    await queryRunner.query(`ALTER TABLE \`auth\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`auth\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`auth\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`firstName\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`firstName\` varchar(16) NOT NULL COMMENT '이름'`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastName\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`lastName\` varchar(16) NOT NULL COMMENT '성'`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b54f616411ef3824f6a5c06ea4\` ON \`auth\` (\`email\`)`);
    await queryRunner.query(`CREATE INDEX \`userCreatedAtIdx\` ON \`user\` (\`createdAt\`)`);
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_373ead146f110f04dad60848154\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
