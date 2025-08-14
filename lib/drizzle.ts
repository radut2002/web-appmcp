import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  index,
  foreignKey,
} from 'drizzle-orm/pg-core'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// Users table
export const UsersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email').notNull(),
    passwordHash: varchar('password_hash').notNull(),
    name: varchar('name'),
    avatarUrl: varchar('avatar_url'),
    credits: integer('credits').default(10),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (users) => {
    return {
      emailUniqueIdx: uniqueIndex('users_email_key').on(users.email),
      emailIdx: index('idx_users_email').on(users.email),
    }
  }
)

// Generated images table
export const GeneratedImagesTable = pgTable(
  'generated_images',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    prompt: text('prompt').notNull(),
    imageUrl: varchar('image_url').notNull(),
    thumbnailUrl: varchar('thumbnail_url'),
    width: integer('width').default(1024),
    height: integer('height').default(1024),
    model: varchar('model').default('dall-e-3'),
    style: varchar('style'),
    quality: varchar('quality').default('standard'),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (images) => {
    return {
      userIdIdx: index('idx_generated_images_user_id').on(images.userId),
      createdAtIdx: index('idx_generated_images_created_at').on(images.createdAt),
      publicIdx: index('idx_generated_images_public').on(images.isPublic),
      userIdFk: foreignKey({
        columns: [images.userId],
        foreignColumns: [UsersTable.id],
      }).onDelete('cascade'),
    }
  }
)

// Type exports
export type User = InferSelectModel<typeof UsersTable>
export type NewUser = InferInsertModel<typeof UsersTable>
export type GeneratedImage = InferSelectModel<typeof GeneratedImagesTable>
export type NewGeneratedImage = InferInsertModel<typeof GeneratedImagesTable>

// Connect to Postgres
export const db = drizzle(sql)