import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemName?: string; // e.g., "patients", "doctors", "schedules"
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPreviousPage,
  onNextPage,
  hasNextPage,
  hasPreviousPage,
  itemName = "items",
}) => {
  // Don't show pagination if no items or only 1 page
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        title="Previous Page"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <span className="pagination-info">
        Page {currentPage} of {totalPages} ({totalItems} {itemName})
      </span>

      <button
        className="pagination-btn"
        onClick={onNextPage}
        disabled={!hasNextPage}
        title="Next Page"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Pagination;
