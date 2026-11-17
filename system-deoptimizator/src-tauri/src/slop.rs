//! Slop catalog + installer. No real downloads, no real registry writes —
//! installation is simulated and recorded in a local JSON "gunk ledger"
//! that is never, ever cleaned.

use rand::seq::SliceRandom;
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize)]
pub struct SlopEntry {
    pub id: &'static str,
    pub name: String,
    /// joke size in MB
    pub size_mb: f64,
    /// fake download URL — never fetched
    pub download_url: String,
    /// the "+X% FPS" claim on the box
    pub fps_claim_percent: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstalledGunk {
    pub entry_id: String,
    pub name: String,
    pub startup_entry: String,
    pub tray_icon: String,
    pub installed_at: String,
}

/// Static catalog of the classic 2009 download.com experience.
pub fn catalog() -> Vec<SlopEntry> {
    let mk = |id: &'static str, name: &str, size: f64, claim: u32| SlopEntry {
        id,
        name: name.to_string(),
        size_mb: size,
        download_url: format!("http://download.example.com/2009/{}.exe", id),
        fps_claim_percent: claim,
    };
    vec![
        mk("yandex-browser", "Yandex Browser", 187.0, 15),
        mk("amigo", "Amigo Browser (Mail.ru)", 154.0, 12),
        mk("mailru-sputnik", "Mail.ru Sputnik", 43.0, 8),
        mk("wot-launcher", "World of Tanks Launcher", 3200.0, 25),
        mk("ask-toolbar", "Ask Toolbar", 12.0, 5),
        mk("driver-booster", "Driver Booster 2009", 96.0, 18),
        mk("game-booster", "Game Fire Booster PRO", 74.0, 22),
        mk("speedup-pc", "SpeedUpMyPC Ultra", 58.0, 30),
        mk("registry-cleaner", "Registry Cleaner Deluxe", 21.0, 9),
        mk("weather-widget", "Weather Desktop Widget", 35.0, 3),
    ]
}

fn ledger_path() -> PathBuf {
    // gunk ledger: local JSON, never cleaned
    PathBuf::from("gunk_ledger.json")
}

fn now_iso() -> String {
    // No chrono dep: uuid timestamp gives a unique-enough marker.
    uuid::Uuid::new_v4().to_string()
}

/// "Install" one slop entry: simulate download+install, append to the
/// gunk ledger. Returns the fake startup entry + tray icon created.
pub fn install(entry_id: &str) -> Result<InstalledGunk, String> {
    let cat = catalog();
    let entry = cat
        .iter()
        .find(|e| e.id == entry_id)
        .ok_or_else(|| format!("unknown slop entry: {}", entry_id))?;

    // simulate download+install
    let mut rng = rand::thread_rng();
    let _dl_ms = rng.gen_range(800..3000);

    let gunk = InstalledGunk {
        entry_id: entry.id.to_string(),
        name: entry.name.clone(),
        startup_entry: format!("HKCU\\Run\\{} Helper (always)", entry.id),
        tray_icon: format!("{}_tray.dll", entry.id),
        installed_at: now_iso(),
    };

    append_ledger(&gunk)?;
    Ok(gunk)
}

fn append_ledger(gunk: &InstalledGunk) -> Result<(), String> {
    let path = ledger_path();
    let mut ledger: Vec<InstalledGunk> = match fs::read_to_string(&path) {
        Ok(txt) => serde_json::from_str(&txt).unwrap_or_default(),
        Err(_) => Vec::new(),
    };
    ledger.push(gunk.clone());
    fs::write(&path, serde_json::to_string_pretty(&ledger).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())
}

/// The gunk ledger never shrinks. For display.
pub fn ledger() -> Vec<InstalledGunk> {
    match fs::read_to_string(ledger_path()) {
        Ok(txt) => serde_json::from_str(&txt).unwrap_or_default(),
        Err(_) => Vec::new(),
    }
}

/// Pick a random slop entry id (for "Optimize all" one-click flows).
pub fn random_pick() -> &'static str {
    let cat = catalog();
    let mut rng = rand::thread_rng();
    cat.choose(&mut rng).map(|e| e.id).unwrap_or("ask-toolbar")
}
