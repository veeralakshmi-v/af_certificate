import React, { useState, useEffect } from 'react';
import type { IDCardData } from './types/idcard';
import { loadIDCards, saveIDCards, generateNextIDCardNumber } from './data/idCardStore';
import { IDCardDashboard } from './components/IDCardDashboard';
import { IDCardEditor } from './components/IDCardEditor';
import { IDCardPreviewView } from './components/IDCardPreviewView';

export const IDCardApp: React.FC = () => {
  const [cards, setCards] = useState<IDCardData[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'editor' | 'preview'>('dashboard');
  const [editingCard, setEditingCard] = useState<IDCardData | null>(null);
  const [previewCardId, setPreviewCardId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loaded = loadIDCards();
    setCards(loaded);
  }, []);

  const handleSaveCard = (savedCard: IDCardData) => {
    let updated: IDCardData[];
    const exists = cards.some(c => c.id === savedCard.id);
    if (exists) {
      updated = cards.map(c => c.id === savedCard.id ? savedCard : c);
    } else {
      updated = [savedCard, ...cards];
    }
    setCards(updated);
    saveIDCards(updated);
    setPreviewCardId(savedCard.id);
    setActiveView('preview');
  };

  const handleDeleteCard = (cardId: string) => {
    const updated = cards.filter(c => c.id !== cardId);
    setCards(updated);
    saveIDCards(updated);
  };

  const handleNewCard = () => {
    const nextId = generateNextIDCardNumber(cards);
    const newCard: IDCardData = {
      id: nextId,
      studentName: '',
      courseName: 'TALLY',
      studentContact: '',
      emergencyPhone: '',
      dob: '2004-01-01',
      bloodGroup: 'B+ve',
      address: '',
      photoUrl: '/id_card_assets/sample_student_photo.jpg',
      qrCodeUrl: `https://www.alphafly.in/verify/id/${nextId}`,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: '2026-12-31',
    };
    setEditingCard(newCard);
    setActiveView('editor');
  };

  const handleEditCard = (card: IDCardData) => {
    setEditingCard(card);
    setActiveView('editor');
  };

  const handlePreviewCard = (cardId: string) => {
    setPreviewCardId(cardId);
    setActiveView('preview');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Navigation for ID Cards */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ID Cards
          </button>
          <button
            type="button"
            onClick={() => {
              if (cards.length > 0) {
                setPreviewCardId(cards[0].id);
                setActiveView('preview');
              } else {
                handleNewCard();
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preview Mode
          </button>
        </div>

        <button
          type="button"
          onClick={handleNewCard}
          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          + New ID Card
        </button>
      </div>

      {/* Main View Router */}
      {activeView === 'dashboard' && (
        <IDCardDashboard
          cards={cards}
          onNewCard={handleNewCard}
          onEditCard={handleEditCard}
          onPreviewCard={handlePreviewCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {activeView === 'editor' && editingCard && (
        <IDCardEditor
          initialData={editingCard}
          isEditingExisting={cards.some(c => c.id === editingCard.id)}
          onSave={handleSaveCard}
          onCancel={() => setActiveView('dashboard')}
        />
      )}

      {activeView === 'preview' && (
        <IDCardPreviewView
          cards={cards}
          selectedCardId={previewCardId}
          onEditCard={handleEditCard}
          onNewCard={handleNewCard}
        />
      )}
    </div>
  );
};
