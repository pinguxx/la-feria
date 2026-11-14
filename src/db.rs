use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Passport {
    pub id: String,
    pub nickname: String,
    pub avatar: String,
    pub has_pin: bool,
    pub coins: i64,
    pub tickets: i64,
    pub total_earned_coins: i64,
    pub total_earned_tickets: i64,
    pub games_played: i64,
    pub created_at: u64,
    pub last_active: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardEntry {
    pub rank: usize,
    pub passport_id: String,
    pub nickname: String,
    pub avatar: String,
    pub coins: i64,
    pub tickets: i64,
    pub games_played: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameLeaderboardEntry {
    pub rank: usize,
    pub passport_id: String,
    pub nickname: String,
    pub avatar: String,
    pub high_score: i64,
    pub times_played: i64,
}

#[derive(Clone)]
pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

fn hash_pin(pin: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(b"feria_salt_v1_");
    hasher.update(pin.as_bytes());
    format!("{:x}", hasher.finalize())
}

impl Database {
    pub fn new(path: &str) -> Result<Self, rusqlite::Error> {
        if let Some(parent) = std::path::Path::new(path).parent() {
            if !parent.as_os_str().is_empty() && !parent.exists() {
                let _ = std::fs::create_dir_all(parent);
            }
        }
        let conn = Connection::open(path)?;
        let db = Self {
            conn: Arc::new(Mutex::new(conn)),
        };
        db.init_schema()?;
        Ok(db)
    }

    pub fn new_in_memory() -> Result<Self, rusqlite::Error> {
        let conn = Connection::open_in_memory()?;
        let db = Self {
            conn: Arc::new(Mutex::new(conn)),
        };
        db.init_schema()?;
        Ok(db)
    }

    fn init_schema(&self) -> Result<(), rusqlite::Error> {
        let conn = self.conn.lock().unwrap();

        conn.execute_batch(
            r#"
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;

            CREATE TABLE IF NOT EXISTS passports (
                id TEXT PRIMARY KEY,
                nickname TEXT NOT NULL,
                avatar TEXT NOT NULL,
                pin_hash TEXT,
                coins INTEGER NOT NULL DEFAULT 50,
                tickets INTEGER NOT NULL DEFAULT 5,
                total_earned_coins INTEGER NOT NULL DEFAULT 50,
                total_earned_tickets INTEGER NOT NULL DEFAULT 5,
                games_played INTEGER NOT NULL DEFAULT 0,
                created_at INTEGER NOT NULL,
                last_active INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS rewards_history (
                id TEXT PRIMARY KEY,
                passport_id TEXT NOT NULL,
                game_id TEXT NOT NULL,
                coins_earned INTEGER NOT NULL,
                tickets_earned INTEGER NOT NULL,
                score INTEGER NOT NULL DEFAULT 0,
                note TEXT,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (passport_id) REFERENCES passports(id)
            );

            CREATE TABLE IF NOT EXISTS redeemed_prizes (
                id TEXT PRIMARY KEY,
                passport_id TEXT NOT NULL,
                prize_id TEXT NOT NULL,
                cost INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (passport_id) REFERENCES passports(id)
            );

            CREATE INDEX IF NOT EXISTS idx_passports_coins ON passports(coins DESC);
            CREATE INDEX IF NOT EXISTS idx_rewards_game ON rewards_history(game_id, score DESC);
            CREATE INDEX IF NOT EXISTS idx_rewards_player ON rewards_history(passport_id);
            "#,
        )?;

        Ok(())
    }

    pub fn create_guest_passport(
        &self,
        nickname: &str,
        avatar: &str,
    ) -> Result<Passport, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let id = Uuid::new_v4().to_string();
        let now = current_timestamp();

        let clean_nick = if nickname.trim().is_empty() {
            "Marchante Feliz".to_string()
        } else {
            nickname.trim().chars().take(24).collect()
        };

        let clean_avatar = if avatar.trim().is_empty() {
            "🤼".to_string()
        } else {
            avatar.trim().to_string()
        };

        conn.execute(
            r#"
            INSERT INTO passports (id, nickname, avatar, pin_hash, coins, tickets, total_earned_coins, total_earned_tickets, games_played, created_at, last_active)
            VALUES (?1, ?2, ?3, NULL, 50, 5, 50, 5, 0, ?4, ?4)
            "#,
            params![id, clean_nick, clean_avatar, now],
        )?;

        Ok(Passport {
            id,
            nickname: clean_nick,
            avatar: clean_avatar,
            has_pin: false,
            coins: 50,
            tickets: 5,
            total_earned_coins: 50,
            total_earned_tickets: 5,
            games_played: 0,
            created_at: now,
            last_active: now,
        })
    }

    pub fn get_passport(&self, id: &str) -> Result<Option<Passport>, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            r#"
            SELECT id, nickname, avatar, (pin_hash IS NOT NULL) AS has_pin, coins, tickets, total_earned_coins, total_earned_tickets, games_played, created_at, last_active
            FROM passports
            WHERE id = ?1
            "#,
        )?;

        let mut rows = stmt.query(params![id])?;
        if let Some(row) = rows.next()? {
            Ok(Some(Passport {
                id: row.get(0)?,
                nickname: row.get(1)?,
                avatar: row.get(2)?,
                has_pin: row.get(3)?,
                coins: row.get(4)?,
                tickets: row.get(5)?,
                total_earned_coins: row.get(6)?,
                total_earned_tickets: row.get(7)?,
                games_played: row.get(8)?,
                created_at: row.get(9)?,
                last_active: row.get(10)?,
            }))
        } else {
            Ok(None)
        }
    }

    pub fn set_pin(&self, id: &str, pin: &str) -> Result<bool, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let hashed = hash_pin(pin);
        let now = current_timestamp();

        let updated = conn.execute(
            r#"
            UPDATE passports
            SET pin_hash = ?1, last_active = ?2
            WHERE id = ?3
            "#,
            params![hashed, now, id],
        )?;

        Ok(updated > 0)
    }

    pub fn login_with_pin(
        &self,
        nickname: &str,
        pin: &str,
    ) -> Result<Option<Passport>, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let hashed = hash_pin(pin);
        let now = current_timestamp();

        let mut stmt = conn.prepare(
            r#"
            SELECT id, nickname, avatar, 1 AS has_pin, coins, tickets, total_earned_coins, total_earned_tickets, games_played, created_at, last_active
            FROM passports
            WHERE LOWER(nickname) = LOWER(?1) AND pin_hash = ?2
            LIMIT 1
            "#,
        )?;

        let mut rows = stmt.query(params![nickname.trim(), hashed])?;
        if let Some(row) = rows.next()? {
            let id: String = row.get(0)?;
            conn.execute(
                "UPDATE passports SET last_active = ?1 WHERE id = ?2",
                params![now, id],
            )?;

            Ok(Some(Passport {
                id,
                nickname: row.get(1)?,
                avatar: row.get(2)?,
                has_pin: true,
                coins: row.get(4)?,
                tickets: row.get(5)?,
                total_earned_coins: row.get(6)?,
                total_earned_tickets: row.get(7)?,
                games_played: row.get(8)?,
                created_at: row.get(9)?,
                last_active: now,
            }))
        } else {
            Ok(None)
        }
    }

    pub fn award_rewards(
        &self,
        passport_id: &str,
        game_id: &str,
        coins: i64,
        tickets: i64,
        score: i64,
        note: Option<&str>,
    ) -> Result<Option<Passport>, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let now = current_timestamp();
        let reward_id = Uuid::new_v4().to_string();

        let updated = conn.execute(
            r#"
            UPDATE passports
            SET coins = coins + ?1,
                tickets = tickets + ?2,
                total_earned_coins = total_earned_coins + ?1,
                total_earned_tickets = total_earned_tickets + ?2,
                games_played = games_played + 1,
                last_active = ?3
            WHERE id = ?4
            "#,
            params![coins.max(0), tickets.max(0), now, passport_id],
        )?;

        if updated == 0 {
            return Ok(None);
        }

        conn.execute(
            r#"
            INSERT INTO rewards_history (id, passport_id, game_id, coins_earned, tickets_earned, score, note, created_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
            "#,
            params![reward_id, passport_id, game_id, coins, tickets, score, note, now],
        )?;

        drop(conn);
        self.get_passport(passport_id)
    }

    pub fn redeem_prize_for_passport(
        &self,
        passport_id: &str,
        prize_id: &str,
        cost: i64,
    ) -> Result<Result<Passport, &'static str>, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let current_tickets: Option<i64> = conn
            .query_row(
                "SELECT tickets FROM passports WHERE id = ?1",
                params![passport_id],
                |row| row.get(0),
            )
            .ok();

        let Some(t) = current_tickets else {
            return Ok(Err("Pasaporte no encontrado"));
        };

        if t < cost {
            return Ok(Err("Boletos insuficientes"));
        }

        let now = current_timestamp();
        let redeem_id = Uuid::new_v4().to_string();

        conn.execute(
            "UPDATE passports SET tickets = tickets - ?1, last_active = ?2 WHERE id = ?3",
            params![cost, now, passport_id],
        )?;

        conn.execute(
            r#"
            INSERT INTO redeemed_prizes (id, passport_id, prize_id, cost, created_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            "#,
            params![redeem_id, passport_id, prize_id, cost, now],
        )?;

        drop(conn);
        let updated = self.get_passport(passport_id)?.unwrap();
        Ok(Ok(updated))
    }

    pub fn get_global_leaderboard(
        &self,
        limit: usize,
    ) -> Result<Vec<LeaderboardEntry>, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            r#"
            SELECT id, nickname, avatar, coins, tickets, games_played
            FROM passports
            ORDER BY coins DESC, tickets DESC, games_played DESC
            LIMIT ?1
            "#,
        )?;

        let rows = stmt.query_map(params![limit as i64], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, i64>(3)?,
                row.get::<_, i64>(4)?,
                row.get::<_, i64>(5)?,
            ))
        })?;

        let mut list = Vec::new();
        for (i, row) in rows.enumerate() {
            let (id, nick, avatar, coins, tickets, games) = row?;
            list.push(LeaderboardEntry {
                rank: i + 1,
                passport_id: id,
                nickname: nick,
                avatar,
                coins,
                tickets,
                games_played: games,
            });
        }

        Ok(list)
    }

    pub fn get_game_leaderboard(
        &self,
        game_id: &str,
        limit: usize,
    ) -> Result<Vec<GameLeaderboardEntry>, rusqlite::Error> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            r#"
            SELECT p.id, p.nickname, p.avatar, MAX(r.score) AS high_score, COUNT(r.id) AS times_played
            FROM rewards_history r
            JOIN passports p ON p.id = r.passport_id
            WHERE r.game_id = ?1
            GROUP BY p.id
            ORDER BY high_score DESC, times_played DESC
            LIMIT ?2
            "#,
        )?;

        let rows = stmt.query_map(params![game_id, limit as i64], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, i64>(3)?,
                row.get::<_, i64>(4)?,
            ))
        })?;

        let mut list = Vec::new();
        for (i, row) in rows.enumerate() {
            let (id, nick, avatar, score, times) = row?;
            list.push(GameLeaderboardEntry {
                rank: i + 1,
                passport_id: id,
                nickname: nick,
                avatar,
                high_score: score,
                times_played: times,
            });
        }

        Ok(list)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_passport_lifecycle() {
        let db = Database::new_in_memory().unwrap();
        let p = db.create_guest_passport("Pancho", "🤼").unwrap();
        assert_eq!(p.nickname, "Pancho");
        assert_eq!(p.coins, 50);
        assert_eq!(p.tickets, 5);

        // Award
        let updated = db
            .award_rewards(&p.id, "rayuela", 15, 2, 95, Some("Tiro de oro"))
            .unwrap()
            .unwrap();
        assert_eq!(updated.coins, 65);
        assert_eq!(updated.tickets, 7);
        assert_eq!(updated.games_played, 1);

        // Set PIN and login
        db.set_pin(&p.id, "1234").unwrap();
        let logged = db.login_with_pin("pancho", "1234").unwrap().unwrap();
        assert_eq!(logged.id, p.id);

        // Leaderboard
        let lb = db.get_global_leaderboard(5).unwrap();
        assert_eq!(lb.len(), 1);
        assert_eq!(lb[0].nickname, "Pancho");

        let glb = db.get_game_leaderboard("rayuela", 5).unwrap();
        assert_eq!(glb.len(), 1);
        assert_eq!(glb[0].high_score, 95);
    }
}
