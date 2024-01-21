import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1705688220299 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`user\`
        (
            \`id\`        int(11)                         NOT NULL AUTO_INCREMENT,
            \`createdAt\` datetime(6)                     NOT NULL DEFAULT current_timestamp(6),
            \`updatedAt\` datetime(6)                     NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
            \`deletedAt\` datetime(6)                              DEFAULT NULL,
            \`email\`     varchar(64)                     NOT NULL COMMENT '이메일',
            \`password\`  varchar(256)                    NOT NULL COMMENT '비밀번호',
            \`name\`      varchar(24)                     NOT NULL COMMENT '이름',
            \`alias\`     varchar(24)                     NOT NULL COMMENT '별칭',
            \`role\`      enum ('admin','member','guest') NOT NULL DEFAULT 'guest' COMMENT '권한',
            \`phone\`     varchar(16)                              DEFAULT NULL COMMENT '전화번호',
            INDEX \`userCreatedAtIdx\` (\`createdAt\`),
            UNIQUE KEY \`userEmailIdx\` (\`email\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE = InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user`);
  }
}
