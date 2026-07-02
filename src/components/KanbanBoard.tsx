import { useState, useRef } from 'react';
import {
  Plus, FileText, CheckSquare, FolderKanban, Image, Paperclip,
  Trash2, X, GripVertical, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ──────────────────────────────────────────────────────────────────

type CardType = 'task' | 'note' | 'project' | 'photo' | 'file';

interface KanbanCard {
  id: string;
  type: CardType;
  title: string;
  content?: string;
  photoUrl?: string;
  fileName?: string;
  fileSize?: string;
  done?: boolean;
  createdAt: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const CARD_TYPE_META: Record<CardType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  task:    { label: 'Task',    icon: CheckSquare,   color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-100' },
  note:    { label: 'Note',    icon: FileText,      color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-100' },
  project: { label: 'Project', icon: FolderKanban,  color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
  photo:   { label: 'Photo',   icon: Image,         color: 'text-rose-600',   bg: 'bg-rose-50 border-rose-100' },
  file:    { label: 'File',    icon: Paperclip,     color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-100' },
};

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: uid(),
    title: 'Backlog',
    cards: [
      { id: uid(), type: 'project', title: 'Spring 2026 Catalog Launch', content: 'Plan and coordinate new title launches for the spring season.', createdAt: now(), done: false },
      { id: uid(), type: 'note', title: 'Author Pitch Notes', content: 'Review incoming manuscript submissions from authors.', createdAt: now() },
    ]
  },
  {
    id: uid(),
    title: 'In Progress',
    cards: [
      { id: uid(), type: 'task', title: 'Update cover art for 3 titles', content: 'Request new artwork from the design studio.', createdAt: now(), done: false },
    ]
  },
  {
    id: uid(),
    title: 'Review',
    cards: []
  },
  {
    id: uid(),
    title: 'Done',
    cards: []
  },
];

// ─── Card Component ───────────────────────────────────────────────────────────

function KanbanCardItem({
  card,
  onDelete,
  onToggleDone,
}: {
  card: KanbanCard;
  onDelete: () => void;
  onToggleDone: () => void;
}) {
  const meta = CARD_TYPE_META[card.type];
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative bg-white border rounded-xl p-3 shadow-xs hover:shadow-sm transition-all ${card.done ? 'opacity-55' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <GripVertical className="w-3.5 h-3.5 text-stone-300 mt-0.5 shrink-0 cursor-grab" />
          <div className="min-w-0">
            {/* Type badge */}
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border mb-1.5 ${meta.bg} ${meta.color}`}>
              <Icon className="w-2.5 h-2.5" />
              {meta.label}
            </span>

            {/* Title */}
            <p className={`text-xs font-semibold text-stone-800 leading-snug ${card.done ? 'line-through text-stone-400' : ''}`}>
              {card.title}
            </p>

            {/* Content preview */}
            {card.content && (
              <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 font-light leading-relaxed">
                {card.content}
              </p>
            )}

            {/* Photo */}
            {card.type === 'photo' && card.photoUrl && (
              <img
                src={card.photoUrl}
                alt={card.title}
                className="mt-2 w-full h-20 object-cover rounded-lg border border-stone-200"
              />
            )}

            {/* File */}
            {card.type === 'file' && card.fileName && (
              <div className="mt-1.5 flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1">
                <Paperclip className="w-3 h-3 text-stone-500" />
                <span className="text-[10px] font-mono text-stone-600 truncate">{card.fileName}</span>
                {card.fileSize && <span className="text-[9px] text-stone-400 shrink-0">{card.fileSize}</span>}
              </div>
            )}

            <p className="text-[9px] text-stone-400 mt-1.5">{card.createdAt}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          {card.type === 'task' && (
            <button
              onClick={onToggleDone}
              className={`p-1 rounded-md transition-all cursor-pointer text-[9px] font-bold ${
                card.done
                  ? 'text-blue-600 bg-blue-50 opacity-100'
                  : 'opacity-0 group-hover:opacity-100 text-stone-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <CheckSquare className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Add Card Modal ───────────────────────────────────────────────────────────

function AddCardModal({
  initialType,
  onAdd,
  onClose,
}: {
  initialType: CardType;
  onAdd: (card: Omit<KanbanCard, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const [type] = useState<CardType>(initialType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const meta = CARD_TYPE_META[type];
  const Icon = meta.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const card: Omit<KanbanCard, 'id' | 'createdAt'> = {
      type,
      title: title.trim(),
      content: content.trim() || undefined,
      done: type === 'task' ? false : undefined,
      photoUrl: type === 'photo' ? photoUrl.trim() || undefined : undefined,
      fileName: type === 'file' ? fileName.trim() || undefined : undefined,
      fileSize: type === 'file' && fileName ? '— KB' : undefined,
    };
    onAdd(card);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-stone-200 z-10 overflow-hidden"
      >
        <div className={`px-5 py-4 border-b border-stone-100 flex items-center gap-2`}>
          <span className={`p-1.5 rounded-lg ${meta.bg}`}>
            <Icon className={`w-4 h-4 ${meta.color}`} />
          </span>
          <h4 className="font-semibold text-sm text-stone-900">New {meta.label}</h4>
          <button onClick={onClose} className="ml-auto p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
              {meta.label} Title *
            </label>
            <input
              required
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${type === 'task' ? 'Review manuscript' : type === 'note' ? 'Editorial notes' : type === 'project' ? 'Q4 Catalog' : type === 'photo' ? 'Cover artwork' : 'Author contract'}`}
              className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
            />
          </div>

          {(type === 'task' || type === 'note' || type === 'project') && (
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                Description
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add details…"
                rows={3}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 resize-none"
              />
            </div>
          )}

          {type === 'photo' && (
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                Image URL
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              />
              {photoUrl && (
                <img src={photoUrl} alt="preview" className="mt-1.5 w-full h-24 object-cover rounded-lg border border-stone-200" />
              )}
            </div>
          )}

          {type === 'file' && (
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                Attach File
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-dashed border-stone-300 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors"
              >
                <Paperclip className="w-4 h-4 text-stone-400" />
                <span className="text-xs text-stone-500">{fileName || 'Click to choose file…'}</span>
              </div>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Add {meta.label}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main KanbanBoard Component ───────────────────────────────────────────────

export default function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);

  // Modal state
  const [addCardModal, setAddCardModal] = useState<{ type: CardType; columnId: string } | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Column menu
  const [columnMenuId, setColumnMenuId] = useState<string | null>(null);

  // ── Column Operations ───────────────────────────────────────────────────────

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns(prev => [...prev, { id: uid(), title: newColumnTitle.trim(), cards: [] }]);
    setNewColumnTitle('');
    setAddingColumn(false);
  };

  const deleteColumn = (columnId: string) => {
    setColumns(prev => prev.filter(c => c.id !== columnId));
    setColumnMenuId(null);
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    setColumns(prev => prev.map(c => c.id === columnId ? { ...c, title: newTitle } : c));
  };

  // ── Card Operations ─────────────────────────────────────────────────────────

  const addCard = (columnId: string, cardData: Omit<KanbanCard, 'id' | 'createdAt'>) => {
    const newCard: KanbanCard = { ...cardData, id: uid(), createdAt: now() };
    setColumns(prev => prev.map(c =>
      c.id === columnId ? { ...c, cards: [newCard, ...c.cards] } : c
    ));
    setAddCardModal(null);
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns(prev => prev.map(c =>
      c.id === columnId ? { ...c, cards: c.cards.filter(card => card.id !== cardId) } : c
    ));
  };

  const toggleCardDone = (columnId: string, cardId: string) => {
    setColumns(prev => prev.map(c =>
      c.id === columnId
        ? { ...c, cards: c.cards.map(card => card.id === cardId ? { ...card, done: !card.done } : card) }
        : c
    ));
  };

  // ── Action Toolbar ──────────────────────────────────────────────────────────

  const ACTION_BUTTONS: { label: string; type?: CardType; onClick?: () => void; icon: React.ElementType; color: string }[] = [
    { label: '+ Column',     icon: Plus,         color: 'bg-stone-900 text-white hover:bg-black', onClick: () => setAddingColumn(true) },
    { label: 'New Task',     type: 'task',    icon: CheckSquare,   color: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' },
    { label: 'New Note',     type: 'note',    icon: FileText,      color: 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' },
    { label: 'New Project',  type: 'project', icon: FolderKanban,  color: 'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100' },
    { label: 'Add Photo',    type: 'photo',   icon: Image,         color: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' },
    { label: 'Add File',     type: 'file',    icon: Paperclip,     color: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' },
  ];

  const handleActionButton = (btn: typeof ACTION_BUTTONS[number]) => {
    if (btn.onClick) { btn.onClick(); return; }
    if (btn.type) {
      // Default to first column or show column picker — for simplicity, add to first column
      const firstCol = columns[0];
      if (firstCol) setAddCardModal({ type: btn.type, columnId: firstCol.id });
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        {ACTION_BUTTONS.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              onClick={() => handleActionButton(btn)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ${btn.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Add Column inline input */}
      <AnimatePresence>
        {addingColumn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl p-3">
              <input
                autoFocus
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addColumn(); if (e.key === 'Escape') setAddingColumn(false); }}
                placeholder="Column title…"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              />
              <button onClick={addColumn} className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-black transition-colors">
                Add
              </button>
              <button onClick={() => setAddingColumn(false)} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex-shrink-0 w-72 bg-stone-50/80 border border-stone-200 rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-xs text-stone-800 truncate">{col.title}</span>
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">
                  {col.cards.length}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setColumnMenuId(columnMenuId === col.id ? null : col.id)}
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {columnMenuId === col.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      className="absolute right-0 top-7 z-20 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden w-40"
                    >
                      {(['task', 'note', 'project', 'photo', 'file'] as CardType[]).map(type => {
                        const m = CARD_TYPE_META[type];
                        const I = m.icon;
                        return (
                          <button
                            key={type}
                            onClick={() => { setAddCardModal({ type, columnId: col.id }); setColumnMenuId(null); }}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors`}
                          >
                            <I className={`w-3.5 h-3.5 ${m.color}`} /> New {m.label}
                          </button>
                        );
                      })}
                      <div className="border-t border-stone-100" />
                      <button
                        onClick={() => deleteColumn(col.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Column
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[520px]">
              <AnimatePresence>
                {col.cards.map((card) => (
                  <KanbanCardItem
                    key={card.id}
                    card={card}
                    onDelete={() => deleteCard(col.id, card.id)}
                    onToggleDone={() => toggleCardDone(col.id, card.id)}
                  />
                ))}
              </AnimatePresence>

              {col.cards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-stone-300">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium">No cards yet</span>
                </div>
              )}
            </div>

            {/* Quick add card button */}
            <div className="px-3 pb-3">
              <button
                onClick={() => setAddCardModal({ type: 'task', columnId: col.id })}
                className="flex items-center gap-1.5 w-full py-1.5 px-3 text-xs text-stone-400 hover:text-stone-700 hover:bg-stone-100 border border-dashed border-stone-300 hover:border-stone-400 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add card
              </button>
            </div>
          </div>
        ))}

        {/* Inline add column button at end of board */}
        <button
          onClick={() => setAddingColumn(true)}
          className="flex-shrink-0 w-72 h-16 self-start flex items-center justify-center gap-2 text-stone-400 hover:text-stone-700 border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add column
        </button>
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {addCardModal && (
          <AddCardModal
            initialType={addCardModal.type}
            onAdd={(cardData) => addCard(addCardModal.columnId, cardData)}
            onClose={() => setAddCardModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Click-outside to close column menu */}
      {columnMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setColumnMenuId(null)} />
      )}
    </div>
  );
}
