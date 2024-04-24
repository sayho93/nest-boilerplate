import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserAndAuth1713981709652 implements MigrationInterface {
  name = 'AlterUserAndAuth1713981709652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_5c535c400079ec2edde59e1436\` ON \`auth\``);
    await queryRunner.query(`ALTER TABLE \`auth\` ADD \`isVerified\` tinyint NULL COMMENT '인증 여부'`);
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`email\` \`email\` varchar(64) NOT NULL COMMENT '이메일'`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(16) NULL COMMENT '전화번호'`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_6e49c6f17062b55d836602d0d7\` ON \`auth\` (\`deletedAt\`, \`type\`, \`email\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_6e49c6f17062b55d836602d0d7\` ON \`auth\``);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(16) NOT NULL COMMENT '전화번호'`);
    await queryRunner.query(`ALTER TABLE \`auth\` CHANGE \`email\` \`email\` varchar(64) NULL COMMENT '이메일'`);
    await queryRunner.query(`ALTER TABLE \`auth\` DROP COLUMN \`isVerified\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_5c535c400079ec2edde59e1436\` ON \`auth\` (\`deletedAt\`, \`email\`)`,
    );
  }
}
