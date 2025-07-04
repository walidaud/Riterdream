import React, { useState, useEffect } from 'react';
import { Plus, User, BookOpen, Palette, FileText, Save, PenTool, ChevronLeft, Edit, Trash2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const Riterdream = () => {
  const [currentEmotion, setCurrentEmotion] = useState('hopeful');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [stories, setStories] = useState([]);

  const storyData = stories[selectedStoryIndex] || {
  title: '',
  characters: [],
  plotPoints: [],
  chapters: [],
  themes: ['hopeful'],
  notes: []
};

  const emotions = {
    hopeful: { name: 'Hopeful', colors: 'from-amber-50 to-orange-100', accent: 'bg-amber-400', text: 'text-amber-900', card: 'bg-white/80 border-amber-200', button: 'bg-amber-500 hover:bg-amber-600', font: 'font-sans', animation: 'animate-pulse', shadow: 'shadow-amber-200/50' },
    melancholy: { name: 'Melancholy', colors: 'from-slate-100 to-blue-100', accent: 'bg-slate-400', text: 'text-slate-800', card: 'bg-white/60 border-slate-300', button: 'bg-slate-500 hover:bg-slate-600', font: 'font-serif', animation: 'animate-slow-fade', shadow: 'shadow-slate-300/50' },
    thrill: { name: 'Thrill', colors: 'from-red-100 to-orange-100', accent: 'bg-red-500', text: 'text-red-900', card: 'bg-white/90 border-red-200', button: 'bg-red-600 hover:bg-red-700', font: 'font-mono', animation: 'animate-bounce', shadow: 'shadow-red-300/50' },
    mystery: { name: 'Mystery', colors: 'from-gray-200 to-gray-300', accent: 'bg-gray-600', text: 'text-gray-900', card: 'bg-white/50 border-gray-400', button: 'bg-gray-700 hover:bg-gray-800', font: 'font-mono', animation: 'animate-pulse', shadow: 'shadow-gray-400/50' },
    wonder: { name: 'Wonder', colors: 'from-purple-100 to-pink-100', accent: 'bg-purple-400', text: 'text-purple-900', card: 'bg-white/70 border-purple-200', button: 'bg-purple-500 hover:bg-purple-600', font: 'font-sans', animation: 'animate-wiggle', shadow: 'shadow-purple-300/50' },
    rage: { name: 'Rage', colors: 'from-red-200 to-red-300', accent: 'bg-red-600', text: 'text-red-950', card: 'bg-white/80 border-red-400', button: 'bg-red-700 hover:bg-red-800', font: 'font-bold', animation: 'animate-shake', shadow: 'shadow-red-400/50' }
  };

  const theme = emotions[currentEmotion];

  const detectEmotion = async (text) => {
  try {
    const res = await fetch(`${API_URL}/api/analyze-emotion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    return data.emotion || 'hopeful';
  } catch (err) {
    console.error('Emotion detection failed', err);
    return 'hopeful';
  }
};

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
      @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(1deg); } 75% { transform: rotate(-1deg); } }
      @keyframes slow-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      @keyframes glow { 0% { box-shadow: 0 0 5px rgba(0,0,0,0.1); } 50% { box-shadow: 0 0 20px rgba(0,0,0,0.3); } 100% { box-shadow: 0 0 5px rgba(0,0,0,0.1); } }

      .animate-shake { animation: shake 0.5s ease-in-out infinite; }
      .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
      .animate-slow-fade { animation: slow-fade 3s ease-in-out infinite; }
      .animate-glow { animation: glow 2s ease-in-out infinite; }
      .transition-all { transition: all 0.3s ease-in-out; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
  fetch(`${API_URL}/api/stories`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) setStories(data);
    })
    .catch(err => console.error('Error loading stories:', err));
}, []);


  const updateStories = (newStoryData) => {
  const updatedStories = stories.map((story, idx) =>
    idx === selectedStoryIndex ? newStoryData : story
  );
  setStories(updatedStories);

  // Save to backend
  fetch(`${API_URL}/api/stories/${newStoryData._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStoryData),
  })
    .then(res => res.json())
    .then(data => console.log('Story updated:', data))
    .catch(err => console.error('Error saving story:', err));
};

  const updateField = async (section, index, key, value) => {
    const updated = { ...storyData };
    const sectionData = [...updated[section]];
    if (key) {
  sectionData[index] = { ...sectionData[index], [key]: value };
  if (key !== 'emotion') {
    const emotion = await detectEmotion(value);
    sectionData[index].emotion = emotion;
  }
} else {
  sectionData[index] = value;
  const combined = Object.values(value).join(' ');
  const emotion = await detectEmotion(combined);
  sectionData[index].emotion = emotion;
}
    updated[section] = sectionData;
    updateStories(updated);
  };

  const deleteItem = (section, index) => {
    const updated = { ...storyData };
    updated[section].splice(index, 1);
    updateStories(updated);
  };

  const addNewStory = () => {
  const newStory = {
    title: 'New Story',
    characters: [],
    plotPoints: [],
    chapters: [],
    themes: ['hopeful'],
    notes: []
  };

  fetch(`${API_URL}/api/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStory)
  })
    .then(res => res.json())
    .then((savedStory) => {
      setStories(prev => {
        const newStories = [...prev, savedStory];
        setSelectedStoryIndex(newStories.length - 1);
        return newStories;
      });
    })
    .catch(err => console.error('Failed to create new story:', err));
};


  const renderTabContent = () => {
    switch (activeTab) {
      case 'chapters':
  return (
    <div className="space-y-4 mt-4">
      {storyData.chapters.map((chapter, index) => {
        const entryTheme = emotions[chapter.emotion || 'hopeful'];

        return (
          <div key={index} className={`p-4 border rounded ${entryTheme.card} ${entryTheme.shadow} hover:${entryTheme.animation} flex flex-col transition-all`}>

            <input
              type="text"
              placeholder="Chapter Title"
              value={chapter.title || ''}
              onChange={(e) => updateField('chapters', index, 'title', e.target.value)}
              className="mb-2 bg-transparent outline-none font-semibold"
            />
            <textarea
              value={chapter.content || ''}
              onChange={(e) => updateField('chapters', index, 'content', e.target.value)}
              className="bg-transparent outline-none w-full"
              placeholder="Chapter content..."
            />

            {/* Emotion dropdown */}
            <select
              value={chapter.emotion || 'hopeful'}
              onChange={(e) => updateField('chapters', index, 'emotion', e.target.value)}
              className="mt-2 p-1 rounded bg-white text-sm w-max"
            >
              {Object.entries(emotions).map(([key, mood]) => (
                <option key={key} value={key}>{mood.name}</option>
              ))}
            </select>

            <div className="text-right mt-2">
              <Trash2
                onClick={() => deleteItem('chapters', index)}
                className="cursor-pointer inline-block"
              />
            </div>
          </div>
        );
      })}

      <button
        onClick={() =>
          updateField('chapters', storyData.chapters.length, null, {
            title: '',
            content: '',
            emotion: 'hopeful'
          })
        }
        className={`${theme.button} text-white px-3 py-1 rounded`}
      >
        + Add Chapter
      </button>
    </div>
  );

      case 'characters':
  return (
    <div className="space-y-4 mt-4">
      {storyData.characters.map((char, index) => {
        const entryTheme = emotions[char.emotion || 'hopeful'];

        return (
          <div key={index} className={`p-4 border rounded ${entryTheme.card} ${entryTheme.shadow} hover:${entryTheme.animation} flex flex-col transition-all`}>

            <input
              type="text"
              placeholder="Character Name"
              value={char.name || ''}
              onChange={(e) => updateField('characters', index, 'name', e.target.value)}
              className="mb-2 bg-transparent outline-none font-semibold"
            />
            <textarea
              value={char.description || ''}
              onChange={(e) => updateField('characters', index, 'description', e.target.value)}
              className="bg-transparent outline-none w-full"
              placeholder="Character description..."
            />

            {/* Emotion dropdown */}
            <select
              value={char.emotion || 'hopeful'}
              onChange={(e) => updateField('characters', index, 'emotion', e.target.value)}
              className="mt-2 p-1 rounded bg-white text-sm w-max"
            >
              {Object.entries(emotions).map(([key, mood]) => (
                <option key={key} value={key}>{mood.name}</option>
              ))}
            </select>

            <div className="text-right mt-2">
              <Trash2 onClick={() => deleteItem('characters', index)} className="cursor-pointer inline-block" />
            </div>
          </div>
        );
      })}
      <button
        onClick={() => updateField('characters', storyData.characters.length, null, {
          name: '',
          description: '',
          emotion: 'hopeful'
        })}
        className={`${theme.button} text-white px-3 py-1 rounded`}
      >
        + Add Character
      </button>
    </div>
  );

      case 'plot':
  return (
    <div className="space-y-4 mt-4">
      {storyData.plotPoints.map((plot, index) => {
        const entryTheme = emotions[plot.emotion || 'hopeful'];

        return (
          <div key={index} className={`p-4 border rounded ${entryTheme.card} ${entryTheme.shadow} hover:${entryTheme.animation} flex flex-col transition-all`}>

            <input
              type="text"
              placeholder="Plot Title"
              value={plot.title || ''}
              onChange={(e) => updateField('plotPoints', index, 'title', e.target.value)}
              className="mb-2 bg-transparent outline-none font-semibold"
            />
            <textarea
              value={plot.description || ''}
              onChange={(e) => updateField('plotPoints', index, 'description', e.target.value)}
              className="bg-transparent outline-none w-full"
              placeholder="Plot details..."
            />

            {/* Emotion dropdown */}
            <select
              value={plot.emotion || 'hopeful'}
              onChange={(e) => updateField('plotPoints', index, 'emotion', e.target.value)}
              className="mt-2 p-1 rounded bg-white text-sm w-max"
            >
              {Object.entries(emotions).map(([key, mood]) => (
                <option key={key} value={key}>{mood.name}</option>
              ))}
            </select>

            <div className="text-right mt-2">
              <Trash2 onClick={() => deleteItem('plotPoints', index)} className="cursor-pointer inline-block" />
            </div>
          </div>
        );
      })}
      <button
        onClick={() => updateField('plotPoints', storyData.plotPoints.length, null, {
          title: '',
          description: '',
          emotion: 'hopeful'
        })}
        className={`${theme.button} text-white px-3 py-1 rounded`}
      >
        + Add Plot Point
      </button>
    </div>
  );

      case 'notes':
  return (
    <div className="space-y-4 mt-4">
      {storyData.notes.map((note, index) => {
        const entryTheme = emotions[note.emotion || 'hopeful'];

        return (
          <div key={index} className={`p-4 border rounded ${entryTheme.card} ${entryTheme.shadow} hover:${entryTheme.animation} flex flex-col transition-all`}>

            <input
              type="text"
              placeholder="Note Title"
              value={note.title || ''}
              onChange={(e) => updateField('notes', index, 'title', e.target.value)}
              className="mb-2 bg-transparent outline-none font-semibold"
            />
            <textarea
              value={note.content || ''}
              onChange={(e) => updateField('notes', index, 'content', e.target.value)}
              className="bg-transparent outline-none w-full"
              placeholder="Note content..."
            />

            {/* Emotion dropdown */}
            <select
              value={note.emotion || 'hopeful'}
              onChange={(e) => updateField('notes', index, 'emotion', e.target.value)}
              className="mt-2 p-1 rounded bg-white text-sm w-max"
            >
              {Object.entries(emotions).map(([key, mood]) => (
                <option key={key} value={key}>{mood.name}</option>
              ))}
            </select>

            <div className="text-right mt-2">
              <Trash2 onClick={() => deleteItem('notes', index)} className="cursor-pointer inline-block" />
            </div>
          </div>
        );
      })}
      <button
        onClick={() => updateField('notes', storyData.notes.length, null, {
          title: '',
          content: '',
          emotion: 'hopeful'
        })}
        className={`${theme.button} text-white px-3 py-1 rounded`}
      >
        + Add Note
      </button>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors} transition-all duration-1000 ${theme.font}`}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <select
            value={selectedStoryIndex}
            onChange={(e) => setSelectedStoryIndex(Number(e.target.value))}
            className="text-xl font-semibold bg-white rounded px-3 py-1 shadow"
          >
            {stories.map((s, idx) => (
              <option key={idx} value={idx}>{s.title || `Story ${idx + 1}`}</option>
            ))}
          </select>
          <button onClick={addNewStory} className={`ml-4 ${theme.button} text-white px-3 py-1 rounded`}>+ New Story</button>
        </div>

        <input
          type="text"
          value={storyData.title}
          onChange={(e) => updateStories({ ...storyData, title: e.target.value })}
          className={`text-3xl font-bold ${theme.text} bg-transparent border-none outline-none w-full mt-4`}
          placeholder="Enter your story title..."
        />

        <div className="flex space-x-2 mt-6">
          {[{ id: 'chapters', label: 'Chapters', icon: PenTool }, { id: 'characters', label: 'Characters', icon: User }, { id: 'plot', label: 'Plot', icon: BookOpen }, { id: 'notes', label: 'Notes', icon: FileText }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${activeTab === tab.id ? `${theme.button} text-white` : `${theme.card} ${theme.text} hover:${theme.button} hover:text-white`}`}
            >
              <tab.icon size={18} /> <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Riterdream;
