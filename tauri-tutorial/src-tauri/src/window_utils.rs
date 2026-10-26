use tauri;

#[tauri::command]
pub fn quit(app: tauri::AppHandle) {
    app.exit(0);
}