import { useState, useMemo } from "react";

interface PaginationOptions<T> {
  items: T[];
  itemsPerPage: number;
  initialPage?: number;
  maxPageButtons?: number;
}

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentItems: T[];
  pageNumbers: number[];
  indexOfFirstItem: number;
  indexOfLastItem: number;
  paginate: (pageNumber: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export function usePagination<T>({
  items,
  itemsPerPage,
  initialPage = 1,
  maxPageButtons = 5,
}: PaginationOptions<T>): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Reset to page 1 if current page exceeds total pages
    if (currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-render
      setCurrentPage(1);
    }

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Create page navigation array
    const pageNumbers: number[] = [];

    // Logic to determine which page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust start page if we're near the end
    if (endPage === totalPages && endPage > maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Page change handler
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Go to previous/next page handlers
    const goToPreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const goToNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    return {
      currentPage,
      totalPages,
      currentItems,
      pageNumbers,
      indexOfFirstItem,
      indexOfLastItem,
      paginate,
      goToPreviousPage,
      goToNextPage,
    };
  }, [currentPage, items, itemsPerPage, maxPageButtons]);
}
