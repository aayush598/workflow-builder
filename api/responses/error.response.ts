import { NextResponse } from 'next/server';
import { ApiError } from '../errors/api-error';

export function errorResponse(error: ApiError) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    },
    {
      status: error.statusCode,
    }
  );
}
