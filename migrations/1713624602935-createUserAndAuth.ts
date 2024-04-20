import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndAuth1713624602935 implements MigrationInterface {
  name = 'CreateUserAndAuth1713624602935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE \`auth\` (
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
            \`deletedAt\` datetime(6) NULL, 
            \`id\` uuid NOT NULL, 
            \`type\` enum ('email', 'google', 'naver', 'kakao') NOT NULL COMMENT '인증타입', 
            \`email\` varchar(64) NULL COMMENT '이메일', 
            \`password\` varchar(256) NULL COMMENT '비밀번호', 
            \`token\` varchar(256) NULL COMMENT 'token', 
            \`userId\` uuid NULL, 
            INDEX \`IDX_392eca727f7ab94f76fe3d687f\` (\`createdAt\`), 
            UNIQUE INDEX \`IDX_5c535c400079ec2edde59e1436\` (\`deletedAt\`, \`email\`), 
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `,
    );
    await queryRunner.query(
      `
        CREATE TABLE \`user\` (
            \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
            \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
            \`deletedAt\` datetime(6) NULL, 
            \`id\` uuid NOT NULL, 
            \`lastName\` varchar(32) NOT NULL COMMENT '성', 
            \`firstName\` varchar(32) NOT NULL COMMENT '이름', 
            \`alias\` varchar(40) NOT NULL COMMENT '별칭', 
            \`role\` enum ('admin', 'member', 'guest') NOT NULL COMMENT '권한' DEFAULT 'guest', 
            \`phone\` varchar(16) NOT NULL COMMENT '전화번호', 
            INDEX \`IDX_e11e649824a45d8ed01d597fd9\` (\`createdAt\`), 
            UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), 
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `,
    );
    await queryRunner.query(
      `
        ALTER TABLE \`auth\` 
            ADD CONSTRAINT \`FK_373ead146f110f04dad60848154\` 
                FOREIGN KEY (\`userId\`) 
                    REFERENCES \`user\`(\`id\`) 
                    ON DELETE CASCADE ON UPDATE NO ACTION
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_373ead146f110f04dad60848154\``);
    await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_e11e649824a45d8ed01d597fd9\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP INDEX \`IDX_5c535c400079ec2edde59e1436\` ON \`auth\``);
    await queryRunner.query(`DROP INDEX \`IDX_392eca727f7ab94f76fe3d687f\` ON \`auth\``);
    await queryRunner.query(`DROP TABLE \`auth\``);
  }
}
