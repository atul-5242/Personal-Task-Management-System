'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Category {
  id: number;
  name: string;
}

interface CategorySelectorProps {
  projectId: number;
  onSelect: (categoryId: number) => void;
  onClose: () => void;
}

export default function CategorySelector({ projectId, onSelect, onClose }: CategorySelectorProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/categories?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });

  const createCategory = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, projectId }),
      });
      if (!res.ok) throw new Error('Failed to create category');
      const category = await res.json();
      onSelect(category.id);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Select or Create Category</h2>
        
        {isLoading ? (
          <div className="text-center py-4">Loading categories...</div>
        ) : categories?.length > 0 ? (
          <div className="space-y-2 mb-4">
            <h3 className="font-medium text-gray-700">Existing Categories</h3>
            {categories.map((category: Category) => (
              <button
                key={category.id}
                onClick={() => onSelect(category.id)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-50 focus:bg-purple-50"
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No categories yet. Create your first one!</p>
        )}

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Create New Category</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Enter category name"
            />
            <button
              onClick={createCategory}
              disabled={!newCategoryName || isCreating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
} 