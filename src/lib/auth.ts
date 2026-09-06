export async function computeSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:admin-session`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
