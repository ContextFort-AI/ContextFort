// Event types for click detection

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ClickSource {
    OS,  // From OS-level input monitor
    DOM, // From browser DOM events
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Click {
    pub source: ClickSource,
    pub x: f64,
    pub y: f64,
    pub timestamp: f64,
    pub button: u8, // 0=left, 1=middle, 2=right
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectionResult {
    pub is_suspicious: bool,
    pub confidence: f64, // 0.0 to 1.0
    pub reason: Option<String>,
    pub matched_os_click: Option<Click>,
}

impl DetectionResult {
    pub fn legitimate(matched_click: Click) -> Self {
        Self {
            is_suspicious: false,
            confidence: 1.0,
            reason: None,
            matched_os_click: Some(matched_click),
        }
    }

    pub fn suspicious(reason: String, confidence: f64) -> Self {
        Self {
            is_suspicious: true,
            confidence,
            reason: Some(reason),
            matched_os_click: None,
        }
    }
}
