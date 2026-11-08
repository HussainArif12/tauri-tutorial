use tauri;
use std::fs;

#[tauri::command]
pub fn read_file(file_path: &str)-> Result<String, String> {
    fs::read_to_string(file_path).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn write_file(file_path: &str, contents: &str) -> Result<(), String> {
    fs::write(file_path, contents).map_err(|error| error.to_string())
}