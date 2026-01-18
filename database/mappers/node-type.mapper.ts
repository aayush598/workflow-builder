import { NodeType } from '@prisma/client';
import type { NodeTypeId } from '@/domain/nodes/node-types';

/**
 * Map domain node type → Prisma NodeType enum
 */
export function mapDomainNodeTypeToDb(
    type: NodeTypeId,
): NodeType {
    switch (type) {
        case 'text':
            return NodeType.TEXT;
        case 'upload-image':
            return NodeType.UPLOAD_IMAGE;
        case 'upload-video':
            return NodeType.UPLOAD_VIDEO;
        case 'crop-image':
            return NodeType.CROP_IMAGE;
        case 'extract-frame':
            return NodeType.EXTRACT_FRAME;
        case 'llm':
            return NodeType.LLM;
        default: {
            const _exhaustive: never = type;
            throw new Error(`Unsupported node type: ${type}`);
        }
    }
}

/**
 *  * Map Prisma NodeType enum → domain NodeTypeId
 */
export function mapDbNodeTypeToDomain(
    type: NodeType,
): NodeTypeId {
    switch (type) {
        case NodeType.TEXT:
            return 'text';
        case NodeType.UPLOAD_IMAGE:
            return 'upload-image';
        case NodeType.UPLOAD_VIDEO:
            return 'upload-video';
        case NodeType.CROP_IMAGE:
            return 'crop-image';
        case NodeType.EXTRACT_FRAME:
            return 'extract-frame';
        case NodeType.LLM:
            return 'llm';
        default: {
            const _exhaustive: never = type;
            throw new Error(`Unsupported DB node type: ${type}`);
        }
    }
}