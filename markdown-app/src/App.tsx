import { useEffect, useEffectEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import TextArea from "./components/TextArea";
import MarkdownArea from "./components/MarkdownArea";
import Button from "./components/Button";
import {
  getFileContents,
  openFileSelector,
  pickSavePath,
  saveToFile,
} from "./helpers/fileManagement";
import { Event, listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ask } from "@tauri-apps/plugin-dialog";

function App() {
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(true);

  const handleLoadButtonClick = async () => {
    const selectedFilePath = await openFileSelector();
    if (!selectedFilePath) return;
    setFilePath(selectedFilePath);
    const contents = await getFileContents(selectedFilePath);
    setTextAreaValue(contents);
    setSaved(true);
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextAreaValue(event.target.value);
    setSaved(false);
  };
  const handleSaveButtonClick = async () => {
    if (!filePath) {
      await handleSaveAsButtonClick();
      return;
    }
    await saveToFile(filePath, textAreaValue);
    setSaved(true);
  };
  const handleSaveAsButtonClick = async () => {
    const selectedPath = await pickSavePath();
    if (!selectedPath) return;
    setFilePath(selectedPath);
    await saveToFile(selectedPath, textAreaValue);
    setSaved(true);
  };

  const handleOnMenuEvents = useEffectEvent(
    async (event: Event<MenuEventType>) => {
      const { id } = event.payload;
      switch (id) {
        case "save_as":
          await handleSaveAsButtonClick();
          break;
        case "save":
          await handleSaveButtonClick();
          break;
        case "open":
          await handleLoadButtonClick();
          break;
        case "exit":
          await handleCloseRequested();
          break;
        default:
          return;
      }
    },
  );

  const handleCloseRequested = useEffectEvent(async () => {
    if (!saved) {
      const confirmed = await ask("You have unsaved changes. Close anyway?", {
        title: "Unsaved changes",
        kind: "warning",
        okLabel: "Close anyway",
        cancelLabel: " Cancel",
      });
      if (!confirmed) return;
    }
    await getCurrentWindow().destroy();
  });

  useEffect(() => {
    const unlisten = listen<MenuEventType>("menu-event", (event) => {
      handleOnMenuEvents(event);
    });
    const unlistenCloseEvent = getCurrentWindow().onCloseRequested(
      async (event) => {
        event.preventDefault();
        await handleCloseRequested();
      },
    );
    return () => {
      unlisten.then((fn) => fn());
      unlistenCloseEvent.then((fn) => fn());
    };
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row justify-center m-2 gap-2">
        <Button text="Save As" onClick={handleSaveAsButtonClick} />
        <Button text="Save" onClick={handleSaveButtonClick} />
        <Button text="Load" onClick={handleLoadButtonClick} />
      </div>
      {filePath && (
        <div className="bg-black text-white text-center rounded-md mx-2">
          {filePath}{" "}
        </div>
      )}
      <div className="flex flex-row h-full">
        <div
          className={`w-1/2 rounded-sm border ${saved ? "border-white" : "border-red-400"} m-2`}
        >
          <TextArea text={textAreaValue} onChange={handleTextAreaChange} />
        </div>
        <div className="w-1/2 rounded-sm border border-white m-2">
          <MarkdownArea text={textAreaValue} />
        </div>
      </div>
    </div>
  );
}

export default App;
