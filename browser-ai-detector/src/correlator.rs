// Correlation engine - matches OS clicks with DOM clicks

use crate::events::{Click, DetectionResult};
use std::collections::VecDeque;

pub struct Correlator {
    // Configuration
    time_window_ms: f64,      // Time window to search for matching clicks
    position_tolerance_px: f64, // Position tolerance in pixels
}

impl Correlator {
    pub fn new() -> Self {
        Self {
            time_window_ms: 100.0,  // 100ms window
            position_tolerance_px: 20.0, // 20px tolerance
        }
    }

    /// Correlate a DOM click with recent OS clicks
    pub fn correlate(&self, dom_click: &Click, os_clicks: &VecDeque<Click>) -> DetectionResult {
        // Search for matching OS click
        let time_window_sec = self.time_window_ms / 1000.0;

        for os_click in os_clicks.iter().rev() {
            // Check time window
            let time_diff = (dom_click.timestamp - os_click.timestamp).abs();
            if time_diff > time_window_sec {
                // Too old, stop searching
                break;
            }

            // Check position
            let distance = ((dom_click.x - os_click.x).powi(2) +
                           (dom_click.y - os_click.y).powi(2)).sqrt();

            if distance <= self.position_tolerance_px {
                // Found a match!
                return DetectionResult::legitimate(os_click.clone());
            }
        }

        // No matching OS click found - suspicious!
        let reason = if os_clicks.is_empty() {
            "No OS clicks recorded".to_string()
        } else {
            format!(
                "No OS click within {}ms and {}px",
                self.time_window_ms,
                self.position_tolerance_px
            )
        };

        DetectionResult::suspicious(reason, 0.9)
    }

    /// Set time window in milliseconds
    pub fn set_time_window(&mut self, ms: f64) {
        self.time_window_ms = ms;
    }

    /// Set position tolerance in pixels
    pub fn set_position_tolerance(&mut self, px: f64) {
        self.position_tolerance_px = px;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::events::ClickSource;

    #[test]
    fn test_matching_click() {
        let correlator = Correlator::new();
        let mut os_clicks = VecDeque::new();

        // Add OS click
        os_clicks.push_back(Click {
            source: ClickSource::OS,
            x: 100.0,
            y: 200.0,
            timestamp: 1000.0,
            button: 0,
        });

        // DOM click at same position shortly after
        let dom_click = Click {
            source: ClickSource::DOM,
            x: 105.0,
            y: 205.0,
            timestamp: 1000.05, // 50ms later
            button: 0,
        };

        let result = correlator.correlate(&dom_click, &os_clicks);
        assert!(!result.is_suspicious);
    }

    #[test]
    fn test_suspicious_click_no_os() {
        let correlator = Correlator::new();
        let os_clicks = VecDeque::new(); // Empty

        let dom_click = Click {
            source: ClickSource::DOM,
            x: 100.0,
            y: 200.0,
            timestamp: 1000.0,
            button: 0,
        };

        let result = correlator.correlate(&dom_click, &os_clicks);
        assert!(result.is_suspicious);
    }

    #[test]
    fn test_suspicious_click_wrong_position() {
        let correlator = Correlator::new();
        let mut os_clicks = VecDeque::new();

        os_clicks.push_back(Click {
            source: ClickSource::OS,
            x: 100.0,
            y: 200.0,
            timestamp: 1000.0,
            button: 0,
        });

        // DOM click far away
        let dom_click = Click {
            source: ClickSource::DOM,
            x: 500.0,
            y: 600.0,
            timestamp: 1000.05,
            button: 0,
        };

        let result = correlator.correlate(&dom_click, &os_clicks);
        assert!(result.is_suspicious);
    }
}
