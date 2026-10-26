// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod window_utils;
use std::sync::Mutex;
use std::fs::File;
use std::io::Write;
use window_utils::quit;

#[derive(Default)]
struct AppState {
    counter: i32,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn add(num1: i32, num2: i32) -> i32 {
    num1 + num2
}

#[tauri::command]
fn increment_counter(state: tauri::State<Mutex<AppState>>) -> i32 {
    let mut state = state.lock().unwrap();
    state.counter += 1;
    state.counter
}

#[tauri::command]
fn get_counter_value(state: tauri::State<Mutex<AppState>>) -> i32 {
    let state = state.lock().unwrap();
    state.counter
}


#[tauri::command]
fn save_file(path: String) -> Result<(), String> {
    println!("Saving file to path: {}", path);

    let mut file = File::create(&path).map_err(|error| error.to_string())?;
    writeln!(&mut file, "Hello world \n This was written by a virus").map_err(|error| error.to_string())?;
    println!("Saved successfully!");
    Ok(())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .manage(Mutex::new(AppState { counter: 0 }))
        .invoke_handler(tauri::generate_handler![
            greet,
            add,
            increment_counter,
            get_counter_value,
            quit,
            save_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
