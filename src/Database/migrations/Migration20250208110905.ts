import { Migration } from '@mikro-orm/migrations';

export class Migration20250208110905 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "product" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null, "price" int not null, "stock_available" int not null, "image" varchar(255) not null, "created_at" timestamptz not null, "update_at" timestamptz not null);`);

    this.addSql(`create table "order_item" ("id" serial primary key, "product_id" int not null, "quantity" int not null, "user_id" int not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "is_admin" boolean not null, "created_at" timestamptz not null, "update_at" timestamptz not null, "password" varchar(255) not null);`);

    this.addSql(`create table "order" ("id" serial primary key, "name" varchar(255) not null, "statut" varchar(255) not null, "created_at" timestamptz not null, "update_at" timestamptz not null, "order_items" jsonb null, "user_id" int not null);`);

    this.addSql(`alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

}
