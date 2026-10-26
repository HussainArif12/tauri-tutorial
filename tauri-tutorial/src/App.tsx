import { invoke } from "@tauri-apps/api/core";
import { Image } from "@tauri-apps/api/image";
import { Menu, Submenu } from "@tauri-apps/api/menu";
import { TrayIcon, TrayIconOptions } from "@tauri-apps/api/tray";
import { open } from "@tauri-apps/plugin-dialog";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [counter, setCounter] = useState(0);
  const [result, setResult] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  async function addNumbers(num1: number, num2: number) {
    const result: number = await invoke("add", { num1, num2 });
    setResult(result);
  }
  async function incrementCounter() {
    const newCounter: number = await invoke("increment_counter");
    console.log(newCounter);
    setCounter(newCounter);
  }
  async function throwNotification() {
    const permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      await requestPermission();
    } else {
      sendNotification({
        title: "Tauri Notification",
        body: "This is a notification from Tauri!",
      });
    }
  }
  const openFolderDialog = async () => {
    const selectedFolder = await open({ directory: true });
    setSelectedFolder(selectedFolder);
  };
  const saveFile = async () => {
    if (selectedFolder) {
      const filePath = `${selectedFolder}/dummy.txt`;
      await invoke("save_file", { path: filePath });
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchCounter() {
      const initialCounter: number = await invoke("get_counter_value");
      setCounter(initialCounter);
    }
    async function setupTray() {
      const menu = await Menu.new({
        items: [
          {
            id: "quit",
            text: "Quit App",
            action: async () => {
              await invoke("quit");
            },
          },
        ],
      });
      const options: TrayIconOptions = {
        // here you can add a tray menu, title, tooltip, event handler, etc
        icon: await Image.fromPath("icons/icon.png"),
        id: "my-tray",
        menu,
        showMenuOnLeftClick: true,
      };

      !cancelled && (await TrayIcon.new(options));
    }

    async function createWindowMenu() {
      const lifeCycleSubmenu = await Submenu.new({
        text: "Lifecycle",
        items: [
          {
            id: "quit",
            text: "Quit App",
            action: async () => {
              await invoke("quit");
            },
          },
          {
            id: "Reload",
            text: "Reload",
            action: async () => {
              location.reload();
            },
          },
        ],
      });
      const menu = await Menu.new({
        items: [lifeCycleSubmenu],
      });
      await menu.setAsAppMenu();
    }

    createWindowMenu();
    setupTray();
    fetchCounter();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
      <input
        type="number"
        id="num1"
        value={num1}
        onChange={(e) => setNum1(Number(e.currentTarget.value))}
      />
      <input
        type="number"
        id="num2"
        value={num2}
        onChange={(e) => setNum2(Number(e.currentTarget.value))}
      />
      <button onClick={() => addNumbers(num1, num2)}> Add these numbers</button>
      <p>Result: {result}</p>
      <button onClick={() => incrementCounter()}>Increment Counter</button>
      <p>Counter: {counter}</p>
      <button onClick={() => location.reload()}>Reload</button>
      <button onClick={() => throwNotification()}>Throw Notification</button>
      <button onClick={() => openFolderDialog()}>Open Folder Dialog</button>
      {selectedFolder && (
        <div>
          <p>Folder value{selectedFolder}</p>
          <button onClick={() => saveFile()}> Save to file </button>
        </div>
      )}
    </main>
  );
}

export default App;
