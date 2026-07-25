import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import appConfig from '../config/appConfig.js';

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Build the storage path for a claim's documents.
 * Structure: uploads/<financialYear>/<claimNumber>/
 * @param {string} financialYear - e.g., '2026-27'
 * @param {string} claimNumber - e.g., 'RPMS-2026-0001'
 * @returns {string} Directory path
 */
export const getClaimDirectory = (financialYear, claimNumber) => {
  return path.join(appConfig.uploadsDir, financialYear, claimNumber);
};

/**
 * Upload a file to the claim's directory.
 * Moves file from multer's temp location to final organized location.
 * @param {Object} file - Multer file object
 * @param {string} financialYear
 * @param {string} claimNumber
 * @returns {Object} { fileName, filePath, fileSize, mimeType, originalName }
 */
export const uploadFile = (file, financialYear, claimNumber) => {
  const claimDir = getClaimDirectory(financialYear, claimNumber);
  ensureDirectory(claimDir);
  
  const ext = path.extname(file.originalname);
  const fileName = `${uuidv4()}${ext}`;
  const filePath = path.join(claimDir, fileName);
  
  // Move from temp to final location
  fs.renameSync(file.path, filePath);
  
  return {
    originalName: file.originalname,
    fileName,
    filePath: filePath.replace(/\\/g, '/'), // Normalize path separators
    fileSize: file.size,
    mimeType: file.mimetype
  };
};

/**
 * Delete a file from disk.
 * @param {string} filePath
 */
export const deleteFile = (filePath) => {
  const absolutePath = path.resolve(filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

/**
 * Get the absolute path for serving a file.
 * @param {string} filePath
 * @returns {string}
 */
export const getAbsolutePath = (filePath) => {
  return path.resolve(filePath);
};
