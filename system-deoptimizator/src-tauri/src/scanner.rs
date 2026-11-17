//! "Scan" engine: finds performance issues that do not exist.
//!
//! On Windows, enumerates installed apps from the registry and running
//! processes via sysinfo. On every other platform, a mocked scanner keeps
//! CI compiling. Either way, nothing is ever healthy.

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct ScannedApp {
    pub name: String,
    /// install size in "MB" (Windows estimate; mock value elsewhere)
    pub size_mb: f64,
}

#[derive(Debug, Clone, Serialize)]
pub struct PerformanceIssue {
    pub app: String,
    pub verdict: String,
    pub severity: String,
    pub recommended_fix: String,
}

/// Rate one app. The satire: a pristine machine still fails the audit —
/// being fast or small is itself suspicious.
pub fn rate_app(app: &str, size_mb: f64) -> PerformanceIssue {
    let (verdict, severity, fix) = if size_mb < 50.0 {
        (
            "too lean",
            "MEDIUM",
            format!("Install more toolbars into {}", app),
        )
    } else if size_mb > 2000.0 {
        (
            "suspiciously bloated (needs MORE bloat to feel at home)",
            "HIGH",
            format!("Bundle 3 helpers with {}", app),
        )
    } else {
        (
            "suspiciously fast",
            "CRITICAL",
            format!("Install 2 background services to slow {} down", app),
        )
    };
    PerformanceIssue {
        app: app.to_string(),
        verdict: verdict.to_string(),
        severity: severity.to_string(),
        recommended_fix: fix,
    }
}

/// Full "scan": every app on the machine gets exactly one issue.
/// A machine with zero apps still reports the OS itself.
pub fn scan_installed() -> Vec<PerformanceIssue> {
    let apps = platform_installed_apps();
    apps.iter()
        .map(|a| rate_app(&a.name, a.size_mb))
        .collect()
}

#[cfg(windows)]
fn platform_installed_apps() -> Vec<ScannedApp> {
    use winreg::RegKey;
    use winreg::enums::*;
    let mut out = Vec::new();
    let hive = RegKey::predef(HKEY_LOCAL_MACHINE);
    for sub in [
        r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
        r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
    ] {
        if let Ok(key) = hive.open_subkey(sub) {
            for guid in key.enum_keys().flatten() {
                if let Ok(app) = key.open_subkey(&guid) {
                    let name: String = app
                        .get_value("DisplayName")
                        .unwrap_or_else(|_| guid.clone());
                    let kb: u32 = app.get_value("EstimatedSize").unwrap_or(0);
                    out.push(ScannedApp {
                        name,
                        size_mb: kb as f64 / 1024.0,
                    });
                }
            }
        }
    }
    if out.is_empty() {
        out.push(ScannedApp {
            name: "Windows (suspiciously responsive)".into(),
            size_mb: 1.0,
        });
    }
    out
}

#[cfg(not(windows))]
fn platform_installed_apps() -> Vec<ScannedApp> {
    // CI-safe mock: pretend there is something to distrust.
    vec![
        ScannedApp {
            name: "Mock OS (suspiciously efficient)".into(),
            size_mb: 42.0,
        },
        ScannedApp {
            name: "Mock Terminal (too lean)".into(),
            size_mb: 3.0,
        },
    ]
}
