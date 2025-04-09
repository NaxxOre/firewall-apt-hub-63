
export const ADMIN_USER = {
  username: "mrbuff",
  email: "aung4928ato@gmail.com",
  password: "Mrbuff1234"
};

export const CATEGORIES = [
  {
    name: "Cryptography",
    slug: "cryptography",
  },
  {
    name: "Web",
    slug: "web",
  },
  {
    name: "Reverse",
    slug: "reverse",
  },
  {
    name: "Forensics",
    slug: "forensics",
  },
  {
    name: "Binary Exploit",
    slug: "binary-exploit",
  },
  {
    name: "Pwn",
    slug: "pwn",
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
