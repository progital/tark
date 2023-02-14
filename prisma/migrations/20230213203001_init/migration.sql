-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "expirationDate" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" BLOB NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "smtpSession" TEXT,
    "text" TEXT,
    "html" TEXT,
    "mailboxId" TEXT NOT NULL,
    CONSTRAINT "Message_mailboxId_fkey" FOREIGN KEY ("mailboxId") REFERENCES "Mailbox" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mailbox" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'BASIC',
    "status" TEXT NOT NULL DEFAULT 'ONLINE'
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "tag" TEXT,
    "message" TEXT NOT NULL,
    CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MailboxToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MailboxToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Mailbox" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MailboxToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Message_mailboxId_idx" ON "Message"("mailboxId");

-- CreateIndex
CREATE UNIQUE INDEX "Mailbox_username_key" ON "Mailbox"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_MailboxToUser_AB_unique" ON "_MailboxToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MailboxToUser_B_index" ON "_MailboxToUser"("B");
