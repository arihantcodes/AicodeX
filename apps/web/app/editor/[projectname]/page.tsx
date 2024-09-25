"use client";

import { Terminal as Xterminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Plus,
  FolderPlus,
  FileIcon,
  Loader2,
  Trash,
  Edit,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
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

import socket from "@/components/socket";

interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: Record<string, FileSystemItem>;
}
export default function EnhancedCodeIDE() {
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["src"])
  );
  const [fileSystem, setFileSystem] = useState<Record<string, FileSystemItem>>(
    {}
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"file" | "folder">("file");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("");
  const [itemToRename, setItemToRename] = useState<FileSystemItem | null>(null);

  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "plaintext";

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const isRender = useRef(false);

  useEffect(() => {
    if (isRender.current) return;
    isRender.current = true;

    const term = new Xterminal();
    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.onData((data: string) => {
        socket.emit("terminal:write", data);
      });

      socket.on("terminal:data", (data: string) => {
        term.write(data);
      });
    }
  }, []);

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  const getFileTree = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get<{ tree: Record<string, unknown> }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/files`
      );
      const data = res.data;

      if (data.tree && typeof data.tree === "object") {
        setFileSystem({ root: convertToFileSystemItem(data.tree, "root") });
      } else {
        throw new Error("Invalid file tree structure");
      }
    } catch (err) {
      setError("Failed to fetch file tree. Please try again later.");
      console.error("Error fetching file tree:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToFileSystemItem = (
    tree: Record<string, unknown>,
    key: string
  ): FileSystemItem => {
    if (tree === null) {
      return { name: key, type: "file", content: "" };
    }

    const children: Record<string, FileSystemItem> = {};
    for (const [childKey, value] of Object.entries(tree)) {
      children[childKey] = convertToFileSystemItem(value as Record<string, unknown>, childKey);
    }
    return { name: key, type: "folder", children };
  };

  const handleFileSelect = async (file: FileSystemItem, path: string) => {
    if (file.type === "file") {
      try {
        const res = await axios.get<{ content: string }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/content?path=${encodeURIComponent(path)}`
        );
        const content = res.data.content;
        setSelectedFile({ ...file, content });
      } catch (err) {
        console.error("Error fetching file content:", err);
        setError("Failed to fetch file content. Please try again later.");
      }
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
  
    const updateFileSystem = (
      items: Record<string, FileSystemItem>
    ): Record<string, FileSystemItem> => {
      if (pathParts.length === 0) {
        return { ...items, [newItem.name]: newItem };
      }
  
      const [current, ...rest] = pathParts;
      
      if (current) {
        return {
          ...items,
          [current]: {
            ...(items[current] || { name: current, type: 'folder', children: {} }),
            children: updateFileSystem(items[current]?.children || {}),
          },
        };
      }
      
      return items;
    };
  
    setFileSystem(updateFileSystem(fileSystem));
  };
  
  const handleCreateItem = () => {
    if (newItemName) {
      const newItem: FileSystemItem = {
        name: newItemName,
        type: newItemType,
        ...(newItemType === "folder" ? { children: {} } : { content: "" }),
      };
      addItem(currentPath, newItem);
      setNewItemName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteItem = (path: string) => {
    const pathParts = path.split("/").filter(Boolean);
    const updateFileSystem = (
      items: Record<string, FileSystemItem>
    ): Record<string, FileSystemItem> => {
      if (pathParts.length === 1) {
        const key = pathParts[0];
        if (key !== undefined) {
          const { [key]: _, ...rest } = items;
          return rest;
        }
        return items;
      
      }

      const [current, ...rest] = pathParts;
      
      if (current) {
        return {
          ...items,
          [current]: {
            ...(items[current] || { name: current, type: 'folder', children: {} }),
            children: updateFileSystem(items[current]?.children || {}),
          },
        };
      }
      
      return items;
    };
    setFileSystem(updateFileSystem(fileSystem));
    if (selectedFile && path.endsWith(selectedFile.name)) {
      setSelectedFile(null);
    }
  };

  const handleRenameItem = () => {
    if (itemToRename && newItemName) {
      const oldPath = `${currentPath}/${itemToRename.name}`;
      const newPath = `${currentPath}/${newItemName}`;
      const updateFileSystem = (
        items: Record<string, FileSystemItem>,
        oldPathParts: string[],
        newPathParts: any[]
      ): Record<string, FileSystemItem> => {
        if (oldPathParts.length === 1 && newPathParts.length === 1) {
          const [oldName] = oldPathParts;
          const [newName] = newPathParts;
          if (oldName !== undefined) {
            const { [oldName]: item, ...rest } = items;
            return {
              ...rest,
              [newName]: { ...item, name: newName || "" },
            };
          }
          return items;
        
        }

     
        const [oldCurrent, ...oldRest] = oldPathParts;
        const [newCurrent, ...newRest] = newPathParts;
        
        if (oldCurrent && items[oldCurrent]) {
          return {
            ...items,
            [oldCurrent]: {
              ...items[oldCurrent],
              children: updateFileSystem(
                items[oldCurrent].children || {},
                oldRest,
                newRest
              ),
            },
          };
        }
        
        return items;
      };
      setFileSystem(
        updateFileSystem(
          fileSystem,
          oldPath.split("/").filter(Boolean),
          newPath.split("/").filter(Boolean)
        )
      );
      setItemToRename(null);
      setNewItemName("");
      setIsRenameDialogOpen(false);
    }
  };

  const renderFileTree = (
    items: Record<string, FileSystemItem>,
    path: string = ""
  ): JSX.Element[] => {
    return Object.entries(items).map(([name, item]) => (
      <ContextMenu key={`${path}/${name}`}>
        <ContextMenuTrigger>
          <div
            className={`flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-700 ${
              selectedFile?.name === name ? "bg-gray-700" : ""
            }`}
            onClick={() =>
              item.type === "folder"
                ? toggleFolder(`${path}/${name}`)
                : handleFileSelect(item, `${path}/${name}`)
            }
          >
            {item.type === "folder" ? (
              <>
                {expandedFolders.has(`${path}/${name}`) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Folder className="w-4 h-4" />
              </>
            ) : (
              <File className="w-4 h-4" />
            )}
            <span>{name}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {item.type === "folder" && (
            <ContextMenuItem
              onClick={() => {
                setCurrentPath(`${path}/${name}`);
                setIsCreateDialogOpen(true);
              }}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New {item.type === "folder" ? "Folder" : "File"}
            </ContextMenuItem>
          )}
          <ContextMenuItem
            onClick={() => {
              setItemToRename(item);
              setNewItemName(item.name);
              setCurrentPath(path);
              setIsRenameDialogOpen(true);
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleDeleteItem(`${path}/${name}`)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
        {item.type === "folder" && expandedFolders.has(`${path}/${name}`) && (
          <div className="ml-4">
            {renderFileTree(item.children || {}, `${path}/${name}`)}
          </div>
        )}
      </ContextMenu>
    ));
  };

  return (
    <div className="flex h-screen bg-background text-white">
    <div className="w-64 bg-background overflow-auto border-r border-gray-800">
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-2 text-gray-400">EXPLORER</h2>
        <div className="flex justify-between items-center mb-4">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Item</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={newItemType === "file" ? "default" : "ghost"}
                    onClick={() => setNewItemType("file")}
                  >
                    <FileIcon className="w-4 h-4 mr-2" />
                    File
                  </Button>
                  <Button
                    variant={newItemType === "folder" ? "default" : "ghost"}
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
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          renderFileTree(fileSystem)
        )}
      </div>
    </div>

    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-hidden">
        {selectedFile ? (
          <>
            <div className="bg-gray-800 p-2 text-sm font-medium">
              {selectedFile.name}
            </div>
            <Editor
              height="calc(100% - 32px)"
              defaultLanguage={language}
              value={selectedFile.content}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-[#020817] text-gray-400">
            Select a file to edit
          </div>
        )}
      </div>

      <div className="h-64 border-t overflow-hidden border-gray-800">
        <div ref={terminalRef} id="terminal" />
      </div>
    </div>

    <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Input
            placeholder="Enter new name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <Button onClick={handleRenameItem}>Rename</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  );
}
