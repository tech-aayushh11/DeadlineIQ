import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Code,
  ExternalLink,
  MapPin,
  User,
  GraduationCap,
  Layers,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject, ResourceItem } from '../types/subject';

export const SubjectsPage: React.FC = () => {
  const { subjects, student } = useApp();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[6]?.id || subjects[0]?.id); // Default Python Lab
  const [searchResource, setSearchResource] = useState('');

  const currentSubject: Subject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const filteredResources = currentSubject.resources.filter((r) =>
    r.name.toLowerCase().includes(searchResource.toLowerCase())
  );

  const getResourceIcon = (type: ResourceItem['type']) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'code':
        return <Code className="w-4 h-4 text-emerald-500" />;
      case 'notes':
      case 'link':
      default:
        return <BookOpen className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfbfc] dark:bg-[#111317] overflow-hidden select-none">
      {/* College & Department Sub-Header */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14161b] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {student.institution}
            </h2>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {student.program} • Academic Year {student.academicYear} • Semester {student.semester}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs">
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono">
            Div: {student.division}
          </span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono">
            Roll: {student.rollNo}
          </span>
        </div>
      </div>

      {/* Main Two-Pane View: Subject Cards Left + Resource Library Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Subject List Column */}
        <div className="w-72 lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14161b] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 shrink-0">
          <div className="p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Semester 1 Courses ({subjects.length})
          </div>
          {subjects.map((sub: Subject) => {
            const isSelected = sub.id === currentSubject.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-blue-600'
                    : 'hover:bg-gray-50 dark:hover:bg-[#1a1d24]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-400 font-semibold">{sub.code}</span>
                  <span
                    className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase"
                    style={{ backgroundColor: sub.badgeBg, color: sub.color }}
                  >
                    {sub.component}
                  </span>
                </div>
                <div className="font-semibold text-xs text-gray-900 dark:text-white mt-1">
                  {sub.name}
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 mt-1">
                  <span>{sub.credits} Credits</span>
                  <span>•</span>
                  <span>{sub.resources.length} resources</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Subject Resources View */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfc] dark:bg-[#111317]">
          {/* Active Subject Banner */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14161b] shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentSubject.color }}
                  />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {currentSubject.name}
                  </h3>
                  <span className="text-xs font-mono text-gray-400">({currentSubject.code})</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Faculty: <strong className="text-gray-700 dark:text-gray-300">{currentSubject.facultyName}</strong></span>
                  </span>
                  {currentSubject.classroom && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{currentSubject.classroom}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span>Component: {currentSubject.component} ({currentSubject.credits} Credits)</span>
                  </span>
                </div>
              </div>

              {/* Search in Resources */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter resources..."
                  value={searchResource}
                  onChange={(e) => setSearchResource(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Resources Grid matching screenshot */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Official Subject Resource Library ({filteredResources.length})
                </h4>
                <span className="text-[11px] text-gray-400">
                  Direct attachments from RSCOE Moodle portal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredResources.map((res: ResourceItem) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-2xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                          {getResourceIcon(res.type)}
                        </div>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                          {res.type}
                        </span>
                      </div>

                      <h5 className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-2">
                        {res.name}
                      </h5>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                      <span>{res.fileSize || 'Online Link'}</span>
                      <button
                        onClick={() => alert(`Opening resource: ${res.name}`)}
                        className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium hover:underline text-[11px]"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
