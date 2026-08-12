import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteSubscriberRequest,
  exportSubscribersCsvRequest,
  getNewsletterStatsRequest,
  listSubscribersRequest,
} from './newsletterApi';
import {
  getNewsletterErrorMessage,
  mapNewsletterStatsResponse,
  mapSubscribersResponse,
} from './newsletterMappers';

function triggerCsvDownload(csvText: string, filename = 'newsletter_subscribers.csv') {
  const withBom = csvText.startsWith('\uFEFF') ? csvText : `\uFEFF${csvText}`;
  const blob = new Blob([withBom], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Delay revoke so the browser can finish reading the blob URL on Windows.
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function blobToCsvText(data: unknown): Promise<string> {
  let text = '';
  if (data instanceof Blob) {
    text = await data.text();
  } else if (typeof data === 'string') {
    text = data;
  } else if (data instanceof ArrayBuffer) {
    text = new TextDecoder('utf-8').decode(data);
  } else {
    text = String(data ?? '');
  }

  const trimmed = text.replace(/^\uFEFF/, '').trim();
  if (!trimmed) {
    throw new Error('Export returned an empty file.');
  }

  // Auth/proxy errors often come back as JSON blobs with responseType: 'blob'.
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as { message?: string };
      throw new Error(parsed.message || 'Export failed.');
    } catch (err) {
      if (err instanceof Error && err.message !== 'Export failed.') throw err;
      throw new Error('Export failed.');
    }
  }

  return trimmed.replace(/\r?\n/g, '\r\n');
}

async function getNewsletterExportErrorMessage(
  error: unknown,
  fallback: string,
): Promise<string> {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { data?: unknown } }).response?.data instanceof Blob
  ) {
    try {
      const text = await (
        error as { response: { data: Blob } }
      ).response.data.text();
      const parsed = JSON.parse(text) as { message?: string };
      if (parsed.message) return parsed.message;
    } catch {
      // fall through
    }
  }
  return getNewsletterErrorMessage(error, fallback);
}

export const fetchNewsletterData = createAsyncThunk(
  'adminNewsletter/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const [listRes, statsRes] = await Promise.all([
        listSubscribersRequest(),
        getNewsletterStatsRequest(),
      ]);
      return {
        subscribers: mapSubscribersResponse(listRes.data),
        stats: mapNewsletterStatsResponse(statsRes.data),
      };
    } catch (err) {
      return rejectWithValue(
        getNewsletterErrorMessage(err, 'Failed to load newsletter subscribers.'),
      );
    }
  },
);

export const deleteNewsletterSubscriber = createAsyncThunk(
  'adminNewsletter/deleteSubscriber',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSubscriberRequest(id);
      const statsRes = await getNewsletterStatsRequest();
      return {
        id,
        stats: mapNewsletterStatsResponse(statsRes.data),
      };
    } catch (err) {
      return rejectWithValue(
        getNewsletterErrorMessage(err, 'Failed to delete subscriber.'),
      );
    }
  },
);

export const exportNewsletterCsv = createAsyncThunk(
  'adminNewsletter/exportCsv',
  async (_, { rejectWithValue }) => {
    try {
      const res = await exportSubscribersCsvRequest();
      const csvText = await blobToCsvText(res.data);
      triggerCsvDownload(csvText, 'newsletter_subscribers.csv');
      return true;
    } catch (err) {
      return rejectWithValue(
        await getNewsletterExportErrorMessage(err, 'Failed to export subscribers.'),
      );
    }
  },
);
