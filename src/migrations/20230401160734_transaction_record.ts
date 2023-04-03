import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transaction_records', (table) => {
    table.increments('id').primary();
    table.integer('from_wallet_id').references('id').inTable('wallets').notNullable();
    table.integer('to_wallet_id').references('id').inTable('wallets').notNullable();
    table.integer('amount').notNullable();
    table.string('status', 255).notNullable().defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transaction_records');
}
