export async function getErrorMessage(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);

  if (Array.isArray(body?.message)) return body.message.join(", ");
  return body?.message ?? `Fehler (${res.status})`;
}
