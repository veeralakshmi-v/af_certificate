import React, { useRef } from 'react';
import { Upload, RefreshCw, User } from 'lucide-react';

interface PhotoUploaderProps {
  currentPhoto: string;
  onPhotoChange: (base64OrUrl: string) => void;
}

const PRESET_AVATARS = [
  { label: 'Sample Student', url: '/id_card_assets/sample_student_photo.jpg' },
  { label: 'Male Avatar', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Female Avatar', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhoto,
  onPhotoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onPhotoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {/* Preview Thumbnail */}
        <div className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-orange-400 bg-slate-100 shadow-sm shrink-0">
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt="Student Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="flex-1 space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              type="button"
              onClick={() => onPhotoChange('/id_card_assets/sample_student_photo.jpg')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="Reset Sample"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sample</span>
            </button>
          </div>

          <p className="text-[10.5px] text-slate-500">
            JPG, PNG or WebP up to 5MB. Passport size recommended.
          </p>
        </div>
      </div>

      {/* Preset Quick Select */}
      <div className="pt-1">
        <span className="text-[11px] font-semibold text-slate-600 block mb-1">
          Quick Avatars:
        </span>
        <div className="flex gap-2">
          {PRESET_AVATARS.map((avatar, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPhotoChange(avatar.url)}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-[11px] text-slate-700 transition-colors"
            >
              <img src={avatar.url} alt={avatar.label} className="w-4 h-4 rounded-full object-cover" />
              <span>{avatar.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
