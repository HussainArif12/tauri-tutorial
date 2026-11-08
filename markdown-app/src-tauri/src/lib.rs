// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod file_management;
mod menu_bar;
use file_management::read_file;
use file_management::write_file;
use menu_bar::setup_menubar;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            setup_menubar(app.handle())?;
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, read_file, write_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
