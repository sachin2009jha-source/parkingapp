import 'dotenv/config'
import { Temporal } from '@js-temporal/polyfill'
import postgres from '@prisma/orm-postgres/runtime'
import { contractFromJson } from '@prisma/orm-postgres/static'
import type { Contract } from './schema'
import contractJson from './schema.json' with { type: 'json' }

Object.assign(globalThis, { Temporal })

export const contract = contractFromJson<Contract>(contractJson)

export const db = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
})
