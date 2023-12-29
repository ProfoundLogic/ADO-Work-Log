import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function Paginator({ items, itemsPerPage, Component, columns }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Component currentItems={currentItems} columns={columns} />
      <ReactPaginate
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        nextLabel={<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />}
        previousLabel={
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        }
        pageClassName=""
        pageLinkClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        previousClassName=""
        previousLinkClassName="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        nextClassName=""
        nextLinkClassName="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        breakLabel="..."
        breakClassName=""
        breakLinkClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
        containerClassName="isolate inline-flex -space-x-px rounded-md shadow-sm"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}
