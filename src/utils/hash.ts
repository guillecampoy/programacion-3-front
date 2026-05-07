const textEncoder = new TextEncoder();

export const hashPassword = async (password: string): Promise<string> => {
  const encodedPassword = textEncoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);

  return Array.from(new Uint8Array(hashBuffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
};

export const isSha256Hash = (value: string): boolean =>
  /^[a-f0-9]{64}$/i.test(value);
