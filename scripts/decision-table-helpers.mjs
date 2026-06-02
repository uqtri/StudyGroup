/** Shared UTCID templates and matrix builders for decision-table-data.mjs */

export const STD_UTCIDS = [
  { id: 'UTCID01', label: 'Happy Path' },
  { id: 'UTCID02', label: 'Validation Error' },
  { id: 'UTCID03', label: 'Business Rule Error' },
  { id: 'UTCID04', label: 'Authorization Error' },
  { id: 'UTCID05', label: 'Exception / Dependency Failure' },
];

export const EXTRA_UTCID06 = { id: 'UTCID06', label: 'Additional Branch' };

/** Build empty UTCID map with optional overrides */
export function u(overrides = {}) {
  const base = { UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '' };
  return { ...base, ...overrides };
}

/** Standard confirm rows for common HTTP outcomes */
export function stdReturnStatus(utcids, { happy = '200', has404 = false, has403 = false, has409 = false } = {}) {
  const ids = utcids.map((x) => x.id);
  const row = (label, marks) => ({ label, ...Object.fromEntries(ids.map((id) => [id, marks[id] || ''])) });
  const rows = [
    row(happy, u({ UTCID01: 'O' })),
    row('400', u({ UTCID02: 'O', UTCID03: 'O' })),
  ];
  if (has403) rows.push(row('403', u({ UTCID04: 'O' })));
  if (has404) rows.push(row('404', u({ UTCID03: 'O' })));
  if (has409) rows.push(row('409', u({ UTCID03: 'O' })));
  rows.push(row('500', u({ UTCID05: 'O' })));
  return rows;
}

export function stdExceptions(utcids) {
  const ids = utcids.map((x) => x.id);
  return [
    { label: 'None', ...Object.fromEntries(ids.map((id, i) => [id, i === 0 ? 'O' : ''])) },
    { label: 'ApiError.badRequest (Validation)', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID02' ? 'O' : ''])) },
    { label: 'ApiError.notFound', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID03' ? 'O' : ''])) },
    { label: 'ApiError.forbidden', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID04' ? 'O' : ''])) },
    { label: 'Repository/Dependency Error', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID05' ? 'O' : ''])) },
  ];
}

export function stdLogs(utcids) {
  const ids = utcids.map((x) => x.id);
  return [
    { label: 'Operation successful', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID01' ? 'O' : ''])) },
    { label: 'Validation failed', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID02' ? 'O' : ''])) },
    { label: 'Business rule rejected', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID03' ? 'O' : ''])) },
    { label: 'Authorization denied', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID04' ? 'O' : ''])) },
    { label: 'Unhandled exception', ...Object.fromEntries(ids.map((id) => [id, id === 'UTCID05' ? 'O' : ''])) },
  ];
}

export function buildFn({ module, code, service, inputs, repository, security, business, utcids, conditions, returnStatus, returnBody, exceptions, logs }) {
  return { module, service, inputs, repository, security, business, utcids, conditions, returnStatus, returnBody, exceptions, logs };
}
