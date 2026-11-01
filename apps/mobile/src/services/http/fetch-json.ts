export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 0,
  ) {
    super(message);
  }
}

/** The deadline covers the connection, headers and the complete response body. */
export async function fetchJson(
  url: string,
  options: Pick<RequestInit, 'method' | 'headers' | 'body'>,
  timeoutMs = 10000,
): Promise<{ response: Response; payload: unknown }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      if (controller.signal.aborted || !(error instanceof SyntaxError)) throw error;
      throw new ApiError('invalid_response', 'Serverdən düzgün cavab alınmadı.', response.status);
    }
    return { response, payload };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'network_error',
      controller.signal.aborted
        ? 'Serverin cavabı gecikir. Yenidən yoxla.'
        : 'Serverə qoşulmaq olmadı. İnternet bağlantını yoxla və yenidən cəhd et.',
    );
  } finally {
    clearTimeout(timeout);
  }
}
