import { Migration } from '@mikro-orm/migrations';

export class Migration20250206155052 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "order_item" add column "user_id" int not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "order_item" drop column "user_id";`);
  }

}
