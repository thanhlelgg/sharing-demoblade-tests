import { expect, type Locator, type Page } from '@playwright/test';
import { ElementHelper } from '../utils/element-helpers.js';

export class HtmlTable {
  readonly page: Page;
  readonly tableLocator: Locator;
  readonly noDataLabel: string;

  constructor(
    page: Page,
    tableLocator: Locator,
    noDataLabel = 'No data found',
  ) {
    this.page = page;
    this.tableLocator = tableLocator;
    this.noDataLabel = noDataLabel;
  }

  elements = {
    headerLocator: () => this.tableLocator.locator('thead th'),
    rowLocator: () =>
      this.tableLocator.locator('tr').filter({
        hasText: /.+/,
      }),
    rowLocatorByText: (textOrRegex: string | RegExp) =>
      this.elements.rowLocator().filter({ hasText: textOrRegex }),
    dynamicColumn: (columnIdx: number) =>
      this.tableLocator.locator(`tr td:nth-child(${columnIdx + 1})`),
    dynamicGridCell: (columnIdx: number, rowIdx: number) =>
      this.elements.dynamicColumn(columnIdx).nth(rowIdx),
    noDataLabel: (text = this.noDataLabel) =>
      this.tableLocator.locator('td').getByText(text),
  };

  async waitForTableUpdated() {
    await ElementHelper.waitForStableLocatorCount(this.elements.rowLocator());
  }

  async getColumnIdxByName(name: string): Promise<number> {
    await ElementHelper.waitForStableLocatorCount(this.elements.headerLocator());
    const columnIdx = await this.elements
      .headerLocator()
      .evaluateAll((elements, text) => {
        return elements.findIndex((el) =>
          (el.textContent || '').includes(text),
        );
      }, name);
    return columnIdx;
  }

  async getAllHeaders() {
    await ElementHelper.waitForStableLocatorCount(this.elements.headerLocator());
    return await this.elements.headerLocator().allInnerTexts();
  }

  async getRowIdxesByAnchorValue(columnName: string, textToFind: string) {
    const allColumns = await this.getColumnValues(columnName);
    const indexes: number[] = [];

    allColumns.forEach((text, index) => {
      if (text === textToFind) {
        indexes.push(index);
      }
    });

    return indexes;
  }

  async getCellTextByHeader(headerName: string, rowIdx: number): Promise<string> {
    const colIdx = await this.getColumnIdxByName(headerName);
    return this.elements.dynamicGridCell(colIdx, rowIdx).innerText();
  }

  async getColumnValues(columnName: string) {
    const columnIdx = await this.getColumnIdxByName(columnName);
    if ((await this.elements.noDataLabel().count()) > 0) {
      return [];
    }
    return await this.elements.dynamicColumn(columnIdx).allInnerTexts();
  }

  async getTableData(): Promise<Record<string, string>[]> {
    await this.waitForTableUpdated();
    const allHeaders = await this.getAllHeaders();
    await expect(this.elements.rowLocator().first()).toBeVisible();
    const numberOfRows = await this.elements.rowLocator().count();
    const tableData: Record<string, string>[] = [];

    for (let i = 0; i < numberOfRows; i += 1) {
      const rowData: Record<string, string> = {};
      for (let headerIdx = 0; headerIdx < allHeaders.length; headerIdx += 1) {
        rowData[allHeaders[headerIdx]] = await this.elements
          .dynamicGridCell(headerIdx, i)
          .innerText();
      }
      tableData.push(rowData);
    }

    return tableData;
  }
}
