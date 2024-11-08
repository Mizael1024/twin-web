-- AlterTable
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "username" TEXT,
ADD COLUMN IF NOT EXISTS "profileImage" TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg',
ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Video"
ADD COLUMN IF NOT EXISTS "title" TEXT;

-- AddUniqueConstraint
ALTER TABLE "User"
ADD CONSTRAINT IF NOT EXISTS "User_username_key" UNIQUE ("username");
