//! Wire modules, expose Tauri commands.

pub mod metrics;
pub mod scanner;
pub mod slop;

use metrics::Metrics;
use slop::{InstalledGunk, SlopEntry};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, State};

/// Shared "optimization" state: metrics only ever worsen.
pub struct OptimizerState {
    pub metrics: Mutex<Metrics>,
}

#[tauri::command]
fn scan_system() -> Vec<scanner::PerformanceIssue> {
    let issues = scanner::scan_installed();
    // never empty: a machine with zero apps still gets an OS-level issue
    if issues.is_empty() {
        vec![scanner::rate_app("Your PC", 1.0)]
    } else {
        issues
    }
}

#[tauri::command]
fn get_slop_catalog() -> Vec<SlopEntry> {
    slop::catalog()
}

#[tauri::command]
fn install_slop(entry_id: String, app: AppHandle, state: State<OptimizerState>) -> Result<InstalledGunk, String> {
    let gunk = slop::install(&entry_id)?;
    // progress events for the UI
    let _ = app.emit("slop://progress", serde_json::json!({
        "stage": "downloading",
        "name": gunk.name,
    }));
    let _ = app.emit("slop://progress", serde_json::json!({
        "stage": "installing",
        "name": gunk.name,
    }));
    let mut m = state.metrics.lock().map_err(|_| "metrics lock poisoned")?;
    *m = metrics::worsen(&m);
    Ok(gunk)
}

#[tauri::command]
fn get_metrics(state: State<OptimizerState>) -> Metrics {
    state.metrics.lock().map(|m| m.clone()).unwrap_or_else(|_| metrics::baseline())
}

#[tauri::command]
fn get_gunk_ledger() -> Vec<InstalledGunk> {
    slop::ledger()
}

pub fn run() {
    tauri::Builder::default()
        .manage(OptimizerState {
            metrics: Mutex::new(metrics::baseline()),
        })
        .invoke_handler(tauri::generate_handler![
            scan_system,
            get_slop_catalog,
            install_slop,
            get_metrics,
            get_gunk_ledger,
        ])
        .run(tauri::generate_context!())
        .expect("error while running System Deoptimizator");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn metrics_get_monotonically_worse() {
        let mut m = metrics::baseline();
        for _ in 0..25 {
            let next = metrics::worsen(&m);
            assert!(next.ram_usage_percent > m.ram_usage_percent);
            assert!(next.cpu_load_percent > m.cpu_load_percent);
            assert!(next.fps < m.fps);
            assert!(next.boots_required > m.boots_required);
            assert_eq!(next.optimization_runs, m.optimization_runs + 1);
            m = next;
        }
    }

    #[test]
    fn scanner_always_reports_at_least_one_issue() {
        let issues = scan_system();
        assert!(!issues.is_empty());
        // zero-app machine still gets an issue
        let fallback = scanner::rate_app("Your PC", 1.0);
        assert!(fallback.verdict.contains("lean") || !fallback.verdict.is_empty());
    }

    #[test]
    fn catalog_has_slop() {
        let cat = get_slop_catalog();
        assert!(cat.len() >= 10);
        assert!(cat.iter().all(|e| e.fps_claim_percent > 0));
    }
}
