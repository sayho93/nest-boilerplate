import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUserAndCreateAuth1707223762874 implements MigrationInterface {
  name = 'ModifyUserAndCreateAuth1707223762874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`type\` enum ('email', 'google', 'naver', 'kakao') NOT NULL COMMENT '인증타입', \`email\` varchar(64) NOT NULL COMMENT '이메일', \`password\` varchar(256) NOT NULL COMMENT '비밀번호', \`token\` varchar(256) NOT NULL COMMENT 'token', \`userId\` int NULL, INDEX \`IDX_392eca727f7ab94f76fe3d687f\` (\`createdAt\`), UNIQUE INDEX \`IDX_b54f616411ef3824f6a5c06ea4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`name\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`lastName\` varchar(16) NOT NULL COMMENT '성'`);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`firstName\` varchar(16) NOT NULL COMMENT '이름'`);
    await queryRunner.query(`CREATE INDEX \`IDX_e11e649824a45d8ed01d597fd9\` ON \`user\` (\`createdAt\`)`);
    await queryRunner.query(
      `ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_373ead146f110f04dad60848154\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_373ead146f110f04dad60848154\``);
    await queryRunner.query(`DROP INDEX \`IDX_e11e649824a45d8ed01d597fd9\` ON \`user\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`firstName\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastName\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`name\` varchar(40) NOT NULL COMMENT '이름'`);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(256) NOT NULL COMMENT '비밀번호'`);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(64) NOT NULL COMMENT '이메일'`);
    await queryRunner.query(`DROP INDEX \`IDX_b54f616411ef3824f6a5c06ea4\` ON \`auth\``);
    await queryRunner.query(`DROP INDEX \`IDX_392eca727f7ab94f76fe3d687f\` ON \`auth\``);
    await queryRunner.query(`DROP TABLE \`auth\``);
  }
}
