//! Fake metrics: RAM/CPU/FPS numbers that get WORSE with each
//! "optimization", displayed as wins. Randomized within bounds,
//! monotonically worsening.

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Metrics {
    pub ram_usage_percent: f64,
    pub cpu_load_percent: f64,
    pub fps: f64,
    pub boots_required: u32,
    pub optimization_runs: u32,
}

/// Baseline "before" state: suspiciously healthy.
pub fn baseline() -> Metrics {
    Metrics {
        ram_usage_percent: 22.0,
        cpu_load_percent: 5.0,
        fps: 240.0,
        boots_required: 0,
        optimization_runs: 0,
    }
}

/// Advance the metrics after one optimization run. Every value moves the
/// wrong way, randomized within bounds, strictly never improving a
/// previous value (floors keep the order strict at the extremes).
pub fn worsen(prev: &Metrics) -> Metrics {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    // +0.1..3.0%: strictly increasing even after hitting the ceiling
    let ram = (prev.ram_usage_percent + rng.gen_range(0.1..3.0)).min(99.9);
    let cpu = (prev.cpu_load_percent + rng.gen_range(0.1..2.0)).min(99.9);
    // -0.1..2.0: strictly decreasing even at the floor
    let fps = (prev.fps - rng.gen_range(0.1..2.0)).max(1.0);
    let boots = prev.boots_required + 1;
    Metrics {
        ram_usage_percent: ram,
        cpu_load_percent: cpu,
        fps,
        boots_required: boots,
        optimization_runs: prev.optimization_runs + 1,
    }
}
