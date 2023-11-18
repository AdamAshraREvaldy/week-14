// pages/api/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      // Register
      if (req.body.action === "register") {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
          const { password: passwordDB, ...user } = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
            },
          });
          res.json({ user });
        } catch (err) {
          res.status(400).json({ message: "User already exists" });
        }
      }
      // Login
      else if (req.body.action === "login") {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const secret = process.env.JWT_SECRET || 'defaultSecret';
        const token = jwt.sign({ userId: user.id }, secret);
        res.json({ token });
      }
      // Create a Book
      else if (req.body.action === "createBook") {
        const { title, author, publisher, year, pages } = req.body;
        try {
          const book = await prisma.book.create({
            data: {
              title,
              author,
              publisher,
              year: parseInt(year, 10),
              pages: parseInt(pages, 10),
            },
          });
          res.json({ book });
        } catch (err) {
          console.error(err);
          res.status(400).json({ message: "Book creation failed" });
        }
      }
      // Update a Book
      else if (req.body.action === "updateBook") {
        const { id, title, author, publisher, year, pages } = req.body;
        try {
          const book = await prisma.book.update({
            where: { id: parseInt(id, 10) },
            data: {
              title,
              author,
              publisher,
              year: parseInt(year, 10),
              pages: parseInt(pages, 10),
            },
          });
          res.json({ book });
        } catch (err) {
          console.error(err);
          res.status(400).json({ message: "Book update failed" });
        }
      }
      // Delete a Book
      else if (req.body.action === "deleteBook") {
        const { id } = req.body;
        try {
          const book = await prisma.book.delete({
            where: { id: parseInt(id, 10) },
          });
          res.json({ book });
        } catch (err) {
          console.error(err);
          res.status(400).json({ message: "Book deletion failed" });
        }
      }
      break;

    case "GET":
      // Get All Books
      if (req.query.action === "getAllBooks") {
        const books = await prisma.book.findMany();
        res.json({ books });
      }
      break;

    // Handle other methods or actions as needed...

    default:
      res.status(405).end();
      break;
  }
}
