/**
 * database.ts — Browser SQLite via sql.js (WebAssembly).
 *
 * Schema covers every piece of player data the game needs to persist:
 *   players          — one row per registered player / session
 *   recipe_mastery   — best score + stars per recipe per player
 *   level_progress   — completion state per level per player
 *   session_events   — timestamped audit trail for thesis analytics
 *   knowledge_tests  — pre/post test scores per player
 *   analytics        — aggregate counters per player
 *
 * The DB is serialized to Uint8Array and stored in localStorage under
 * the key "vcl_sqlite_db" after every write. On startup the saved
 * bytes are loaded back into sql.js so data survives page refreshes.
 *
 * Implements game narrative: all player data stored locally.
 */

import type { Database, SqlJsStatic } from 'sql.js'

// sql.js is CJS. Vite wraps it so the callable factory lands on
// mod.default.default (double-nested) or mod.default, depending on
// the bundler pass. We probe all three locations at runtime.
async function loadSqlJs(): Promise<(cfg: { locateFile: () => string }) => Promise<SqlJsStatic>> {
  const mod = await import('sql.js')
  const factory = (mod as any).default?.default ?? (mod as any).default ?? mod
  if (typeof factory !== 'function') {
    throw new Error('sql.js factory not found. Keys: ' + Object.keys(mod).join(', '))
  }
  return factory as (cfg: { locateFile: () => string }) => Promise<SqlJsStatic>
}

// ── Constants ────────────────────────────────────────────────────
const STORAGE_KEY = 'vcl_sqlite_db'
const WASM_URL    = '/sql-wasm.wasm' // served from /public

// ── Singleton ────────────────────────────────────────────────────
let SQL: SqlJsStatic | null = null
let db:  Database   | null = null

// ── Schema DDL ───────────────────────────────────────────────────
const SCHEMA = `
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS players (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  username     TEXT    NOT NULL UNIQUE,
  display_name TEXT    NOT NULL,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  last_seen    TEXT    NOT NULL DEFAULT (datetime('now')),
  total_score  INTEGER NOT NULL DEFAULT 0,
  recipes_done INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  badges       TEXT    NOT NULL DEFAULT '[]'   -- JSON array
);

CREATE TABLE IF NOT EXISTS recipe_mastery (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id   INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  recipe_id   INTEGER NOT NULL,
  best_score  INTEGER NOT NULL DEFAULT 0,
  stars       INTEGER NOT NULL DEFAULT 0,
  completed   INTEGER NOT NULL DEFAULT 0,       -- 0/1 boolean
  attempts    INTEGER NOT NULL DEFAULT 0,
  last_played TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(player_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS level_progress (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id        INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  level_id         INTEGER NOT NULL,
  completed        INTEGER NOT NULL DEFAULT 0,
  average_score    REAL    NOT NULL DEFAULT 0,
  recipes_completed INTEGER NOT NULL DEFAULT 0,
  unlocked         INTEGER NOT NULL DEFAULT 0,
  UNIQUE(player_id, level_id)
);

CREATE TABLE IF NOT EXISTS unlocked_recipes (
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL,
  PRIMARY KEY(player_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS knowledge_tests (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id  INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  test_type  TEXT    NOT NULL CHECK(test_type IN ('pre','post')),
  score      INTEGER NOT NULL,
  answers    TEXT    NOT NULL DEFAULT '[]',  -- JSON array of chosen indices
  taken_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS session_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id  INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  event      TEXT    NOT NULL,   -- 'ingredient_error'|'burn'|'unsafe_cut'|'recipe_done'|…
  recipe_id  INTEGER,
  detail     TEXT,               -- JSON metadata
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics (
  player_id            INTEGER PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  burn_count           INTEGER NOT NULL DEFAULT 0,
  ingredient_errors    INTEGER NOT NULL DEFAULT 0,
  unsafe_cuts          INTEGER NOT NULL DEFAULT 0,
  perfect_dishes       INTEGER NOT NULL DEFAULT 0,
  total_play_seconds   INTEGER NOT NULL DEFAULT 0,
  total_sessions       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tools_viewed (
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  tool_id   INTEGER NOT NULL,
  viewed_at TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY(player_id, tool_id)
);
`

// ── Init ─────────────────────────────────────────────────────────
export async function initDB(): Promise<Database> {
  if (db) return db

  const initSqlJs = await loadSqlJs()
  SQL = await initSqlJs({ locateFile: () => WASM_URL })

  // Try to load a previously saved database
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0))
      db = new SQL.Database(bytes)
    } catch {
      db = new SQL.Database()
    }
  } else {
    db = new SQL.Database()
  }

  db.run(SCHEMA)
  persist()
  return db
}

/** Serialize the DB to localStorage so it survives page refreshes */
export function persist(): void {
  if (!db) return
  const bytes = db.export()
  const b64   = btoa(String.fromCharCode(...bytes))
  localStorage.setItem(STORAGE_KEY, b64)
}

/** Export the raw SQLite bytes (for "download backup" feature) */
export function exportBytes(): Uint8Array {
  if (!db) throw new Error('DB not initialised')
  return db.export()
}

/** Get the singleton (throws if not initialised) */
export function getDB(): Database {
  if (!db) throw new Error('DB not initialised — call initDB() first')
  return db
}

// ── Low-level helpers ─────────────────────────────────────────────
type Row = Record<string, string | number | null>

export function query(sql: string, params: (string | number | null)[] = []): Row[] {
  const d = getDB()
  const stmt = d.prepare(sql)
  stmt.bind(params)
  const rows: Row[] = []
  while (stmt.step()) rows.push(stmt.getAsObject() as Row)
  stmt.free()
  return rows
}

export function run(sql: string, params: (string | number | null)[] = []): void {
  getDB().run(sql, params)
  persist()
}

export function runMany(statements: { sql: string; params?: (string | number | null)[] }[]): void {
  const d = getDB()
  for (const s of statements) d.run(s.sql, s.params ?? [])
  persist()
}

// ── Player API ────────────────────────────────────────────────────
export interface PlayerRow {
  id: number
  username: string
  display_name: string
  created_at: string
  last_seen: string
  total_score: number
  recipes_done: number
  current_level: number
  badges: string[]
}

export function upsertPlayer(username: string, displayName: string): PlayerRow {
  run(
    `INSERT INTO players(username, display_name)
     VALUES(?,?)
     ON CONFLICT(username) DO UPDATE SET
       display_name = excluded.display_name,
       last_seen    = datetime('now')`,
    [username, displayName],
  )
  return getPlayer(username)!
}

export function getPlayer(username: string): PlayerRow | null {
  const rows = query('SELECT * FROM players WHERE username = ?', [username])
  if (!rows.length) return null
  const r = rows[0]
  return { ...r, badges: JSON.parse(r.badges as string ?? '[]') } as PlayerRow
}

export function getAllPlayers(): PlayerRow[] {
  return query('SELECT * FROM players ORDER BY last_seen DESC')
    .map(r => ({ ...r, badges: JSON.parse(r.badges as string ?? '[]') }) as PlayerRow)
}

export function updatePlayerStats(playerId: number, totalScore: number, recipesDone: number, currentLevel: number): void {
  run(
    `UPDATE players SET total_score=?, recipes_done=?, current_level=?, last_seen=datetime('now') WHERE id=?`,
    [totalScore, recipesDone, currentLevel, playerId],
  )
}

// ── Recipe mastery API ────────────────────────────────────────────
export function upsertRecipeMastery(
  playerId: number, recipeId: number, score: number, stars: number, completed: boolean,
): void {
  run(
    `INSERT INTO recipe_mastery(player_id, recipe_id, best_score, stars, completed, attempts, last_played)
     VALUES(?,?,?,?,?,1,datetime('now'))
     ON CONFLICT(player_id, recipe_id) DO UPDATE SET
       best_score  = MAX(best_score, excluded.best_score),
       stars       = MAX(stars, excluded.stars),
       completed   = MAX(completed, excluded.completed),
       attempts    = attempts + 1,
       last_played = datetime('now')`,
    [playerId, recipeId, score, stars, completed ? 1 : 0],
  )
}

export function getRecipeMastery(playerId: number): Record<number, { bestScore: number; stars: number; completed: boolean; attempts: number }> {
  const rows = query('SELECT * FROM recipe_mastery WHERE player_id = ?', [playerId])
  const result: Record<number, { bestScore: number; stars: number; completed: boolean; attempts: number }> = {}
  for (const r of rows) {
    result[r.recipe_id as number] = {
      bestScore: r.best_score as number,
      stars:     r.stars as number,
      completed: (r.completed as number) === 1,
      attempts:  r.attempts as number,
    }
  }
  return result
}

// ── Level progress API ────────────────────────────────────────────
export function upsertLevelProgress(
  playerId: number, levelId: number, completed: boolean, averageScore: number, recipesCompleted: number,
): void {
  run(
    `INSERT INTO level_progress(player_id, level_id, completed, average_score, recipes_completed, unlocked)
     VALUES(?,?,?,?,?,1)
     ON CONFLICT(player_id, level_id) DO UPDATE SET
       completed         = MAX(completed, excluded.completed),
       average_score     = excluded.average_score,
       recipes_completed = excluded.recipes_completed`,
    [playerId, levelId, completed ? 1 : 0, averageScore, recipesCompleted],
  )
}

export function getLevelProgress(playerId: number): Record<number, { completed: boolean; averageScore: number; recipesCompleted: number }> {
  const rows = query('SELECT * FROM level_progress WHERE player_id = ?', [playerId])
  const result: Record<number, { completed: boolean; averageScore: number; recipesCompleted: number }> = {}
  for (const r of rows) {
    result[r.level_id as number] = {
      completed:        (r.completed as number) === 1,
      averageScore:     r.average_score as number,
      recipesCompleted: r.recipes_completed as number,
    }
  }
  return result
}

export function unlockLevel(playerId: number, levelId: number): void {
  run(
    `INSERT INTO level_progress(player_id, level_id, unlocked) VALUES(?,?,1)
     ON CONFLICT(player_id, level_id) DO UPDATE SET unlocked=1`,
    [playerId, levelId],
  )
}

export function getUnlockedLevels(playerId: number): number[] {
  return query(
    'SELECT level_id FROM level_progress WHERE player_id = ? AND unlocked = 1',
    [playerId],
  ).map(r => r.level_id as number)
}

// ── Unlocked recipes API ──────────────────────────────────────────
export function unlockRecipe(playerId: number, recipeId: number): void {
  run(
    `INSERT OR IGNORE INTO unlocked_recipes(player_id, recipe_id) VALUES(?,?)`,
    [playerId, recipeId],
  )
}

export function getUnlockedRecipes(playerId: number): number[] {
  return query(
    'SELECT recipe_id FROM unlocked_recipes WHERE player_id = ?',
    [playerId],
  ).map(r => r.recipe_id as number)
}

// ── Knowledge test API ────────────────────────────────────────────
export function saveKnowledgeTest(playerId: number, type: 'pre' | 'post', score: number, answers: number[]): void {
  run(
    `INSERT INTO knowledge_tests(player_id, test_type, score, answers)
     VALUES(?,?,?,?)`,
    [playerId, type, score, JSON.stringify(answers)],
  )
}

export function getKnowledgeTests(playerId: number): { type: string; score: number; takenAt: string }[] {
  return query(
    'SELECT test_type, score, taken_at FROM knowledge_tests WHERE player_id = ? ORDER BY taken_at DESC',
    [playerId],
  ).map(r => ({ type: r.test_type as string, score: r.score as number, takenAt: r.taken_at as string }))
}

// ── Session events API (analytics) ───────────────────────────────
export function logEvent(playerId: number, event: string, recipeId?: number, detail?: object): void {
  run(
    `INSERT INTO session_events(player_id, event, recipe_id, detail) VALUES(?,?,?,?)`,
    [playerId, event, recipeId ?? null, detail ? JSON.stringify(detail) : null],
  )
}

// ── Analytics API ─────────────────────────────────────────────────
export function incrementAnalytic(playerId: number, field: 'burn_count' | 'ingredient_errors' | 'unsafe_cuts' | 'perfect_dishes'): void {
  run(`INSERT INTO analytics(player_id, ${field}) VALUES(?,1)
       ON CONFLICT(player_id) DO UPDATE SET ${field} = ${field} + 1`,
    [playerId])
}

export function addPlayTime(playerId: number, seconds: number): void {
  run(
    `INSERT INTO analytics(player_id, total_play_seconds, total_sessions)
     VALUES(?,?,1)
     ON CONFLICT(player_id) DO UPDATE SET
       total_play_seconds = total_play_seconds + excluded.total_play_seconds,
       total_sessions     = total_sessions + 1`,
    [playerId, seconds],
  )
}

export function getAnalytics(playerId: number) {
  const rows = query('SELECT * FROM analytics WHERE player_id = ?', [playerId])
  return rows[0] ?? { burn_count: 0, ingredient_errors: 0, unsafe_cuts: 0, perfect_dishes: 0, total_play_seconds: 0, total_sessions: 0 }
}

// ── Tools viewed API ──────────────────────────────────────────────
export function markToolViewedDB(playerId: number, toolId: number): void {
  run(
    `INSERT OR IGNORE INTO tools_viewed(player_id, tool_id) VALUES(?,?)`,
    [playerId, toolId],
  )
}

export function getToolsViewed(playerId: number): number[] {
  return query('SELECT tool_id FROM tools_viewed WHERE player_id = ?', [playerId])
    .map(r => r.tool_id as number)
}

// ── Export / Backup ───────────────────────────────────────────────
export function downloadBackup(filename = 'cooking-lab-backup.sqlite'): void {
  const bytes = exportBytes()
  const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/octet-stream' })
  const url   = URL.createObjectURL(blob)
  const a     = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}