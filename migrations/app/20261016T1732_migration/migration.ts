#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/ca49a291ee11f4629011b0a04880c1413a03ef5b16b3f977ad65185b5876797d/contract';
import endContract from '../../snapshots/ca49a291ee11f4629011b0a04880c1413a03ef5b16b3f977ad65185b5876797d/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations(): Migration['operations'] {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'MovieSession',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('movieTitle', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startsAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'MovieSessionSeat',
        columns: [
          col('MovieSessionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('SeatId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['MovieSessionId', 'SeatId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Seat',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('number', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('row', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'MovieSession',
        constraint: 'MovieSession_movieTitle_key',
        columns: ['movieTitle'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieSessionSeat',
        index: 'MovieSessionSeat_MovieSessionId_idx_fefd5081',
        columns: ['MovieSessionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieSessionSeat',
        index: 'MovieSessionSeat_SeatId_idx_66fcb29e',
        columns: ['SeatId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'MovieSessionSeat',
        foreignKey: {
          name: 'MovieSessionSeat_SeatId_fkey',
          columns: ['SeatId'],
          references: { schema: 'public', table: 'Seat', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'MovieSessionSeat',
        foreignKey: {
          name: 'MovieSessionSeat_MovieSessionId_fkey',
          columns: ['MovieSessionId'],
          references: { schema: 'public', table: 'MovieSession', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
