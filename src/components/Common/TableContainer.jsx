import { Fragment, useEffect, useState } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";
import JobListGlobalFilter from "./GlobalSearchFilter";

/* ---------------------------------------------------
   🔹 GLOBAL DEBOUNCED INPUT (ONLY FOR GLOBAL SEARCH)
----------------------------------------------------*/
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <Col sm={4}>
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Col>
  );
};

/* ---------------------------------------------------
   🔹 MAIN TABLE CONTAINER
----------------------------------------------------*/
const TableContainer = ({
  columns,
  data,
  tableClass,
  theadClass,
  divClassName,
  isBordered,
  isPagination,
  isGlobalFilter,
  paginationWrapper,
  SearchPlaceholder,
  pagination,
  buttonClass,
  buttonName,
  isAddButton,
  isCustomPageSize,
  handleUserClick,
  isJobListGlobalFilter,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // ✔ Smart fuzzy search
  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  // ✔ TanStack Table setup
  const table = useReactTable({
    columns,
    data,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    getState,
  } = table;

  return (
    <Fragment>
      {/* 🔹 Top Controls */}
      <Row className="mb-2">
        {isCustomPageSize && (
          <Col sm={2}>
            <select
              className="form-select pageSize mb-2"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </Col>
        )}

        {/* 🔎 Global Table Search */}
        {isGlobalFilter && (
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(val) => setGlobalFilter(String(val))}
            className="form-control search-box me-2 mb-2 d-inline-block"
            placeholder={SearchPlaceholder}
          />
        )}

        {/* 🔎 Alternative Search Component */}
        {isJobListGlobalFilter && (
          <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />
        )}

        {/* ➕ Add New Button */}
        {isAddButton && (
          <Col sm={6}>
            <div className="text-sm-end">
              <Button
                type="button"
                className={buttonClass}
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus me-1"></i> {buttonName}
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {/* 🔹 Table */}
      <div className={divClassName || "table-responsive"}>
        <Table hover className={tableClass} bordered={isBordered}>
          <thead className={theadClass}>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={
                      header.column.columnDef.enableSorting ? "sorting" : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* 🔹 Pagination */}
      {isPagination && (
        <Row>
          <Col sm={12} md={5}>
            <div className="dataTables_info">
              Showing {getState().pagination.pageSize} of {data.length} results
            </div>
          </Col>

          <Col sm={12} md={7}>
            <div className={paginationWrapper}>
              <ul className={pagination}>
                <li
                  className={`paginate_button page-item previous ${
                    !getCanPreviousPage() ? "disabled" : ""
                  }`}
                >
                  <Link to="#" className="page-link" onClick={previousPage}>
                    <i className="mdi mdi-chevron-left"></i>
                  </Link>
                </li>

                {getPageOptions().map((page, index) => (
                  <li
                    key={index}
                    className={`paginate_button page-item ${
                      getState().pagination.pageIndex === page ? "active" : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      onClick={() => setPageIndex(page)}
                    >
                      {page + 1}
                    </Link>
                  </li>
                ))}

                <li
                  className={`paginate_button page-item next ${
                    !getCanNextPage() ? "disabled" : ""
                  }`}
                >
                  <Link to="#" className="page-link" onClick={nextPage}>
                    <i className="mdi mdi-chevron-right"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,

  tableClass: PropTypes.string,
  theadClass: PropTypes.string,
  divClassName: PropTypes.string,

  isBordered: PropTypes.bool,
  isPagination: PropTypes.bool,
  isGlobalFilter: PropTypes.bool,
  isCustomPageSize: PropTypes.bool,
  isAddButton: PropTypes.bool,
  isJobListGlobalFilter: PropTypes.bool,

  paginationWrapper: PropTypes.string,
  pagination: PropTypes.string,
  SearchPlaceholder: PropTypes.string,

  buttonClass: PropTypes.string,
  buttonName: PropTypes.string,

  handleUserClick: PropTypes.func,
};

DebouncedInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  debounce: PropTypes.number,
};

export default TableContainer;
