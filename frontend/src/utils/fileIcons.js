import {
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  Presentation,
} from 'lucide-react';

export const FILE_ICONS = {
  pdf: { Icon: FileText, color: 'text-red-600', bg: 'bg-red-500/10' },
  doc: { Icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  sheet: { Icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  slide: { Icon: Presentation, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  image: { Icon: FileImage, color: 'text-violet-600', bg: 'bg-violet-500/10' },
  archive: { Icon: FileArchive, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  text: { Icon: FileText, color: 'text-slate-600', bg: 'bg-slate-500/10' },
  file: { Icon: File, color: 'text-primary', bg: 'bg-primary/10' },
};

export const getFileIconProps = (category) => FILE_ICONS[category] || FILE_ICONS.file;
