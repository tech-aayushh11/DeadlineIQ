import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, CheckSquare, FileText, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const QuickSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    tasks,
    subjects,
    openTaskModal,
    setSelectedSubjectFilter,
  } = useApp();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Reset query on open
  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { matchingTasks: [], matchingSubjects: [], matchingResources: [] };
    const q = query.toLowerCase();

    const matchingTasks = tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    );

    const matchingSubjects = subjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );

    const matchingResources: { res: any; subject: any }[] = [];
    subjects.forEach((s) => {
      s.resources.forEach((r) => {
        if (r.name.toLowerCase().includes(q)) {
          matchingResources.push({ res: r, subject: s });
        }
      });
    });

    return { matchingTasks, matchingSubjects, matchingResources };
  }, [query, tasks, subjects]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-xl bg-white dark:bg-[#181a20] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col text-xs select-none">
        {/* Search Input Bar */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks, subjects, lab manuals, and resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-3">
          {!query.trim() ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              Type to instantly search across college courses, assignments, and lab documents.
            </div>
          ) : (
            <>
              {/* Tasks */}
              {searchResults.matchingTasks.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 px-2 mb-1 flex items-center space-x-1">
                    <CheckSquare className="w-3 h-3" />
                    <span>Tasks ({searchResults.matchingTasks.length})</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.matchingTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          openTaskModal(t);
                        }}
                        className="px-2.5 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-200">{t.title}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects */}
              {searchResults.matchingSubjects.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 px-2 mb-1 flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Subjects ({searchResults.matchingSubjects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.matchingSubjects.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          setSelectedSubjectFilter(s.id);
                          navigate('/subjects');
                        }}
                        className="px-2.5 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{s.name}</span>
                          <span className="ml-2 text-[10px] text-gray-400 font-mono">({s.code})</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {searchResults.matchingResources.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 px-2 mb-1 flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>Lab & Study Resources ({searchResults.matchingResources.length})</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.matchingResources.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          setSelectedSubjectFilter(item.subject.id);
                          navigate('/subjects');
                        }}
                        className="px-2.5 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-mono uppercase">
                            {item.res.type}
                          </span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{item.res.name}</span>
                          <span className="text-gray-400 text-[10px]">• {item.subject.shortName}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchingTasks.length === 0 &&
                searchResults.matchingSubjects.length === 0 &&
                searchResults.matchingResources.length === 0 && (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    No results found for "{query}".
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
