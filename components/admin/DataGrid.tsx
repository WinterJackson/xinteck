"use client";

import { Edit, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataGridProps {
  columns: Column[];
  data: any[];
  actions?: {
    onEdit?: (id: any) => void;
    onDelete?: (id: any[]) => void;
    onView?: (id: any) => void;
  };
  selectable?: boolean;
  editUrl?: string; // Optional URL pattern for edit links if onEdit not used
   hideSearch?: boolean; // Hide internal search bar if parent has its own
   hideBulkActions?: boolean; // Hide bulk action buttons (delete)
 }
 
 export function DataGrid({ columns, data, actions, selectable = true, editUrl, hideSearch = false, hideBulkActions = false }: DataGridProps) {
   const [selectedItems, setSelectedItems] = useState<any[]>([]);
   const [search, setSearch] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
 
   // Filter Data
   const filteredData = data.filter(row => 
      Object.values(row).some(val => 
         String(val).toLowerCase().includes(search.toLowerCase())
      )
   );
 
   // Pagination Logic
   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
   const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );
 
   const toggleSelect = (id: any) => {
     if (selectedItems.includes(id)) {
       setSelectedItems(selectedItems.filter(item => item !== id));
     } else {
       setSelectedItems([...selectedItems, id]);
     }
   };
 
   const toggleAll = () => {
     if (selectedItems.length === paginatedData.length) {
       setSelectedItems([]);
     } else {
       setSelectedItems(paginatedData.map(row => row.id));
     }
   };
 
   const isAllSelected = paginatedData.length > 0 && selectedItems.length === paginatedData.length;
   const onDelete = actions?.onDelete;
 
   const showToolbar = !hideSearch || (!hideBulkActions && onDelete);
 
   return (
     <div className="flex flex-col gap-4">
        {/* Actions Bar */}
        {showToolbar && (
           <div className="flex justify-between items-center gap-2 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 p-3 md:p-4 rounded-[10px] backdrop-blur-md">
               {!hideSearch && (
                <div className="relative flex-1 md:flex-none">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                   <input 
                     type="text" 
                     placeholder="Search records..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-[8px] text-sm text-white placeholder:text-white/20 focus:border-gold/50 outline-none w-full md:w-64"
                   />
                </div>
               )}
               
               <div className="flex gap-2 shrink-0">
                  {/* Filter button removed as per request */}
                  {onDelete && !hideBulkActions && (
                     <button 
                       onClick={() => selectedItems.length > 0 && onDelete(selectedItems)}
                       disabled={selectedItems.length === 0}
                       className="p-2 bg-red-500/10 border border-red-500/20 rounded-[8px] text-red-500 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Trash2 size={18} />
                     </button>
                  )}
               </div>
           </div>
        )}
 
        {/* Data Table */}
        <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] overflow-hidden backdrop-blur-md">
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                       <th className="p-4 w-10">
                          <div className="w-4 h-4 rounded-[4px] border border-white/20 flex items-center justify-center cursor-pointer" onClick={toggleAll}>
                             {isAllSelected && <div className="w-2 h-2 bg-gold rounded-[2px]" />}
                          </div>
                       </th>
                       {columns.map((col) => (
                          <th key={col.key} className="p-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">
                             {col.label}
                          </th>
                       ))}
                       <th className="p-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {paginatedData.map((row: any) => (
                       <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4">
                             <div 
                                className={`w-4 h-4 rounded-[4px] border ${selectedItems.includes(row.id) ? 'border-gold bg-gold/20' : 'border-white/20'} flex items-center justify-center cursor-pointer`}
                                onClick={() => toggleSelect(row.id)}
                             >
                                {selectedItems.includes(row.id) && <div className="w-2 h-2 bg-gold rounded-[2px]" />}
                             </div>
                          </td>
                          {columns.map((col) => (
                             <td key={col.key} className="p-4 text-xs md:text-sm text-white font-medium whitespace-nowrap">
                                {col.render ? col.render(row) : row[col.key]}
                             </td>
                          ))}
                          <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2 text-opacity-100">
                                 {editUrl ? (
                                     <Link href={`${editUrl}/${row.id}`}>
                                         <button className="p-1.5 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-gold transition-colors">
                                             <Edit size={16} />
                                         </button>
                                     </Link>
                                 ) : actions?.onEdit && (
                                     <button 
                                         onClick={() => actions.onEdit!(row.id)}
                                         className="p-1.5 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-gold transition-colors"
                                     >
                                         <Edit size={16} />
                                     </button>
                                 )}
                                 {onDelete && (
                                    <button 
                                       onClick={() => onDelete([row.id])}
                                       className="p-1.5 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-red-400 transition-colors"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 )}
                              </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
             <span>Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} results</span>
             <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-[6px] hover:bg-white/10 disabled:opacity-50 text-white"
                >
                   Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-[6px] hover:bg-white/10 disabled:opacity-50 text-white"
                >
                   Next
                </button>
             </div>
          </div>
       </div>
    </div>);
}
