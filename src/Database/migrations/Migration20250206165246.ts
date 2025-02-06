import { Migration } from '@mikro-orm/migrations';

export class Migration20250206165246 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "order_item" drop constraint "order_item_order_id_foreign";`);

    this.addSql(`alter table "order_item" drop column "order_id";`);

    this.addSql(`alter table "order" add column "order_items" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "order" drop column "order_items";`);

    this.addSql(`alter table "order_item" add column "order_id" int not null;`);
    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
  }

}
