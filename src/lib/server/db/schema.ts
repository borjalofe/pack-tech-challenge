/**
 * Stub — replaced in feat(db) once migration owns the real resources shape.
 * Intentionally incomplete so schema.spec stays red until the feat commit.
 */
import { pgTable, text } from 'drizzle-orm/pg-core';

export const resources = pgTable('resources', {
	id: text('id').primaryKey()
});
