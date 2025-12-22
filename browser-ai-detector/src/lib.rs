// Click Detection SDK Core Library

use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

pub mod correlator;
pub mod events;

pub use correlator::Correlator;
pub use events::{Click, ClickSource, DetectionResult};

/// Main SDK detector
pub struct Detector {
    correlator: Arc<Mutex<Correlator>>,
    os_clicks: Arc<Mutex<VecDeque<Click>>>,
    dom_clicks: Arc<Mutex<VecDeque<Click>>>,
}

impl Detector {
    pub fn new() -> anyhow::Result<Self> {
        Ok(Self {
            correlator: Arc::new(Mutex::new(Correlator::new())),
            os_clicks: Arc::new(Mutex::new(VecDeque::new())),
            dom_clicks: Arc::new(Mutex::new(VecDeque::new())),
        })
    }

    /// Record an OS-level click (from native monitor)
    pub fn record_os_click(&self, x: f64, y: f64, timestamp: f64) {
        let click = Click {
            source: ClickSource::OS,
            x,
            y,
            timestamp,
            button: 0, // Default to left click
        };

        let mut os_clicks = self.os_clicks.lock().unwrap();
        os_clicks.push_back(click.clone());

        // Keep only last 1000 clicks
        if os_clicks.len() > 1000 {
            os_clicks.pop_front();
        }

        println!("[SDK] OS click recorded: x={:.1}, y={:.1}, time={:.3}", x, y, timestamp);
    }

    /// Record a DOM click (from browser)
    pub fn record_dom_click(&self, x: f64, y: f64, timestamp: f64) -> DetectionResult {
        let click = Click {
            source: ClickSource::DOM,
            x,
            y,
            timestamp,
            button: 0,
        };

        let mut dom_clicks = self.dom_clicks.lock().unwrap();
        dom_clicks.push_back(click.clone());

        if dom_clicks.len() > 1000 {
            dom_clicks.pop_front();
        }

        // Check for correlation
        let os_clicks = self.os_clicks.lock().unwrap();
        let correlator = self.correlator.lock().unwrap();
        let result = correlator.correlate(&click, &os_clicks);

        if result.is_suspicious {
            println!("[SDK] ⚠️  SUSPICIOUS DOM click: x={:.1}, y={:.1}, reason={:?}",
                     x, y, result.reason);
        } else {
            println!("[SDK] ✓ Legitimate DOM click: x={:.1}, y={:.1}", x, y);
        }

        result
    }

    /// Get statistics
    pub fn get_stats(&self) -> Stats {
        let os_clicks = self.os_clicks.lock().unwrap();
        let dom_clicks = self.dom_clicks.lock().unwrap();

        Stats {
            total_os_clicks: os_clicks.len(),
            total_dom_clicks: dom_clicks.len(),
            suspicious_clicks: 0, // TODO: track this
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Stats {
    pub total_os_clicks: usize,
    pub total_dom_clicks: usize,
    pub suspicious_clicks: usize,
}

pub fn get_current_timestamp() -> f64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs_f64()
}
