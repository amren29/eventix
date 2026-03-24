import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, orgName } = await req.json();

    if (!firstName || !email || !password || !orgName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create org slug from name
    const slug = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check slug uniqueness and append suffix if needed
    let finalSlug = slug;
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });
    if (existingOrg) {
      finalSlug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create user + organization in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          hashedPassword,
          role: "organizer",
        },
      });

      const org = await tx.organization.create({
        data: {
          name: orgName,
          slug: finalSlug,
          ownerId: newUser.id,
          members: { connect: { id: newUser.id } },
        },
      });

      await tx.user.update({
        where: { id: newUser.id },
        data: { organizationId: org.id },
      });

      return newUser;
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
