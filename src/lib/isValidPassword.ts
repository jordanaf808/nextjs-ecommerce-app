export async function isValidPassword(password: string, hashedPassword: string) {
  console.log(await hashPassword(password))
  return await hashPassword(password) === hashedPassword
}

async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password)) 

  // "base64" helps convert a verylong string into a shorter one
  return Buffer.from(arrayBuffer).toString("base64")
}