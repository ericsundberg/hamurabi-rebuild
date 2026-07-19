import type { AnnualReport } from '../../core/types';
import { makeElement } from '../../ui/dom-helpers';

export function makeAnnualReportList(
  annualReport: AnnualReport | null,
): HTMLUListElement {
  const reportList = makeElement('ul', {
    className: 'annual-report-list',
  });

  for (const line of annualReport?.lines ?? []) {
    reportList.append(
      makeElement('li', {
        textContent: line,
      }),
    );
  }

  return reportList;
}
