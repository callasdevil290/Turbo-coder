/**
 * Turbo Coder v5.0 — Type Definitions
 * Single source of truth for all interfaces, enums, type guards
 * STRICT MODE: no implicit any
 */

// ═══════════════════════════════════════════════════════════════════════════
// FILE SYSTEM & STORAGE
// ═══════════════════════════════════════════════════════════════════════════

export interface FileMetadata {
  path: string;
  content: Uint8Array | string;
  mtime: number;
  size: number;
  hash: string;
  dirty: boolean;
  binary: boolean;
}

export interface DirectoryEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  mtime: number;
  size: number;
  children?: DirectoryEntry[];
}

export type FileSystemError =
  | 'ENOENT'
  | 'EEXIST'
  | 'EISDIR'
  | 'ENOTDIR'
  | 'EACCES'
  | 'ENOSPC'
  | 'EIO'
  | 'OPFS_UNAVAILABLE'
  | 'SQLITE_CORRUPT';

// ═══════════════════════════════════════════════════════════════════════════
// EDITOR STATE
// ═══════════════════════════════════════════════════════════════════════════

export enum EditorType {
  CODEMIRROR = 'codemirror',
  MONACO = 'monaco',
}

export interface EditorPosition {
  line: number;
  ch: number;
}

export interface EditorSelection {
  from: EditorPosition;
  to: EditorPosition;
}

export interface TabState {
  path: string;
  isDirty: boolean;
  cursorPos: EditorPosition;
  scroll: { x: number; y: number };
  selection?: EditorSelection;
}

export interface EditorState {
  tabs: Map<string, TabState>;
  activeTabPath: string | null;
  editorType: EditorType;
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'auto';
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// GIT & VERSION CONTROL
// ═══════════════════════════════════════════════════════════════════════════

export interface GitIndex {
  path: string;
  sha: string;
  mode: number;
  stage: number;
  mtime: number;
}

export interface GitCommit {
  oid: string;
  message: string;
  author: {
    name: string;
    email: string;
    timestamp: number;
    timezoneOffset: number;
  };
  committer: {
    name: string;
    email: string;
    timestamp: number;
    timezoneOffset: number;
  };
  parent: string[];
  tree: string;
}

export interface GitDiff {
  path: string;
  status: 'add' | 'modify' | 'delete' | 'rename';
  oldPath?: string;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

export interface OfflineMutation {
  id: number;
  operation: 'clone' | 'commit' | 'push' | 'pull' | 'merge';
  payload: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TERMINAL & SHELL
// ═══════════════════════════════════════════════════════════════════════════

export interface TerminalState {
  cwd: string;
  history: string[];
  historyIndex: number;
  buffer: string;
  isRunning: boolean;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

export type ShellCommand =
  | 'ls'
  | 'cd'
  | 'pwd'
  | 'mkdir'
  | 'touch'
  | 'rm'
  | 'cp'
  | 'mv'
  | 'cat'
  | 'echo'
  | 'clear'
  | 'help'
  | 'share'
  | 'battery'
  | 'git'
  | 'npm'
  | 'node';

// ═══════════════════════════════════════════════════════════════════════════
// UI & LAYOUT
// ═══════════════════════════════════════════════════════════════════════════

export enum Breakpoint {
  MOBILE = 'mobile',    // <640px
  TABLET = 'tablet',    // 640px-1024px
  DESKTOP = 'desktop',  // ≥1024px
}

export interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  bottomPanelOpen: boolean;
  bottomPanelHeight: number;
  activityBarCollapsed: boolean;
  breakpoint: Breakpoint;
  isOffline: boolean;
  showOfflineQueue: boolean;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  severity: ErrorSeverity;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export enum ErrorSeverity {
  FATAL = 'fatal',
  WARNING = 'warning',
  INFO = 'info',
  MOBILE_OOM = 'mobile-oom',
  OFFLINE_SYNC = 'offline-sync',
  COOP_COEP = 'coop-coep',
}

export interface ErrorContext {
  severity: ErrorSeverity;
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════
// AI & MODELS
// ═══════════════════════════════════════════════════════════════════════════

export enum AITier {
  TIER_1 = 1,  // <2GB: Disabled
  TIER_2 = 2,  // 2-4GB: Qwen2.5-Coder-1.5B
  TIER_3 = 3,  // 4-6GB: codegen-350M
  TIER_4 = 4,  // 6-8GB: Qwen2.5-Coder-1.5B
  TIER_5 = 5,  // 8GB+: Qwen2.5-Coder-3B
}

export interface AIModelConfig {
  modelId: string;
  dtype: 'q4' | 'q8' | 'fp16' | 'fp32';
  device: 'cpu' | 'webgpu';
  maxTokens: number;
  temperature: number;
  topP: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokens?: number;
}

export interface AIState {
  enabled: boolean;
  tier: AITier;
  modelLoaded: boolean;
  isGenerating: boolean;
  messages: AIMessage[];
  currentContext: {
    filePath: string;
    code: string;
    language: string;
  } | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// COLLABORATION
// ═══════════════════════════════════════════════════════════════════════════

export interface PeerCursor {
  peerId: string;
  peerName: string;
  position: EditorPosition;
  color: string;
  timestamp: number;
}

export interface CollaborationState {
  enabled: boolean;
  connected: boolean;
  peerId: string;
  peers: Map<string, PeerCursor>;
  signalingServer: string;
  room: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export interface UserSettings {
  // Editor
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'auto';
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  lineNumbers: boolean;
  minimap: boolean;
  renderWhitespace: 'none' | 'selection' | 'all';

  // Git
  gitName: string;
  gitEmail: string;
  corsProxy: string;

  // AI
  aiEnabled: boolean;
  aiModel: string;

  // Collaboration
  collabEnabled: boolean;
  signalingServer: string;

  // Gestures & Accessibility
  oneHandMode: boolean;
  oneHandSide: 'left' | 'right';
  hapticFeedback: boolean;
  gesturesEnabled: boolean;
  accessibilityMode: boolean;

  // Storage
  autoSave: boolean;
  autoSaveInterval: number;

  // UI
  sidebarWidth: number;
  bottomPanelHeight: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  fontSize: 14,
  fontFamily: '"Monaco", "Menlo", "Consolas", "Courier New", monospace',
  theme: 'auto',
  wordWrap: 'on',
  lineNumbers: true,
  minimap: false,
  renderWhitespace: 'none',
  gitName: 'Anonymous',
  gitEmail: 'anonymous@turbo-coder.local',
  corsProxy: 'https://cors.isomorphic-git.org',
  aiEnabled: true,
  aiModel: 'qwen2.5-coder-1.5b',
  collabEnabled: false,
  signalingServer: 'wss://signal.example.com',
  oneHandMode: false,
  oneHandSide: 'right',
  hapticFeedback: true,
  gesturesEnabled: true,
  accessibilityMode: false,
  autoSave: true,
  autoSaveInterval: 30000,
  sidebarWidth: 256,
  bottomPanelHeight: 200,
};

// ═══════════════════════════════════════════════════════════════════════════
// GESTURES & MOBILE
// ═══════════════════════════════════════════════════════════════════════════

export enum GestureType {
  EDGE_SWIPE_RIGHT = 'edgeSwipeRight',
  EDGE_SWIPE_LEFT = 'edgeSwipeLeft',
  LONG_PRESS = 'longPress',
  SWIPE_LEFT = 'swipeLeft',
  SWIPE_RIGHT = 'swipeRight',
  SWIPE_UP = 'swipeUp',
  SWIPE_DOWN = 'swipeDown',
  DOUBLE_TAP = 'doubleTap',
  PINCH_ZOOM = 'pinchZoom',
}

export interface GestureEvent {
  type: GestureType;
  x: number;
  y: number;
  deltaX?: number;
  deltaY?: number;
  scale?: number;
  timestamp: number;
}

export interface HapticPattern {
  type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';
  pattern: number[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEVICE CAPABILITIES
// ═══════════════════════════════════════════════════════════════════════════

export interface DeviceCapabilities {
  memoryGB: number;
  hasWebGPU: boolean;
  hasOPFS: boolean;
  hasBackgroundSync: boolean;
  hasSharedArrayBuffer: boolean;
  hasVibration: boolean;
  hasGeolocation: boolean;
  hasCamera: boolean;
  hasNotification: boolean;
  storage: {
    type: 'opfs' | 'indexeddb' | 'localstorage';
    quota: number;
    usage: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE BUDGET
// ═══════════════════════════════════════════════════════════════════════════

export const PERFORMANCE_BUDGET = {
  maxInitialLoad: 2 * 1024 * 1024,        // 2MB
  maxMemoryUsage: 80 * 1024 * 1024,       // 80MB
  minViewportWidth: 320,                   // px
  touchTargetSize: 48,                     // px
  editorChunkSize: 500 * 1024,            // 500KB
  lspServerChunk: 1 * 1024 * 1024,        // 1MB
  aiModelChunk: 60 * 1024 * 1024,         // 60MB
  sqliteInitTime: 600,                     // ms
  opfsBulkWrite: 40,                       // ms (200 docs)
  esbuildBundleTime: 500,                  // ms (1000 modules)
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// OFFLINE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const OFFLINE_CONFIG = {
  backgroundSync: {
    oneShot: 'sync',
    periodic: 'periodic-background-sync',
    fallback: 'indexeddb-queue',
  },
  precache: [
    '/codemirror.min.js',
    '/tree-sitter.wasm',
    '/sqlite3.wasm',
  ],
  mutationQueue: 'sqlite-offline-queue',
  retry: {
    maxRetries: 5,
    baseDelay: 1000,
    maxDelay: 30000,
    backoff: 'exponential',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPE GUARDS
// ═══════════════════════════════════════════════════════════════════════════

export function isFileMetadata(obj: unknown): obj is FileMetadata {
  if (typeof obj !== 'object' || obj === null) return false;
  const file = obj as Record<string, unknown>;
  return (
    typeof file.path === 'string' &&
    (typeof file.content === 'string' || file.content instanceof Uint8Array) &&
    typeof file.mtime === 'number' &&
    typeof file.size === 'number' &&
    typeof file.hash === 'string' &&
    typeof file.dirty === 'boolean' &&
    typeof file.binary === 'boolean'
  );
}

export function isDirectoryEntry(obj: unknown): obj is DirectoryEntry {
  if (typeof obj !== 'object' || obj === null) return false;
  const entry = obj as Record<string, unknown>;
  return (
    typeof entry.name === 'string' &&
    typeof entry.path === 'string' &&
    typeof entry.isDirectory === 'boolean' &&
    typeof entry.mtime === 'number' &&
    typeof entry.size === 'number'
  );
}

export function isTabState(obj: unknown): obj is TabState {
  if (typeof obj !== 'object' || obj === null) return false;
  const tab = obj as Record<string, unknown>;
  return (
    typeof tab.path === 'string' &&
    typeof tab.isDirty === 'boolean' &&
    typeof tab.cursorPos === 'object'
  );
}

export function isErrorContext(obj: unknown): obj is ErrorContext {
  if (typeof obj !== 'object' || obj === null) return false;
  const err = obj as Record<string, unknown>;
  return (
    typeof err.severity === 'string' &&
    typeof err.code === 'string' &&
    typeof err.message === 'string'
  );
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function isLowEndDevice(): boolean {
  const memory = navigator.deviceMemory;
  return typeof memory === 'number' && memory <= 2;
}

export function hasWebGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

export function hasOPFS(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.storage === 'undefined') {
    return false;
  }
  return 'getDirectory' in navigator.storage;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export type AsyncResult<T, E = ErrorContext> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function Ok<T>(value: T): AsyncResult<T> {
  return { ok: true, value };
}

export function Err<E>(error: E): AsyncResult<never, E> {
  return { ok: false, error };
}
