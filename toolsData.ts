import type { PDFTool, ToolCategory } from '@/types'

export const tools: PDFTool[] = [
  { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: 'Combine', category: 'organize', color: 'bg-blue-500', path: '/tools/merge', supportsBatch: true, maxFileSize: 100 },
  { id: 'split', name: 'Split PDF', description: 'Extract pages or split by range', icon: 'Scissors', category: 'organize', color: 'bg-green-500', path: '/tools/split', supportsBatch: false, maxFileSize: 100 },
  { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF file size', icon: 'Minimize2', category: 'optimize', color: 'bg-orange-500', path: '/tools/compress', supportsBatch: true, maxFileSize: 100 },
  { id: 'rotate', name: 'Rotate PDF', description: 'Rotate PDF pages', icon: 'RotateCw', category: 'edit', color: 'bg-purple-500', path: '/tools/rotate', supportsBatch: true, maxFileSize: 50 },
  { id: 'delete-pages', name: 'Delete Pages', description: 'Remove unwanted pages', icon: 'Trash2', category: 'edit', color: 'bg-red-500', path: '/tools/delete-pages', supportsBatch: false, maxFileSize: 100 },
  { id: 'extract', name: 'Extract Pages', description: 'Extract specific pages', icon: 'FileOutput', category: 'organize', color: 'bg-teal-500', path: '/tools/extract', supportsBatch: false, maxFileSize: 100 },
  { id: 'watermark', name: 'Add Watermark', description: 'Add text or image watermark', icon: 'Droplets', category: 'secure', color: 'bg-indigo-500', path: '/tools/watermark', supportsBatch: true, maxFileSize: 50 },
  { id: 'protect', name: 'Protect PDF', description: 'Password protect your PDF', icon: 'Shield', category: 'secure', color: 'bg-amber-500', path: '/tools/protect', supportsBatch: false, maxFileSize: 50 },
  { id: 'unlock', name: 'Unlock PDF', description: 'Remove PDF password', icon: 'Unlock', category: 'secure', color: 'bg-emerald-500', path: '/tools/unlock', supportsBatch: false, maxFileSize: 50 },
  { id: 'sign', name: 'Sign PDF', description: 'Add digital signature', icon: 'PenTool', category: 'secure', color: 'bg-rose-500', path: '/tools/sign', supportsBatch: false, maxFileSize: 50 },
  { id: 'ocr', name: 'PDF OCR', description: 'Make scanned PDFs searchable', icon: 'ScanLine', category: 'ai', color: 'bg-cyan-500', path: '/tools/ocr', supportsBatch: true, maxFileSize: 50 },
  { id: 'compare', name: 'Compare PDFs', description: 'Compare two PDF documents', icon: 'GitCompare', category: 'ai', color: 'bg-violet-500', path: '/tools/compare', supportsBatch: false, maxFileSize: 50 },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to DOCX', icon: 'FileText', category: 'convert', color: 'bg-sky-500', path: '/tools/pdf-to-word', supportsBatch: true, maxFileSize: 50 },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF to XLSX', icon: 'Table', category: 'convert', color: 'bg-lime-500', path: '/tools/pdf-to-excel', supportsBatch: true, maxFileSize: 50 },
  { id: 'pdf-to-ppt', name: 'PDF to PPT', description: 'Convert PDF to PowerPoint', icon: 'Presentation', category: 'convert', color: 'bg-pink-500', path: '/tools/pdf-to-ppt', supportsBatch: true, maxFileSize: 50 },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF to images', icon: 'Image', category: 'convert', color: 'bg-fuchsia-500', path: '/tools/pdf-to-jpg', supportsBatch: true, maxFileSize: 50 },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert DOCX to PDF', icon: 'FileType', category: 'convert', color: 'bg-blue-600', path: '/tools/word-to-pdf', supportsBatch: true, maxFileSize: 50 },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert XLSX to PDF', icon: 'Sheet', category: 'convert', color: 'bg-green-600', path: '/tools/excel-to-pdf', supportsBatch: true, maxFileSize: 50 },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert images to PDF', icon: 'Images', category: 'convert', color: 'bg-orange-600', path: '/tools/jpg-to-pdf', supportsBatch: true, maxFileSize: 50 },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert web pages to PDF', icon: 'Globe', category: 'convert', color: 'bg-red-600', path: '/tools/html-to-pdf', supportsBatch: false, maxFileSize: 50 },
  { id: 'merge-images', name: 'Merge Images', description: 'Combine images into PDF', icon: 'Layers', category: 'student', color: 'bg-yellow-500', path: '/tools/merge-images', supportsBatch: true, maxFileSize: 50 },
  { id: 'resize-pdf', name: 'Resize PDF', description: 'Change PDF page size', icon: 'Maximize', category: 'edit', color: 'bg-slate-500', path: '/tools/resize', supportsBatch: true, maxFileSize: 50 },
  { id: 'reorder', name: 'Reorder Pages', description: 'Reorder PDF pages', icon: 'ArrowUpDown', category: 'organize', color: 'bg-zinc-500', path: '/tools/reorder', supportsBatch: false, maxFileSize: 100 },
  { id: 'add-page-numbers', name: 'Add Page Numbers', description: 'Add page numbers', icon: 'Hash', category: 'edit', color: 'bg-neutral-500', path: '/tools/page-numbers', supportsBatch: true, maxFileSize: 50 },
  { id: 'header-footer', name: 'Header & Footer', description: 'Add headers and footers', icon: 'PanelTop', category: 'edit', color: 'bg-stone-500', path: '/tools/header-footer', supportsBatch: true, maxFileSize: 50 },
]

export const categories: ToolCategory[] = [
  { id: 'popular', name: 'Popular Tools', icon: 'Star', tools: tools.filter(t => ['merge', 'split', 'compress', 'convert', 'edit'].includes(t.id)) },
  { id: 'organize', name: 'Organize PDF', icon: 'Folder', tools: tools.filter(t => t.category === 'organize') },
  { id: 'edit', name: 'Edit PDF', icon: 'Edit', tools: tools.filter(t => t.category === 'edit') },
  { id: 'convert', name: 'Convert PDF', icon: 'RefreshCw', tools: tools.filter(t => t.category === 'convert') },
  { id: 'secure', name: 'Secure PDF', icon: 'Lock', tools: tools.filter(t => t.category === 'secure') },
  { id: 'optimize', name: 'Optimize PDF', icon: 'Zap', tools: tools.filter(t => t.category === 'optimize') },
  { id: 'student', name: 'Student Tools', icon: 'GraduationCap', tools: tools.filter(t => t.category === 'student') },
  { id: 'ai', name: 'AI Tools', icon: 'Sparkles', tools: tools.filter(t => t.category === 'ai') },
]

export const getToolById = (id: string) => tools.find(t => t.id === id)
export const getToolsByCategory = (category: string) => tools.filter(t => t.category === category)
