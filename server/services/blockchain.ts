import { createHash } from "crypto";

export interface BlockchainData {
  patientId: string;
  patientName: string;
  age: number | null;
  problemDesc: string | null;
  profileDate: Date;
  accessData: string | null;
  gender: string | null;
}

export class BlockchainService {
  static generateHash(data: BlockchainData): string {
    // Create a deterministic string from patient data
    const dataString = JSON.stringify({
      patientId: data.patientId,
      patientName: data.patientName,
      age: data.age,
      problemDesc: data.problemDesc,
      profileDate: data.profileDate.toISOString(),
      accessData: data.accessData,
      gender: data.gender,
      timestamp: data.profileDate.getTime(),
    });

    // Generate SHA-256 hash
    const hash = createHash("sha256").update(dataString).digest("hex");
    
    // Format as blockchain-style hash with 0x prefix
    return `0x${hash}`;
  }

  static verifyHash(data: BlockchainData, hash: string): boolean {
    const generatedHash = this.generateHash(data);
    return generatedHash === hash;
  }

  static addTransaction(data: BlockchainData): { hash: string; data: BlockchainData } {
    const hash = this.generateHash(data);
    return { hash, data };
  }
}
