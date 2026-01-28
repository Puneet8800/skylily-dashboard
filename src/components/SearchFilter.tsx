'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: string[];
  resultCount?: number;
  totalCount?: number;
}

export default function SearchFilter({ 
  searchTerm, 
  onSearchChange, 
  activeFilter, 
  onFilterChange,
  filters,
  resultCount,
  totalCount
}: SearchFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className="space-y-4 mb-8"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search 
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200",
              searchTerm ? "text-teal-400" : "text-zinc-500 group-focus-within:text-teal-400"
            )} 
            size={18} 
          />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tools by name or description..."
            className={cn(
              "w-full h-12 pl-12 pr-12",
              "bg-white/[0.03] border-white/[0.08]",
              "text-white placeholder:text-zinc-500",
              "focus:bg-white/[0.05] focus:border-teal-500/40",
              "focus-visible:ring-1 focus-visible:ring-teal-500/30",
              "transition-all duration-200",
              "rounded-xl"
            )}
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Filter Icon for Mobile */}
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden h-12 w-12 bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]"
        >
          <SlidersHorizontal size={18} className="text-zinc-400" />
        </Button>
      </div>
      
      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-zinc-500 mr-2">
          <Sparkles size={14} className="text-teal-500" />
          <span className="text-xs uppercase tracking-wider">Filter</span>
        </div>
        
        {filters.map((filter) => (
          <motion.button
            key={filter}
            onClick={() => onFilterChange(filter)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              activeFilter === filter
                ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/20"
                : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white border border-transparent hover:border-white/[0.08]"
            )}
          >
            {filter}
          </motion.button>
        ))}
        
        {/* Result Count */}
        <AnimatePresence>
          {(searchTerm || activeFilter !== 'All') && resultCount !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-auto"
            >
              <Badge variant="outline" className="bg-white/[0.03] border-white/[0.08] text-zinc-400">
                {resultCount} of {totalCount} results
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
