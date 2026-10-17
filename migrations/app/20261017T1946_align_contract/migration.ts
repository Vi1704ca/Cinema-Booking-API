#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2d45a31319df5a12134c34038f2b193cc7560db5e28711ac263bee1c511a930a/contract';
import endContract from '../../snapshots/2d45a31319df5a12134c34038f2b193cc7560db5e28711ac263bee1c511a930a/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ca49a291ee11f4629011b0a04880c1413a03ef5b16b3f977ad65185b5876797d/contract';
import startContract from '../../snapshots/ca49a291ee11f4629011b0a04880c1413a03ef5b16b3f977ad65185b5876797d/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
