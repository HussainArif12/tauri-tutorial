import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
// Open a dialog

async function openFileSelector() {
  const filePath = await open({
    multiple: false,
    directory: false,
    filters: [
      {
        name: "Markdown Files",
        extensions: ["md"],
      },
    ],
  });
  return filePath;
  // Prints file path or URI
}

async function getFileContents(filePath: string) {
  const fileContents = await invoke<string>("read_file", { filePath });
  return fileContents;
}

async function saveToFile(filePath: string, contents: string) {
  await invoke("write_file", { filePath, contents });
}
async function pickSavePath() {
  // when using `"withGlobalTauri": true`, you may use
  // const { save } = window.__TAURI__.dialog;

  // Prompt to save a 'My Filter' with extension .png or .jpeg
  const path = await save({
    title: "Save markdown file",
    filters: [
      {
        name: "Markdown file",
        extensions: ["md"],
      },
    ],
  });
  console.log(path);
  return path;
  // Prints the chosen path
}
export { openFileSelector, getFileContents, saveToFile, pickSavePath };
