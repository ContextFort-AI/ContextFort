// Click Detection SDK - Main daemon and API server

use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use click_detection_sdk::{Detector, Stats};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

#[derive(Clone)]
struct AppState {
    detector: Arc<Detector>,
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    println!("🔍 Click Detection SDK v0.1.0");
    println!("==============================\n");

    // Create detector
    let detector = Arc::new(Detector::new().expect("Failed to create detector"));
    let state = AppState { detector };

    println!("✓ Detector initialized");

    // TODO: Start OS monitor in separate thread
    println!("⚠️  OS monitor not started (requires native integration)");
    println!("   Run native monitor separately for full functionality\n");

    // Build API router
    let app = Router::new()
        .route("/", get(root))
        .route("/api/health", get(health))
        .route("/api/stats", get(get_stats))
        .route("/api/events/os", post(record_os_click))
        .route("/api/events/dom", post(record_dom_click))
        .layer(CorsLayer::new().allow_origin(Any))
        .with_state(state);

    let addr = "127.0.0.1:9999";
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind");

    println!("🚀 API server listening on http://{}", addr);
    println!("\nAPI Endpoints:");
    println!("  GET  /api/health       - Health check");
    println!("  GET  /api/stats        - Get statistics");
    println!("  POST /api/events/os    - Record OS click");
    println!("  POST /api/events/dom   - Record DOM click\n");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}

// Root endpoint
async fn root() -> &'static str {
    "Click Detection SDK API v0.1.0\nSee /api/health for status"
}

// Health check
async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        version: "0.1.0".to_string(),
    })
}

// Get statistics
async fn get_stats(State(state): State<AppState>) -> Json<Stats> {
    Json(state.detector.get_stats())
}

// Record OS click
async fn record_os_click(
    State(state): State<AppState>,
    Json(payload): Json<ClickPayload>,
) -> StatusCode {
    state.detector.record_os_click(payload.x, payload.y, payload.timestamp);
    StatusCode::OK
}

// Record DOM click and check correlation
async fn record_dom_click(
    State(state): State<AppState>,
    Json(payload): Json<ClickPayload>,
) -> Json<DomClickResponse> {
    let result = state.detector.record_dom_click(payload.x, payload.y, payload.timestamp);

    Json(DomClickResponse {
        is_suspicious: result.is_suspicious,
        confidence: result.confidence,
        reason: result.reason,
    })
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
}

#[derive(Deserialize)]
struct ClickPayload {
    x: f64,
    y: f64,
    timestamp: f64,
}

#[derive(Serialize)]
struct DomClickResponse {
    is_suspicious: bool,
    confidence: f64,
    reason: Option<String>,
}
