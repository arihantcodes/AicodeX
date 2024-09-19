/* eslint-disable no-undef */
"use client";

import { useState, useEffect, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Plus,
  FolderPlus,
  FileIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type FileSystemItem = {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileSystemItem[];
};

export default function CodeIDE() {
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["src"])
  );
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"file" | "folder">("file");
  const [currentPath, setCurrentPath] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams.get("language");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>(["Welcome to MacTerminal"]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = input.trim();
      setOutput((prev) => [...prev, `$ ${command}`, processCommand(command)]);
      setInput("");
    }
  };

  const processCommand = (command: string): string => {
    switch (command.toLowerCase()) {
      case "help":
        return "Available commands: help, clear, date, echo [text]";
      case "clear":
        setTimeout(() => setOutput([]), 0);
        return "";
      case "date":
        return new Date().toString();
      default:
        if (command.toLowerCase().startsWith("echo ")) {
          return command.slice(5);
        }
        return `Command not found: ${command}`;
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [output]);
  useEffect(() => {
    if (language) {
      initializeProject(language);
    }
  }, [language]);

  const initializeProject = (lang: string) => {
    let initialFileSystem: FileSystemItem[] = [];

    switch (lang) {
      case "java":
        initialFileSystem = [
          {
            name: "src",
            type: "folder",
            children: [
              {
                name: "Main.java",
                type: "file",
                content: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}`,
              },
            ],
          },
        ];
        break;
      case "javascript":
        initialFileSystem = [
          {
            name: "src",
            type: "folder",
            children: [
              {
                name: "index.js",
                type: "file",
                content: `console.log("Hello, JavaScript!");`,
              },
            ],
          },
        ];
        break;
      case "python":
        initialFileSystem = [
          {
            name: "src",
            type: "folder",
            children: [
              {
                name: "app.py",
                type: "file",
                content: `print("Hello, Python!")`,
              },
            ],
          },
        ];
        break;
      case "c++":
        initialFileSystem = [
          {
            name: "src",
            type: "folder",
            children: [
              {
                name: "main.cpp",
                type: "file",
                content: `#include <iostream>

int main() {
  std::cout << "Hello, C++!" << std::endl;
  return 0;
}`,
              },
            ],
          },
        ];
        break;
      default:
        initialFileSystem = [
          {
            name: "src",
            type: "folder",
            children: [
              {
                name: "main.txt",
                type: "file",
                content: `Hello, World!`,
              },
            ],
          },
        ];
    }

    setFileSystem(initialFileSystem);
  };

  const handleFileSelect = (file: FileSystemItem) => {
    if (file.type === "file") {
      setSelectedFile(file);
    }
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const addItem = (path: string, newItem: FileSystemItem) => {
    const pathParts = path.split("/").filter(Boolean);
    const updateFileSystem = (items: FileSystemItem[]): FileSystemItem[] => {
      if (pathParts.length === 0) {
        return [...items, newItem];
      }
      return items.map((item) => {
        if (item.name === pathParts[0] && item.type === "folder") {
          return {
            ...item,
            children: updateFileSystem(item.children || []),
          };
        }
        return item;
      });
    };
    setFileSystem(updateFileSystem(fileSystem));
  };

  const handleCreateItem = () => {
    if (newItemName) {
      const newItem: FileSystemItem = {
        name: newItemName,
        type: newItemType,
        ...(newItemType === "folder" ? { children: [] } : { content: "" }),
      };
      addItem(currentPath, newItem);
      setNewItemName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteItem = (path: string) => {
    const pathParts = path.split("/").filter(Boolean);
    const updateFileSystem = (items: FileSystemItem[]): FileSystemItem[] => {
      if (pathParts.length === 1) {
        return items.filter((item) => item.name !== pathParts[0]);
      }
      return items.map((item) => {
        if (item.name === pathParts[0] && item.type === "folder") {
          return {
            ...item,
            children: updateFileSystem(item.children || []),
          };
        }
        return item;
      });
    };
    setFileSystem(updateFileSystem(fileSystem));
    if (selectedFile && path.endsWith(selectedFile.name)) {
      setSelectedFile(null);
    }
  };

  const renderFileSystem = (items: FileSystemItem[], path: string = "") => {
    return items.map((item) => {
      const itemPath = `${path}/${item.name}`;
      return (
        <ContextMenu key={itemPath}>
          <ContextMenuTrigger>
            <div className="flex items-center cursor-pointer mb-1 rounded-sm hover:bg-gray-800 text-gray-300 py-1">
              {item.type === "folder" && (
                <div
                  className="flex items-center w-full"
                  onClick={() => toggleFolder(itemPath)}
                >
                  {expandedFolders.has(itemPath) ? (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-1" />
                  )}
                  <Folder className="w-4 h-4 mr-2" />
                  <span>{item.name}</span>
                </div>
              )}
              {item.type === "file" && (
                <div
                  className={`flex items-center w-full ${
                    selectedFile === item ? "bg-gray-700" : ""
                  }`}
                  onClick={() => handleFileSelect(item)}
                >
                  <File className="w-4 h-4 mr-2 ml-5" />
                  <span>{item.name}</span>
                </div>
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                setCurrentPath(itemPath);
                setIsCreateDialogOpen(true);
              }}
            >
              New File
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                setCurrentPath(itemPath);
                setNewItemType("folder");
                setIsCreateDialogOpen(true);
              }}
            >
              New Folder
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleDeleteItem(itemPath)}>
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    });
  };

  // Define the custom theme for Monaco Editor
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("customTheme", {
        base: "vs-dark", // Dark mode base
        inherit: true, // Inherit default rules
        rules: [
          { token: "comment", foreground: "888888", fontStyle: "italic" },
          { token: "keyword", foreground: "ff7a93" },
          { token: "identifier", foreground: "c5a5c5" },
          { token: "number", foreground: "d19a66" },
          { token: "string", foreground: "98c379" },
          { token: "constant.character", foreground: "d19a66" },
          { token: "constant.escape", foreground: "56b6c2" },
          { token: "text.html.markdown", foreground: "ff7a93" },
          { token: "punctuation.definition.list_item", foreground: "e5c07b" },
          { token: "keyword.begin.tag.ejs", foreground: "c678dd" },
          { token: "constant.name.attribute.tag.pug", foreground: "e06c75" },
          // Add other specific tokens here...
        ],
        colors: {
          "selection.background": "#1679b6cc",
          descriptionForeground: "#61a6d1",
          errorForeground: "#e34e1c",
          "widget.shadow": "#00000044",
          "editor.background": "#020817",
          "editor.foreground": "#becfda",
          "editorLineNumber.foreground": "#4d6c80",
          "editorLineNumber.activeForeground": "#61a6d1",
          "editorCursor.foreground": "#EA7773",

          "badge.background": "#49ace9",
          "badge.foreground": "#0f1315",
          "activityBar.background": "#07273b",
          "activityBar.dropBackground": "#61a6d165",
          "activityBar.border": "#0f1315",
          "activityBar.foreground": "#1679b6",
          "activityBar.inactiveForeground": "#1679b677",
          "activityBarBadge.background": "#49ace9",
          "activityBarBadge.foreground": "#0f1315",
          "activityBar.activeBackground": "#49ace933",
          "activityBar.activeBorder": "#49ace9",
          "sideBar.background": "#010305",
          "sideBar.dropBackground": "#062132",
          "sideBar.border": "#515151",
          "sideBar.foreground": "#9fb6c6",
          "sideBarSectionHeader.background": "#09334e",
          "sideBarSectionHeader.foreground": "#9fb6c6",
          "sideBarTitle.foreground": "#9fb6c6",
          "sideBarSectionHeader.border": "#0f1315",
          "statusBar.foreground": "#1679b6",
          "statusBar.background": "#07273b",
          "statusBar.border": "#0f1315",
          "statusBar.debuggingBackground": "#07273b",
          "statusBar.debuggingForeground": "#ff80ac50",
          "statusBar.debuggingBorder": "#ff80acaf",
          "statusBar.noFolderForeground": "#879dab",
          "statusBar.noFolderBackground": "#07273b",
          "statusBar.noFolderBorder": "#07273b",
          "statusBarItem.activeBackground": "#007ecc59",
          "statusBarItem.hoverBackground": "#0a3652",
          "statusBarItem.prominentBackground": "#051e2e",
          "statusBarItem.prominentHoverBackground": "#002f4d",
          "button.background": "#007f99",
          "button.foreground": "#ebf7ff",
          "button.hoverBackground": "#0ac",
          "dropdown.background": "#09334e",
          "dropdown.border": "#09334e",
          "dropdown.foreground": "#61a6d1",
          "editorMarkerNavigation.background": "#3a3a5e29",
          "editorMarkerNavigationError.background": "#e34e1c",
          "editorMarkerNavigationWarning.background": "#e69533",
          "editorError.border": "#07273b",
          "editorError.foreground": "#e34e1c",
          "editorWarning.border": "#07273b",
          "editorWarning.foreground": "#e69533",
          "editorInfo.border": "#07273b",
          "editor.foldBackground": "#0A1724",
          "editorInfo.foreground": "#49ace9",
          "editorHint.border": "#49e9a600",
          "editorHint.foreground": "#49e9a6",
          "editorGroup.emptyBackground": "#4d6c8033",
          "editorGroup.border": "#0f1315",
          "editorGroup.dropBackground": "#4d6c8033",
          "editorGroupHeader.noTabsBackground": "#09334e",
          "editorGroupHeader.tabsBackground": "#09334e",
          "editorGroupHeader.tabsBorder": "#09334e",
          "tab.activeBackground": "#000000",
          "tab.unfocusedActiveBackground": "#002c47",
          "tab.activeForeground": "#FFFFFF",
          "tab.border": "#0f1315",
          "tab.inactiveBackground": "#09334e",
          "tab.inactiveForeground": "#9fb6c6",
          "tab.unfocusedActiveForeground": "#9fb6c6",
          "tab.unfocusedInactiveForeground": "#9fb6c6",
          "tab.activeBorderTop": "#FFFFFF",
          "tab.activeModifiedBorder": "#49e9a6",
          "tab.activeBorder": "#FFFFFF",
          "tab.unfocusedActiveBorder": "#07273b",
          "tab.unfocusedHoverBackground": "#1679b621",
          "textBlockQuote.background": "#07273b",
          "textBlockQuote.border": "#1679b6",
          "textCodeBlock.background": "#07273b",
          "textLink.activeForeground": "#49ace9",
          "textLink.foreground": "#49ace9",
          "textPreformat.foreground": "#ffc180",
          "textSeparator.foreground": "#07273b",
          "walkThrough.embeddedEditorBackground": "#07273b",
          "welcomePage.buttonBackground": "#051b29",
          "welcomePage.buttonHoverBackground": "#09334e",
          "input.background": "#051b29",
          "input.border": "#002f4d",
          "input.foreground": "#CDD3DE",
          "input.placeholderForeground": "#879dab",
          "inputOption.activeBorder": "#1679b6",
          "inputValidation.errorForeground": "#ff4000",
          "inputValidation.errorBackground": "#501502ee",
          "inputValidation.errorBorder": "#691c02",
          "inputValidation.infoForeground": "#40d4e7",
          "inputValidation.infoBackground": "#0f6e7bee",
          "inputValidation.infoBorder": "#148f9f",
          "inputValidation.warningForeground": "#e69533",
          "inputValidation.warningBackground": "#82694acc",
          "inputValidation.warningBorder": "#a88457",
          "editorWidget.background": "#09334e",
          "editorWidget.border": "#0f1315",
          "editorHoverWidget.background": "#002942",
          "editorHoverWidget.border": "#0f1315",
          "editorSuggestWidget.background": "#002942",
          "editorSuggestWidget.border": "#0f1315",
          "editorSuggestWidget.foreground": "#9fb6c6",
          "editorSuggestWidget.highlightForeground": "#49ace9",
          "editorSuggestWidget.selectedBackground": "#0c3f5f",
          "editorGutter.background": "#020817",
          "editorGutter.addedBackground": "#8ce99a",
          "editorGutter.deletedBackground": "#e34e1c",
          "editorGutter.modifiedBackground": "#ffc180",
          "editor.selectionBackground": "#1679b6BF",
          "editor.selectionHighlightBackground": "#49ace933",
          "editor.inactiveSelectionBackground": "#1679b633",
          "editor.wordHighlightStrongBackground": "#cc990033",
          "editor.wordHighlightBackground": "#e4b78133",
          "editor.findMatchBackground": "#40bf6a11",
          "editor.findMatchHighlightBackground": "#0e667179",
          "editor.findRangeHighlightBackground": "#49e9a622",
          "editor.hoverHighlightBackground": "#1679b63f",
          "editor.lineHighlightBackground": "#003c61ee",
          "editor.lineHighlightBorder": "#003c61",
          "editor.rangeHighlightBackground": "#49d6e922",
          "editorLink.activeForeground": "#14a5ff",
          "editorWhitespace.foreground": "#ffffff21",
          "editorIndentGuide.background": "#183c53",
          "editorIndentGuide.activeBackground": "#28658a",
          "editorBracketMatch.background": "#1679b622",
          "editorBracketMatch.border": "#1679b6",
          "editorRuler.foreground": "#1a425b",
          "editorCodeLens.foreground": "#5b858b",
          "terminal.ansiBlack": "#28353e",
          "terminal.ansiRed": "#e66533",
          "terminal.ansiGreen": "#49e9a6",
          "terminal.ansiYellow": "#e4b781",
          "terminal.ansiBlue": "#49ace9",
          "terminal.ansiMagenta": "#df769b",
          "terminal.ansiCyan": "#49d6e9",
          "terminal.ansiWhite": "#aec3d0",
          "terminal.ansiBrightBlack": "#475e6c",
          "terminal.ansiBrightRed": "#e97749",
          "terminal.ansiBrightGreen": "#60ebb1",
          "terminal.ansiBrightYellow": "#e69533",
          "terminal.ansiBrightBlue": "#60b6eb",
          "terminal.ansiBrightMagenta": "#e798b3",
          "terminal.ansiBrightCyan": "#60dbeb",
          "terminal.ansiBrightWhite": "#becfda",
          "terminal.foreground": "#becfda",
          "terminalCursor.background": "#051b29",
          "terminalCursor.foreground": "#becfda",
          "terminal.background": "#070707",
          "terminal.selectionBackground": "#E07C24",
          "terminal.selectionForeground": "#000000",
          "merge.border": "#07273b00",
          "merge.currentContentBackground": "#85f1ff22",
          "merge.currentHeaderBackground": "#85f1ff44",
          "merge.incomingContentBackground": "#9d92f222",
          "merge.incomingHeaderBackground": "#9d92f244",
          "merge.commonContentBackground": "#ffc18022",
          "merge.commonHeaderBackground": "#ffc18044",
          "editorOverviewRuler.currentContentForeground": "#85f1ff44",
          "editorOverviewRuler.incomingContentForeground": "#9d92f244",
          "editorOverviewRuler.commonContentForeground": "#ffc18044",
          "editorOverviewRuler.border": "#07273b",
          "notificationCenter.border": "#09334e",
          "notificationCenterHeader.foreground": "#879dab",
          "notificationCenterHeader.background": "#09334e",
          "notificationToast.border": "#09334e",
          "notifications.foreground": "#CDD3DE",
          "notifications.background": "#09334e",
          "notifications.border": "#09334e",
          "notificationLink.foreground": "#879dab",
          "diffEditor.insertedTextBackground": "#16b67327",
          "diffEditor.removedTextBackground": "#e6653341",
          "debugToolBar.background": "#07273b",
          "debugExceptionWidget.background": "#07273b",
          "debugExceptionWidget.border": "#1679b6",
          "extensionButton.prominentBackground": "#008c99",
          "extensionButton.prominentForeground": "#e5f5f5",
          "extensionButton.prominentHoverBackground": "#00bbcc",
          focusBorder: "#09334e",
          foreground: "#becfda",
          "panel.background": "#051b29",
          "panel.border": "#1679b6",
          "panelTitle.activeBorder": "#1679b6",
          "panelTitle.activeForeground": "#49ace9",
          "panelTitle.inactiveForeground": "#507b95",
          "peekView.border": "#1679b6",
          "peekViewEditor.background": "#001f33",
          "peekViewEditor.matchHighlightBackground": "#005b9433",
          "peekViewEditor.matchHighlightBorder": "#007ecc",
          "peekViewEditorGutter.background": "#001f33",
          "peekViewResult.background": "#002338",
          "peekViewResult.fileForeground": "#ffc180",
          "peekViewResult.lineForeground": "#879dab",
          "peekViewResult.matchHighlightBackground": "#09334e",
          "peekViewResult.selectionBackground": "#09334e",
          "peekViewResult.selectionForeground": "#879dab",
          "peekViewTitle.background": "#002338",
          "peekViewTitleDescription.foreground": "#879dab",
          "peekViewTitleLabel.foreground": "#ffc180",
          "progressBar.background": "#49ace9",
          "scrollbar.shadow": "#00000044",
          "scrollbarSlider.activeBackground": "#008ee677",
          "scrollbarSlider.background": "#008ee633",
          "scrollbarSlider.hoverBackground": "#008ee655",
          "gitDecoration.addedResourceForeground": "#16b673",
          "gitDecoration.modifiedResourceForeground": "#49e9a6",
          "gitDecoration.deletedResourceForeground": "#e34e1c",
          "gitDecoration.untrackedResourceForeground": "#40d4e7",
          "gitDecoration.ignoredResourceForeground": "#5b788b",
          "gitDecoration.conflictingResourceForeground": "#ffc180",
          "pickerGroup.border": "#1679b6",
          "pickerGroup.foreground": "#49ace9",
          "list.activeSelectionBackground": "#0c3f5f",
          "list.activeSelectionForeground": "#ebf7ff",
          "list.dropBackground": "#002a4d",
          "list.focusBackground": "#0b3c5b",
          "list.focusForeground": "#ebf7ff",
          "list.highlightForeground": "#49ace9",
          "list.hoverBackground": "#00558a65",
          "list.hoverForeground": "#ebf7ff",
          "list.inactiveFocusBackground": "#082d44",
          "list.inactiveSelectionBackground": "#09334e",
          "list.inactiveSelectionForeground": "#becfda",
          "list.errorForeground": "#e34e1c",
          "list.warningForeground": "#ffa857",
          "listFilterWidget.background": "#002a4d",
          "listFilterWidget.outline": "#49e9a6",
          "listFilterWidget.noMatchesOutline": "#e34e1c",
          "tree.indentGuidesStroke": "#f6f6f6",

          "tree.renderIndentGuides": "always",
          "settings.headerForeground": "#becfda",
          "settings.modifiedItemIndicator": "#15ac31",
          "settings.dropdownListBorder": "#0051a877",
          "settings.dropdownBackground": "#09334e",
          "settings.dropdownForeground": "#0ac",
          "settings.dropdownBorder": "#09334e",
          "settings.checkboxBackground": "#09334e",
          "settings.checkboxForeground": "#0ac",
          "settings.checkboxBorder": "#09334e",
          "settings.textInputBackground": "#09334e",
          "settings.textInputForeground": "#0ac",
          "settings.textInputBorder": "#09334e",
          "settings.numberInputBackground": "#051b29",
          "settings.numberInputForeground": "#7060eb",
          "settings.numberInputBorder": "#051b29",
          "breadcrumb.foreground": "#9fb6c6",
          "breadcrumb.background": "#07273b",
          "breadcrumb.focusForeground": "#49ace9",
          "breadcrumb.activeSelectionForeground": "#ebf7ff",
          "breadcrumbPicker.background": "#09334e",
          "titleBar.activeBackground": "#07273b",
          "titleBar.activeForeground": "#becfda",
          "titleBar.inactiveBackground": "#07273b",
          "titleBar.inactiveForeground": "#9fb6c6",
          "menu.background": "#09334e",
          "menu.foreground": "#9fb6c6",
          "menu.selectionBackground": "#0b3c5b",
          "menu.selectionForeground": "#49ace9",
          "menu.selectionBorder": "#0b3c5b",
          "menu.separatorBackground": "#49ace9",
          "menubar.selectionBackground": "#0b3c5b",
          "menubar.selectionForeground": "#49ace9",
          "menubar.selectionBorder": "#0b3c5b",
          "editor.snippetTabstopHighlightBackground": "#051b29",
          "editor.snippetTabstopHighlightBorder": "#062132",
          "editor.snippetFinalTabstopHighlightBackground": "#051b29",
          "editor.snippetFinalTabstopHighlightBorder": "#062132",
          "minimap.findMatchHighlight": "#49ace9ee",
          "minimap.errorHighlight": "#e34e1cee",
          "minimap.warningHighlight": "#e69533ee",
          "minimapGutter.addedBackground": "#16b673",
          "minimapGutter.modifiedBackground": "#49e9a6",
          "minimapGutter.deletedBackground": "#e34e1c",
          "minimap.background": "#07273b99",
        },
      });
    });
  }, []);

  return (
    <>
      <div className="flex h-screen bg-[#020817] text-white">
        <div className="w-64 bg-[#010305] overflow-auto border-r border-gray-800">
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-2 text-gray-400">
              EXPLORER
            </h2>
            <div className="flex justify-between items-center mb-4">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPath("")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Create New {newItemType === "file" ? "File" : "Folder"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4">
                    <div className="flex space-x-2">
                      <Button
                        variant={newItemType === "file" ? "default" : "outline"}
                        onClick={() => setNewItemType("file")}
                      >
                        <FileIcon className="w-4 h-4 mr-2" />
                        File
                      </Button>
                      <Button
                        variant={
                          newItemType === "folder" ? "default" : "outline"
                        }
                        onClick={() => setNewItemType("folder")}
                      >
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Folder
                      </Button>
                    </div>
                    <Input
                      placeholder={`Enter ${newItemType} name`}
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Button onClick={handleCreateItem}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {renderFileSystem(fileSystem)}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-hidden ">
            {selectedFile ? (
              <Editor
                height="100%"
                defaultLanguage={language || "plaintext"}
                value={selectedFile.content}
                theme="customTheme"
                options={{
                  minimap: { enabled: false },
                  fontSize: 18,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  cursorStyle: "line",
                  automaticLayout: true,
                  
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-[#020817] text-gray-400">
                Select a file to edit
              </div>
            )}
          </div>
          {/* add scrool area in terminal  */}

          <div className="h-64 bg-[#020817] border-t overflow-hidden border-gray-800">
            <div className="flex items-center bg-[#010305] text-sm border-b border-gray-800">
              <div className="px-4 py-1 bg-[#020817] text-white">TERMINAL</div>
              <div className="px-4 py-1 text-gray-400">OUTPUT</div>
              <div className="px-4 py-1 text-gray-400">DEBUG CONSOLE</div>
            </div>
            <div
              ref={terminalRef}
              className="h-full overflow-auto p-2 font-mono text-sm"
            >
              {output.map((line, index) => (
                <div
                  key={index}
                  className={
                    line.startsWith("PS") ? "text-[#569CD6]" : "text-white"
                  }
                >
                  {line}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-[#569CD6] mr-2">
                  PS E:\aicodex\apps\web&gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-green-400 focus:outline-none flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
