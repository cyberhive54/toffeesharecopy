import { z } from "zod";

// Signaling room schema for Firebase
export const signalingRoomSchema = z.object({
  id: z.string(),
  offer: z.object({
    type: z.literal("offer"),
    sdp: z.string(),
  }).optional(),
  answer: z.object({
    type: z.literal("answer"), 
    sdp: z.string(),
  }).optional(),
  callerCandidates: z.array(z.object({
    candidate: z.string(),
    sdpMLineIndex: z.number().nullable(),
    sdpMid: z.string().nullable(),
  })).optional(),
  calleeCandidates: z.array(z.object({
    candidate: z.string(),
    sdpMLineIndex: z.number().nullable(),
    sdpMid: z.string().nullable(),
  })).optional(),
  createdAt: z.number(),
  status: z.enum(["waiting", "connected", "completed", "failed"]).default("waiting"),
});

export const fileMetadataSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  id: z.string(),
});

export const transferStatusSchema = z.object({
  fileId: z.string(),
  progress: z.number().min(0).max(100),
  status: z.enum(["pending", "transferring", "completed", "failed"]),
  downloadedAt: z.number().optional(),
});

export type SignalingRoom = z.infer<typeof signalingRoomSchema>;
export type FileMetadata = z.infer<typeof fileMetadataSchema>;
export type TransferStatus = z.infer<typeof transferStatusSchema>;
