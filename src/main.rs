use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::{
    net::SocketAddr,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
    time::Instant,
};
use tokio::sync::broadcast;
use tower_http::services::ServeDir;

pub mod db;
use db::Database;

#[derive(Clone)]
pub struct AppState {
    pub visitors_count: Arc<AtomicUsize>,
    pub tickets_redeemed: Arc<AtomicUsize>,
    pub tx: broadcast::Sender<String>,
    pub start_time: Instant,
    pub db: Database,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GameInfo {
    pub id: String,
    pub title: String,
    pub subtitle: String,
    pub icon: String,
    pub category: String,
    pub tech: Vec<String>,
    pub repo_url: String,
    pub play_url: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PrizeInfo {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub cost: usize,
    pub phrase: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StatsResponse {
    pub active_visitors: usize,
    pub total_tickets_redeemed: usize,
    pub uptime_seconds: u64,
    pub version: &'static str,
    pub server_engine: &'static str,
}

#[derive(Debug, Deserialize)]
pub struct RedeemRequest {
    pub prize_id: String,
    pub user_tickets: usize,
}

#[derive(Debug, Serialize)]
pub struct RedeemResponse {
    pub success: bool,
    pub message: String,
    pub prize_name: Option<String>,
    pub remaining_tickets: usize,
}

fn get_catalog_games() -> Vec<GameInfo> {
    vec![
        GameInfo {
            id: "canicas".into(),
            title: "Canicas Mexicanas 3D".into(),
            subtitle: "Feria de Clavos & Patio de Tierra".into(),
            icon: "🔮".into(),
            category: "Destreza & Puntería".into(),
            tech: vec!["Multijugador".into(), "Física 3D".into()],
            repo_url: "https://canicas.onrender.com".into(),
            play_url: "https://canicas.onrender.com".into(),
            description: "Tablero tradicional de feria con 56 clavos de latón, hoyitos de puntaje y modos de patio (El Círculo y La Hoyita).".into(),
        },
        GameInfo {
            id: "rayuela".into(),
            title: "Rayuela Mexicana".into(),
            subtitle: "El Cajón de Barro & Tirada a la Raya".into(),
            icon: "🪙".into(),
            category: "Destreza & Puntería".into(),
            tech: vec!["Multijugador".into(), "Física 2.5D".into(), "Foto-Finish".into()],
            repo_url: "https://github.com/pinguxx/rayuela".into(),
            play_url: "https://rayuela-tgrr.onrender.com".into(),
            description: "Juego tradicional de precisión con monedas arrojadas en arco parabólico hacia el cajón de arcilla húmeda con cámara foto-finish.".into(),
        },
        GameInfo {
            id: "basta".into(),
            title: "Basta Online".into(),
            subtitle: "Stop / Tutti Frutti Tradicional".into(),
            icon: "✏️".into(),
            category: "Palabras & Mente".into(),
            tech: vec!["Multijugador".into(), "Bots".into()],
            repo_url: "https://basta-azbj.onrender.com".into(),
            play_url: "https://basta-azbj.onrender.com".into(),
            description: "Clásico juego de agilidad mental con cuaderno escolar, bots divertidos y votación de palabras.".into(),
        },
        GameInfo {
            id: "conquian".into(),
            title: "Conquián Mexicano".into(),
            subtitle: "Rummy Tradicional de 2 a 6 Jugadores".into(),
            icon: "🃏".into(),
            category: "Tablero & Cartas".into(),
            tech: vec!["2–6 Jugadores".into(), "Baraja Española".into(), "¡Obligado!".into()],
            repo_url: "https://github.com/pinguxx/conquian".into(),
            play_url: "https://conquian-31gh.onrender.com".into(),
            description: "El antepasado del Rummy jugado con Baraja Española de 40 cartas, tercias, corridas, ¡Obligado! y pozo acumulado en Tablas.".into(),
        },
        GameInfo {
            id: "loteria".into(),
            title: "Lotería Mexicana".into(),
            subtitle: "Tablas, Frijolitos y Gritón".into(),
            icon: "🎴".into(),
            category: "¡Lotería Tradicional!".into(),
            tech: vec!["54 Cartas".into(), "Cantador".into()],
            repo_url: "https://loteria-zhet.onrender.com".into(),
            play_url: "https://loteria-zhet.onrender.com".into(),
            description: "¡Corre y se va! Las 54 cartas oficiales, frijolitos para marcar, cantador automático y multijugador sincronizado.".into(),
        },
        GameInfo {
            id: "pirinola".into(),
            title: "La Pirinola".into(),
            subtitle: "Toma Todo & Pozo de Fichas".into(),
            icon: "🌀".into(),
            category: "Toma Todo & Azar".into(),
            tech: vec!["Física 3D".into(), "Apuestas".into()],
            repo_url: "https://pirinola.onrender.com".into(),
            play_url: "https://pirinola.onrender.com".into(),
            description: "Giro físico en 3D de pirinola de 6 caras con pozo central de monedas y apuestas comunitarias en vivo.".into(),
        },
        GameInfo {
            id: "shoots_ladders".into(),
            title: "Serpientes y Escaleras".into(),
            subtitle: "El Tablero de 100 Casillas".into(),
            icon: "🐍".into(),
            category: "Tablero Familiar".into(),
            tech: vec!["100 Casillas".into(), "Dados 3D".into()],
            repo_url: "https://shoots-ladders.onrender.com".into(),
            play_url: "https://shoots-ladders.onrender.com".into(),
            description: "Ascensos por escaleras de madera y resbalones en víboras sobre el legendario tablero ilustrado de 100 casillas.".into(),
        },
        GameInfo {
            id: "oca".into(),
            title: "El Juego de la Oca".into(),
            subtitle: "De Oca a Oca y Tiro Porque Me Toca".into(),
            icon: "🪿".into(),
            category: "Clásico de Mesa".into(),
            tech: vec!["63 Casillas".into(), "Dados Dobles".into()],
            repo_url: "https://oca-ox87.onrender.com".into(),
            play_url: "https://oca-ox87.onrender.com".into(),
            description: "Espiral clásica de 63 casillas con el puente, la posada, el pozo, el laberinto, la cárcel y la calavera.".into(),
        },
    ]
}

fn get_prizes_list() -> Vec<PrizeInfo> {
    vec![
        PrizeInfo {
            id: "puerquito".into(),
            name: "Alcancía de Puerquito de Yeso".into(),
            icon: "🐷".into(),
            cost: 5,
            phrase: "¡A romperla cuando esté llena!".into(),
        },
        PrizeInfo {
            id: "luchador".into(),
            name: "Luchador con Rebabas de Plástico".into(),
            icon: "🤼".into(),
            cost: 10,
            phrase: "¡El Santo contra las momias!".into(),
        },
        PrizeInfo {
            id: "algodon".into(),
            name: "Algodón de Azúcar Rosa".into(),
            icon: "🍭".into(),
            cost: 15,
            phrase: "¡Dulce y esponjoso de feria!".into(),
        },
        PrizeInfo {
            id: "pajarito".into(),
            name: "Silbato de Pajarito con Agua".into(),
            icon: "🐦".into(),
            cost: 20,
            phrase: "¡Póngale agua para que trine!".into(),
        },
        PrizeInfo {
            id: "trompo".into(),
            name: "Trompo de Madera con Piola".into(),
            icon: "🪀".into(),
            cost: 25,
            phrase: "¡Sáquelo a bailar en la uña!".into(),
        },
    ]
}

pub fn app_router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health_handler))
        .route("/api/games", get(games_handler))
        .route("/api/prizes", get(prizes_handler))
        .route("/api/stats", get(stats_handler))
        .route("/api/redeem", post(redeem_handler))
        .route("/api/passport/quick", post(create_quick_passport_handler))
        .route("/api/passport/{id}", get(get_passport_handler))
        .route("/api/passport/pin", post(set_pin_handler))
        .route("/api/passport/login", post(login_pin_handler))
        .route("/api/rewards/award", post(award_rewards_handler))
        .route("/api/passport/redeem", post(passport_redeem_handler))
        .route("/api/leaderboard", get(global_leaderboard_handler))
        .route("/api/leaderboard/{game_id}", get(game_leaderboard_handler))
        .route("/ws", get(ws_handler))
        .fallback_service(ServeDir::new("public"))
        .with_state(state)
}

async fn health_handler() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "ok",
        "app": "la-feria",
        "version": env!("CARGO_PKG_VERSION"),
        "language": "Rust",
        "framework": "Axum 0.8 + Tokio",
    }))
}

async fn games_handler() -> impl IntoResponse {
    Json(get_catalog_games())
}

async fn prizes_handler() -> impl IntoResponse {
    Json(get_prizes_list())
}

async fn stats_handler(State(state): State<AppState>) -> impl IntoResponse {
    let stats = StatsResponse {
        active_visitors: state.visitors_count.load(Ordering::Relaxed),
        total_tickets_redeemed: state.tickets_redeemed.load(Ordering::Relaxed),
        uptime_seconds: state.start_time.elapsed().as_secs(),
        version: env!("CARGO_PKG_VERSION"),
        server_engine: "Rust (Axum + Tokio + WebSockets)",
    };
    Json(stats)
}

async fn redeem_handler(
    State(state): State<AppState>,
    Json(payload): Json<RedeemRequest>,
) -> impl IntoResponse {
    let prizes = get_prizes_list();
    if let Some(prize) = prizes.into_iter().find(|p| p.id == payload.prize_id) {
        if payload.user_tickets >= prize.cost {
            state.tickets_redeemed.fetch_add(1, Ordering::Relaxed);
            let remaining = payload.user_tickets - prize.cost;

            // Broadcast celebration to all fair visitors
            let announcement = format!(
                "🎉 ¡Alguien acaba de canjear: {}! «{}»",
                prize.name, prize.phrase
            );
            let _ = state.tx.send(announcement);

            return (
                StatusCode::OK,
                Json(RedeemResponse {
                    success: true,
                    message: prize.phrase,
                    prize_name: Some(prize.name),
                    remaining_tickets: remaining,
                }),
            );
        } else {
            return (
                StatusCode::BAD_REQUEST,
                Json(RedeemResponse {
                    success: false,
                    message: "No tienes suficientes boletos para este premio.".into(),
                    prize_name: None,
                    remaining_tickets: payload.user_tickets,
                }),
            );
        }
    }

    (
        StatusCode::NOT_FOUND,
        Json(RedeemResponse {
            success: false,
            message: "Premio no encontrado en el catálogo de feria.".into(),
            prize_name: None,
            remaining_tickets: payload.user_tickets,
        }),
    )
}

#[derive(Debug, Deserialize)]
pub struct QuickPassportRequest {
    pub nickname: String,
    pub avatar: String,
}

#[derive(Debug, Deserialize)]
pub struct SetPinRequest {
    pub id: String,
    pub pin: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginPinRequest {
    pub nickname: String,
    pub pin: String,
}

#[derive(Debug, Deserialize)]
pub struct AwardRewardRequest {
    pub passport_id: String,
    pub game_id: String,
    pub coins: i64,
    pub tickets: i64,
    pub score: i64,
    pub note: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct PassportRedeemRequest {
    pub passport_id: String,
    pub prize_id: String,
}

async fn create_quick_passport_handler(
    State(state): State<AppState>,
    Json(payload): Json<QuickPassportRequest>,
) -> Result<Json<db::Passport>, (StatusCode, String)> {
    state
        .db
        .create_guest_passport(&payload.nickname, &payload.avatar)
        .map(Json)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))
}

async fn get_passport_handler(
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<db::Passport>, StatusCode> {
    match state.db.get_passport(&id) {
        Ok(Some(p)) => Ok(Json(p)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn set_pin_handler(
    State(state): State<AppState>,
    Json(payload): Json<SetPinRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if payload.pin.len() < 4 {
        return Err((
            StatusCode::BAD_REQUEST,
            "El PIN debe tener al menos 4 dígitos".into(),
        ));
    }
    match state.db.set_pin(&payload.id, &payload.pin) {
        Ok(true) => Ok(Json(serde_json::json!({ "success": true }))),
        Ok(false) => Err((StatusCode::NOT_FOUND, "Pasaporte no encontrado".into())),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

async fn login_pin_handler(
    State(state): State<AppState>,
    Json(payload): Json<LoginPinRequest>,
) -> Result<Json<db::Passport>, (StatusCode, String)> {
    match state.db.login_with_pin(&payload.nickname, &payload.pin) {
        Ok(Some(p)) => Ok(Json(p)),
        Ok(None) => Err((StatusCode::UNAUTHORIZED, "Apodo o PIN incorrecto".into())),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

async fn award_rewards_handler(
    State(state): State<AppState>,
    Json(payload): Json<AwardRewardRequest>,
) -> Result<Json<db::Passport>, (StatusCode, String)> {
    match state.db.award_rewards(
        &payload.passport_id,
        &payload.game_id,
        payload.coins,
        payload.tickets,
        payload.score,
        payload.note.as_deref(),
    ) {
        Ok(Some(p)) => {
            let announcement = format!(
                "🏆 ¡{} acaba de ganar 🪙 +{} monedas y 🎫 +{} boletos en {}!",
                p.nickname, payload.coins, payload.tickets, payload.game_id
            );
            let _ = state.tx.send(announcement);
            Ok(Json(p))
        }
        Ok(None) => Err((StatusCode::NOT_FOUND, "Pasaporte no encontrado".into())),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

async fn passport_redeem_handler(
    State(state): State<AppState>,
    Json(payload): Json<PassportRedeemRequest>,
) -> Result<Json<db::Passport>, (StatusCode, String)> {
    let prizes = get_prizes_list();
    let Some(prize) = prizes.into_iter().find(|p| p.id == payload.prize_id) else {
        return Err((StatusCode::NOT_FOUND, "Premio no encontrado".into()));
    };

    match state.db.redeem_prize_for_passport(
        &payload.passport_id,
        &payload.prize_id,
        prize.cost as i64,
    ) {
        Ok(Ok(p)) => {
            let announcement = format!(
                "🎁 ¡{} acaba de canjear: {}! «{}»",
                p.nickname, prize.name, prize.phrase
            );
            let _ = state.tx.send(announcement);
            Ok(Json(p))
        }
        Ok(Err(msg)) => Err((StatusCode::BAD_REQUEST, msg.into())),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

async fn global_leaderboard_handler(
    State(state): State<AppState>,
) -> Result<Json<Vec<db::LeaderboardEntry>>, (StatusCode, String)> {
    state
        .db
        .get_global_leaderboard(20)
        .map(Json)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))
}

async fn game_leaderboard_handler(
    State(state): State<AppState>,
    axum::extract::Path(game_id): axum::extract::Path<String>,
) -> Result<Json<Vec<db::GameLeaderboardEntry>>, (StatusCode, String)> {
    state
        .db
        .get_game_leaderboard(&game_id, 20)
        .map(Json)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))
}

async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> Response {
    ws.on_upgrade(move |socket| handle_ws(socket, state))
}

async fn handle_ws(socket: WebSocket, state: AppState) {
    let (mut sender, mut receiver) = socket.split();
    state.visitors_count.fetch_add(1, Ordering::Relaxed);

    let mut rx = state.tx.subscribe();

    // Welcome message to this client
    let welcome = serde_json::json!({
        "type": "welcome",
        "message": "¡Bienvenido a La Feria Virtual Mexicana!",
        "active_visitors": state.visitors_count.load(Ordering::Relaxed),
    });
    if sender
        .send(Message::Text(welcome.to_string().into()))
        .await
        .is_err()
    {
        state.visitors_count.fetch_sub(1, Ordering::Relaxed);
        return;
    }

    // Broadcast new visitor to everyone
    let join_announcement = serde_json::json!({
        "type": "visitor_joined",
        "active_visitors": state.visitors_count.load(Ordering::Relaxed),
    });
    let _ = state.tx.send(join_announcement.to_string());

    // Task for forwarding broadcast messages to client
    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg.into())).await.is_err() {
                break;
            }
        }
    });

    // Task for receiving client messages (e.g. shouts, clicks)
    let tx_clone = state.tx.clone();
    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            if let Message::Text(text) = msg {
                if let Ok(val) = serde_json::from_str::<serde_json::Value>(&text) {
                    if val.get("type").and_then(|t| t.as_str()) == Some("shout") {
                        if let Some(shout_text) = val.get("text").and_then(|t| t.as_str()) {
                            let broadcast_msg = serde_json::json!({
                                "type": "fair_shout",
                                "text": shout_text,
                            });
                            let _ = tx_clone.send(broadcast_msg.to_string());
                        }
                    }
                }
            }
        }
    });

    // Wait until either task ends
    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    };

    state.visitors_count.fetch_sub(1, Ordering::Relaxed);
    let leave_announcement = serde_json::json!({
        "type": "visitor_left",
        "active_visitors": state.visitors_count.load(Ordering::Relaxed),
    });
    let _ = state.tx.send(leave_announcement.to_string());
}

#[tokio::main]
async fn main() {
    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(3000);

    let db_path = std::env::var("DATABASE_PATH").unwrap_or_else(|_| "feria.db".to_string());
    let db = Database::new(&db_path).expect("Error al inicializar la base de datos de La Feria");

    let (tx, _rx) = broadcast::channel(128);
    let state = AppState {
        visitors_count: Arc::new(AtomicUsize::new(0)),
        tickets_redeemed: Arc::new(AtomicUsize::new(0)),
        tx,
        start_time: Instant::now(),
        db,
    };

    let app = app_router(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!(
        "🎪 Servidor de La Feria corriendo en Rust (Axum + Tokio) en http://{}",
        addr
    );

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::Request;
    use tower::ServiceExt;

    fn test_state() -> AppState {
        let (tx, _) = broadcast::channel(16);
        let db = Database::new_in_memory().unwrap();
        AppState {
            visitors_count: Arc::new(AtomicUsize::new(0)),
            tickets_redeemed: Arc::new(AtomicUsize::new(0)),
            tx,
            start_time: Instant::now(),
            db,
        }
    }

    #[tokio::test]
    async fn test_health_endpoint() {
        let app = app_router(test_state());

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .body(axum::body::Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_catalog_endpoint() {
        let app = app_router(test_state());

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/games")
                    .body(axum::body::Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_passport_and_rewards_flow() {
        let app = app_router(test_state());

        // 1. Create quick guest passport
        let req_body = serde_json::json!({
            "nickname": "CharroTest",
            "avatar": "🤼"
        });

        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/passport/quick")
                    .header("content-type", "application/json")
                    .body(axum::body::Body::from(req_body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body_bytes = axum::body::to_bytes(response.into_body(), 1024 * 16).await.unwrap();
        let passport: db::Passport = serde_json::from_slice(&body_bytes).unwrap();
        assert_eq!(passport.nickname, "CharroTest");
        assert_eq!(passport.coins, 50);

        // 2. Award rewards
        let award_body = serde_json::json!({
            "passport_id": passport.id,
            "game_id": "rayuela",
            "coins": 20,
            "tickets": 3,
            "score": 100,
            "note": "Tiro perfecto en la raya"
        });

        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/rewards/award")
                    .header("content-type", "application/json")
                    .body(axum::body::Body::from(award_body.to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body_bytes = axum::body::to_bytes(response.into_body(), 1024 * 16).await.unwrap();
        let updated: db::Passport = serde_json::from_slice(&body_bytes).unwrap();
        assert_eq!(updated.coins, 70);
        assert_eq!(updated.tickets, 8);

        // 3. Leaderboard
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/leaderboard")
                    .body(axum::body::Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body_bytes = axum::body::to_bytes(response.into_body(), 1024 * 16).await.unwrap();
        let leaderboard: Vec<db::LeaderboardEntry> = serde_json::from_slice(&body_bytes).unwrap();
        assert_eq!(leaderboard.len(), 1);
        assert_eq!(leaderboard[0].nickname, "CharroTest");
    }
}
