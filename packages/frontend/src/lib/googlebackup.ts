import { logger } from "@/state/utils";
import { ExpNodeType, FolderType } from "@/types/explorer";

async function createGoogleFolder(accessToken: string, folderName: string, parentFolderId?: string): Promise<string> {
  // Create a folder in Google Drive
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : [],
    }),
  });

  console.log(response);

  if (!response.ok) {
    logger.error(`Failed to Create FOLDER: ${folderName}`);
    throw new Error("Failed to create folder");
  }

  const data = await response.json();

  logger.info(`Successfully Created FOLDER: ${folderName}`);
  return data.id as string;
}

async function createGoogleFile({
  content,
  folderId,
  name,
  accessToken,
}: {
  folderId: string;
  name: string;
  content: string;
  accessToken: string;
}) {
  const file = new Blob([content], { type: "text/plain" });
  const metadata = {
    name,
    mimeType: "text/plain",
    parents: [folderId],
  };

  const formData = new FormData();

  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", file);

  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    logger.error(`Failed to Create FILE: ${name}`);
    return false;
  }
  const data = await response.json();
  logger.info(`Successfully Created FILE: ${name}`);

  return true;
}

async function createGoogleBackup(
  folder: FolderType,
  accessToken: string,
  files: Record<string, string>,
  parentFolderId?: string,
) {
  const folderId = await createGoogleFolder(accessToken, folder.name, parentFolderId);

  for (const key in folder.items) {
    const item = folder.items[key];

    if (item.type === ExpNodeType.FOLDER) {
      await createGoogleBackup(item, accessToken, files, folderId);
    } else {
      await createGoogleFile({
        content: files[item.path],
        folderId,
        name: item.name,
        accessToken,
      });
    }
  }
}

export default createGoogleBackup;
