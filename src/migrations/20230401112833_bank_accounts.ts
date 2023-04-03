import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bank_accounts', (table) => {
    table.increments('id').primary();
    table.integer('wallet_id').references('id').inTable('wallets').notNullable();
    table.string('account_number', 255).notNullable();
    table.string('account_name', 255).notNullable();
    table.string('bank_name', 255).notNullable();
    table.string('transaction_password', 255).notNullable();
    table.boolean('is_verified').notNullable().defaultTo(false);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bank_accounts');
}
