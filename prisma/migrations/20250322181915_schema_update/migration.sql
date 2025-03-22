-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "verificationOTP" TEXT,
ADD COLUMN     "verificationOTPExpiresAt" TEXT;
