import React, { useState, useMemo } from 'react';
import type { IDCardData } from '../types/idcard';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  CreditCard, 
  Users, 
  GraduationCap, 
  Phone
} from 'lucide-react';

interface IDCardDashboardProps {
  cards: IDCardData[];
  onNewCard: () => void;
  onEditCard: (card: IDCardData) => void;
  onPreviewCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export const IDCardDashboard: React.FC<IDCardDashboardProps> = ({
  cards,
  onNewCard,
  onEditCard,
  onPreviewCard,
  onDeleteCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  // Extract unique courses
  const courses = useMemo(() => {
    const list = Array.from(new Set(cards.map(c => c.courseName).filter(Boolean)));
    return ['ALL', ...list];
  }, [cards]);

  // Filtered cards
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchSearch = 
        card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.studentContact && card.studentContact.includes(searchTerm)) ||
        (card.courseName && card.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchCourse = selectedCourse === 'ALL' || card.courseName === selectedCourse;

      return matchSearch && matchCourse;
    });
  }, [cards, searchTerm, selectedCourse]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ID card for "${name}"?`)) {
      onDeleteCard(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total ID Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total ID Cards</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{cards.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Unique Students */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Students</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{cards.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Programs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Programs</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{courses.length - 1}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, ID card number, contact..."
            className="w-full text-xs font-semibold border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
          >
            {courses.map((c, i) => (
              <option key={i} value={c}>
                {c === 'ALL' ? 'All Courses' : c}
              </option>
            ))}
          </select>

          {/* New ID Card Button */}
          <button
            type="button"
            onClick={onNewCard}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New ID Card</span>
          </button>
        </div>
      </div>

      {/* 3. ID Cards Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">ID Card No</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Primary Contact</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Student Avatar + Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={card.photoUrl || '/id_card_assets/sample_student_photo.jpg'}
                        alt={card.studentName}
                        className="w-10 h-12 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/id_card_assets/sample_student_photo.jpg';
                        }}
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 uppercase tracking-wide">
                          {card.studentName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">DOB: {card.dob || 'N/A'}</p>
                      </div>
                    </div>
                  </td>

                  {/* ID Card No */}
                  <td className="py-3 px-4 font-mono font-bold text-orange-700">
                    <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 rounded-md">
                      {card.id}
                    </span>
                  </td>

                  {/* Course */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-700 uppercase">
                      {card.courseName}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4 font-mono text-slate-700 font-medium">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{card.studentContact || 'N/A'}</span>
                    </div>
                  </td>

                  {/* Blood Group */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-bold text-[11px]">
                      {card.bloodGroup || 'N/A'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPreviewCard(card.id)}
                        className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Preview ID Card"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditCard(card)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit ID Card"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(card.id, card.studentName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete ID Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No ID cards found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
