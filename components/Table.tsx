import React, { ReactNode } from "react";

type TableColumn<R extends Record<string, string | number>> = {
  key: Extract<keyof R, string>;
  title: string;
  renderRow?: (row: R) => ReactNode;
};

type TableProps<R extends Record<string, string | number>> = {
  columns: TableColumn<R>[];
  rows: R[];
  rowKey: Extract<keyof R, string>;
};

const Table = <R extends Record<string, string | number>>({
  columns,
  rows,
  rowKey,
}: TableProps<R>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <td key={col.key}>{col.title}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[rowKey]}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.renderRow ? col.renderRow(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
