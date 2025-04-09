
export const ADMIN_USER = {
  username: "admin",
  email: "admin2179@gmail.com",
  password: "admin2179"
};

export const CATEGORIES = [
  {
    id: "1",
    name: "Cryptography",
    slug: "cryptography",
    description: "Encryption, decryption, and cryptographic techniques"
  },
  {
    id: "2",
    name: "Web",
    slug: "web",
    description: "Web exploitation, security vulnerabilities, and web application security"
  },
  {
    id: "3",
    name: "Reverse",
    slug: "reverse",
    description: "Reverse engineering and binary analysis"
  },
  {
    id: "4",
    name: "Forensics",
    slug: "forensics",
    description: "Digital forensics investigation and file analysis"
  },
  {
    id: "5",
    name: "Binary Exploit",
    slug: "binary-exploit",
    description: "Buffer overflows, ROP chains, and other binary exploitation techniques"
  },
  {
    id: "6",
    name: "Pwn",
    slug: "pwn",
    description: "Exploiting program vulnerabilities and privilege escalation"
  },
];

export const CATEGORY_SECTIONS = [
  {
    name: "Codes",
    slug: "codes",
  },
  {
    name: "Write Ups",
    slug: "writeups",
  },
  {
    name: "Testing Tools",
    slug: "testing-tools",
  },
];

export const initialUsers = [
  {
    id: "1",
    username: ADMIN_USER.username,
    email: ADMIN_USER.email,
    password: ADMIN_USER.password,
    isAdmin: true,
    isApproved: true,
    createdAt: new Date(),
  },
];
