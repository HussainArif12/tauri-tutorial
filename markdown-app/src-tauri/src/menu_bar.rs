use tauri::{
    AppHandle,
    menu::{MenuBuilder, SubmenuBuilder, MenuItemBuilder},
    Emitter
};

#[tauri::command]
pub fn setup_menubar(app: &AppHandle) -> tauri::Result<()> {
    let open = MenuItemBuilder::with_id("open", "Open")
                .accelerator("CmdOrCtrl+O")
                .build(app)?;
    let save = MenuItemBuilder::with_id("save", "Save")
                .accelerator("CmdOrCtrl+S")
                .build(app)?;
    let save_as = MenuItemBuilder::with_id("save_as", "Save")
                .accelerator("CmdOrCtrl+Shift+S")
                .build(app)?;
    let exit = MenuItemBuilder::with_id("exit", "Exit")
                .accelerator("CmdOrCtrl+Q")
                .build(app)?;
    let file_menu = SubmenuBuilder::new(app, "File")
                    .items(&[&open, &save, &save_as, &exit])
                    .build()?;
    
    let menu = MenuBuilder::new(app).item(&file_menu).build()?;
    app.set_menu(menu)?;

    app.on_menu_event(move |app_handle : &AppHandle, event| {
        app_handle.emit("menu-event", event).unwrap()
    });

    Ok(())
}