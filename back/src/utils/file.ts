import { envParsed } from "@back/utils/envParsed"
import { TRPCError } from "@trpc/server"
import { Client } from "minio"

export const minioClient = new Client({
	endPoint: envParsed.MINIO_ENDPOINT,
	useSSL: true,
	accessKey: envParsed.MINIO_ACCESS_KEY,
	secretKey: envParsed.MINIO_SECRET_KEY,
})

export const uploadFileOnMinio = async (params: {
	file: File
	fileName: string
	directory: string
}) => {
	if (params.file.size > 5 * 1024 * 1024) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: `File size ${params.file.size} is too large`,
		})
	}
	const allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
		"image/svg+xml",
	]
	if (!allowedTypes.includes(params.file.type)) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: `File type ${params.file.type} is not allowed`,
		})
	}
	const bucket = envParsed.MINIO_BUCKET
	const buffer = Buffer.from(await params.file.arrayBuffer())
	const bucketExists = await minioClient.bucketExists(bucket)
	if (!bucketExists) {
		throw new TRPCError({
			code: "NOT_IMPLEMENTED",
			message: `Bucket ${bucket} does not exist`,
		})
	}
	const newFileName = `${params.directory}/${params.fileName}-${Date.now()}`
	await minioClient.putObject(bucket, newFileName, buffer, params.file.size, {
		"Content-Type": params.file.type,
	})
	return `https://${envParsed.MINIO_ENDPOINT}/${bucket}/${newFileName}`
}

export const deleteImageOnMinio = async (params: {
	fileName: string
	directory: string
}) => {
	const bucket = envParsed.MINIO_BUCKET
	const filePath = `${params.directory}/${params.fileName}`
	await minioClient.removeObject(bucket, filePath)
}
